package com.kevin.eccvtrip;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Build;
import android.util.Base64;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.google.android.gms.tasks.Task;
import com.google.android.gms.tasks.Tasks;
import com.google.mlkit.common.model.DownloadConditions;
import com.google.mlkit.common.model.RemoteModelManager;
import com.google.mlkit.nl.languageid.IdentifiedLanguage;
import com.google.mlkit.nl.languageid.LanguageIdentification;
import com.google.mlkit.nl.languageid.LanguageIdentifier;
import com.google.mlkit.nl.translate.TranslateLanguage;
import com.google.mlkit.nl.translate.TranslateRemoteModel;
import com.google.mlkit.nl.translate.Translation;
import com.google.mlkit.nl.translate.Translator;
import com.google.mlkit.nl.translate.TranslatorOptions;
import com.google.mlkit.vision.common.InputImage;
import com.google.mlkit.vision.text.TextRecognition;
import com.google.mlkit.vision.text.TextRecognizer;
import com.google.mlkit.vision.text.latin.TextRecognizerOptions;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;

@CapacitorPlugin(name = "OfflineTranslator")
public class OfflineTranslatorPlugin extends Plugin {
    private static final List<String> REQUIRED_LANGUAGE_TAGS = Arrays.asList("en", "fr", "da", "sv", "fi", "zh");
    private static final Set<String> PREFERRED_SOURCE_TAGS = new HashSet<>(Arrays.asList("en", "fr", "da", "sv", "fi"));

    private interface TranslationSuccess {
        void accept(String translatedText, String sourceLanguage);
    }

    private interface TranslationFailure {
        void accept(Exception error);
    }

    @PluginMethod
    public void status(PluginCall call) {
        RemoteModelManager.getInstance()
            .getDownloadedModels(TranslateRemoteModel.class)
            .addOnSuccessListener(models -> {
                Set<String> downloaded = new HashSet<>();
                for (TranslateRemoteModel model : models) {
                    downloaded.add(model.getLanguage());
                }
                JSArray languages = new JSArray();
                for (String language : REQUIRED_LANGUAGE_TAGS) {
                    if (downloaded.contains(language)) languages.put(language);
                }
                JSObject result = new JSObject();
                result.put("available", true);
                result.put("ready", downloaded.containsAll(REQUIRED_LANGUAGE_TAGS));
                result.put("downloadedLanguages", languages);
                result.put("requiredCount", REQUIRED_LANGUAGE_TAGS.size());
                call.resolve(result);
            })
            .addOnFailureListener(error -> call.reject("Could not inspect offline language packs", error));
    }

    @PluginMethod
    public void prepare(PluginCall call) {
        boolean wifiOnly = call.getBoolean("wifiOnly", true);
        DownloadConditions.Builder conditionsBuilder = new DownloadConditions.Builder();
        if (wifiOnly) conditionsBuilder.requireWifi();
        DownloadConditions conditions = conditionsBuilder.build();
        RemoteModelManager manager = RemoteModelManager.getInstance();
        List<Task<Void>> downloads = new ArrayList<>();
        for (String language : REQUIRED_LANGUAGE_TAGS) {
            TranslateRemoteModel model = new TranslateRemoteModel.Builder(language).build();
            downloads.add(manager.download(model, conditions));
        }
        Tasks.whenAll(downloads)
            .addOnSuccessListener(unused -> {
                JSObject result = new JSObject();
                result.put("ready", true);
                result.put("downloadedCount", REQUIRED_LANGUAGE_TAGS.size());
                call.resolve(result);
            })
            .addOnFailureListener(error -> call.reject("Offline language-pack download failed", error));
    }

    @PluginMethod
    public void translateText(PluginCall call) {
        String text = call.getString("text", "").trim();
        String targetLanguage = normalizedLanguage(call.getString("targetLanguage", "zh-Hant"));
        if (text.isEmpty()) {
            call.reject("Text is required");
            return;
        }
        translate(text, targetLanguage,
            (translated, sourceLanguage) -> call.resolve(translationResult(translated, sourceLanguage, targetLanguage, null)),
            error -> call.reject("Offline text translation failed. Download the offline language packs first.", error));
    }

    @PluginMethod
    public void translateImage(PluginCall call) {
        String encodedImage = call.getString("image", "");
        if (encodedImage.isEmpty()) {
            call.reject("Image is required");
            return;
        }
        String targetLanguage = normalizedLanguage(call.getString("targetLanguage", "zh-Hant"));
        try {
            int comma = encodedImage.indexOf(',');
            String payload = comma >= 0 ? encodedImage.substring(comma + 1) : encodedImage;
            byte[] bytes = Base64.decode(payload, Base64.DEFAULT);
            Bitmap bitmap = BitmapFactory.decodeByteArray(bytes, 0, bytes.length);
            if (bitmap == null) {
                call.reject("Image could not be decoded");
                return;
            }
            TextRecognizer recognizer = TextRecognition.getClient(TextRecognizerOptions.DEFAULT_OPTIONS);
            recognizer.process(InputImage.fromBitmap(bitmap, 0))
                .addOnSuccessListener(result -> {
                    String recognizedText = result.getText().trim();
                    recognizer.close();
                    bitmap.recycle();
                    if (recognizedText.isEmpty()) {
                        call.reject("No readable Latin-script text was found in the image");
                        return;
                    }
                    translate(recognizedText, targetLanguage,
                        (translated, sourceLanguage) -> call.resolve(translationResult(translated, sourceLanguage, targetLanguage, recognizedText)),
                        error -> call.reject("Offline image translation failed. Download the offline language packs first.", error));
                })
                .addOnFailureListener(error -> {
                    recognizer.close();
                    bitmap.recycle();
                    call.reject("Offline image text recognition failed", error);
                });
        } catch (IllegalArgumentException error) {
            call.reject("Image data is invalid", error);
        }
    }

    private void translate(String text, String targetLanguage, TranslationSuccess success, TranslationFailure failure) {
        LanguageIdentifier identifier = LanguageIdentification.getClient();
        identifier.identifyPossibleLanguages(text)
            .addOnSuccessListener(languages -> {
                identifier.close();
                String sourceLanguage = chooseSourceLanguage(languages, targetLanguage);
                if (sourceLanguage.equals(targetLanguage)) {
                    success.accept(toTraditionalChineseIfNeeded(text, targetLanguage), sourceLanguage);
                    return;
                }
                TranslatorOptions options = new TranslatorOptions.Builder()
                    .setSourceLanguage(sourceLanguage)
                    .setTargetLanguage(targetLanguage)
                    .build();
                Translator translator = Translation.getClient(options);
                translator.downloadModelIfNeeded()
                    .addOnSuccessListener(unused -> translateLines(translator, text.split("\\n", -1), 0, new ArrayList<>(), sourceLanguage, targetLanguage, success, failure))
                    .addOnFailureListener(error -> {
                        translator.close();
                        failure.accept(error);
                    });
            })
            .addOnFailureListener(error -> {
                identifier.close();
                failure.accept(error);
            });
    }

    private void translateLines(Translator translator, String[] lines, int index, List<String> output,
                                String sourceLanguage, String targetLanguage,
                                TranslationSuccess success, TranslationFailure failure) {
        if (index >= lines.length) {
            translator.close();
            String translated = String.join("\n", output);
            success.accept(toTraditionalChineseIfNeeded(translated, targetLanguage), sourceLanguage);
            return;
        }
        String line = lines[index];
        if (line.trim().isEmpty()) {
            output.add("");
            translateLines(translator, lines, index + 1, output, sourceLanguage, targetLanguage, success, failure);
            return;
        }
        translator.translate(line)
            .addOnSuccessListener(translated -> {
                output.add(translated);
                translateLines(translator, lines, index + 1, output, sourceLanguage, targetLanguage, success, failure);
            })
            .addOnFailureListener(error -> {
                translator.close();
                failure.accept(error);
            });
    }

    private String chooseSourceLanguage(List<IdentifiedLanguage> languages, String targetLanguage) {
        for (IdentifiedLanguage candidate : languages) {
            String tag = normalizedLanguage(candidate.getLanguageTag());
            if (tag.equals(targetLanguage) || PREFERRED_SOURCE_TAGS.contains(tag)) return tag;
        }
        for (IdentifiedLanguage candidate : languages) {
            String tag = normalizedLanguage(candidate.getLanguageTag());
            if (TranslateLanguage.fromLanguageTag(tag) != null) return tag;
        }
        return TranslateLanguage.ENGLISH;
    }

    private String normalizedLanguage(String tag) {
        if (tag == null) return TranslateLanguage.ENGLISH;
        String normalized = tag.toLowerCase(Locale.ROOT);
        if (normalized.startsWith("zh")) return TranslateLanguage.CHINESE;
        String translated = TranslateLanguage.fromLanguageTag(normalized);
        return translated != null ? translated : TranslateLanguage.ENGLISH;
    }

    private String toTraditionalChineseIfNeeded(String text, String targetLanguage) {
        if (!TranslateLanguage.CHINESE.equals(targetLanguage) || Build.VERSION.SDK_INT < Build.VERSION_CODES.Q) return text;
        try {
            return android.icu.text.Transliterator.getInstance("Simplified-Traditional").transliterate(text);
        } catch (RuntimeException ignored) {
            return text;
        }
    }

    private JSObject translationResult(String text, String sourceLanguage, String targetLanguage, String recognizedText) {
        JSObject result = new JSObject();
        result.put("text", text);
        result.put("sourceLanguage", sourceLanguage);
        result.put("targetLanguage", targetLanguage);
        result.put("engine", "Google ML Kit · on-device");
        if (recognizedText != null) result.put("recognizedText", recognizedText);
        return result;
    }
}
