package com.kevin.eccvtrip;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Build;
import android.security.keystore.KeyGenParameterSpec;
import android.security.keystore.KeyPermanentlyInvalidatedException;
import android.security.keystore.KeyProperties;
import android.util.Base64;

import androidx.annotation.NonNull;
import androidx.biometric.BiometricManager;
import androidx.biometric.BiometricPrompt;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.FragmentActivity;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.nio.charset.StandardCharsets;
import java.security.KeyStore;
import java.util.concurrent.Executor;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;

@CapacitorPlugin(name = "Biometrics")
public class BiometricsPlugin extends Plugin {
    private static final String ANDROID_KEYSTORE = "AndroidKeyStore";
    private static final String KEY_ALIAS = "ECCV_BIOMETRIC_VAULT_KEY";
    private static final String PREF_NAME = "eccv_biometric_vault";
    private static final String PREF_CIPHERTEXT = "encrypted_secret";
    private static final String PREF_IV = "initialization_vector";
    private static final int GCM_TAG_LENGTH = 128;

    private SharedPreferences getPrefs() {
        return getContext().getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
    }

    private KeyStore getKeyStore() throws Exception {
        KeyStore keyStore = KeyStore.getInstance(ANDROID_KEYSTORE);
        keyStore.load(null);
        return keyStore;
    }

    private SecretKey getOrCreateKey() throws Exception {
        KeyStore keyStore = getKeyStore();
        if (keyStore.containsAlias(KEY_ALIAS)) {
            KeyStore.Entry entry = keyStore.getEntry(KEY_ALIAS, null);
            if (entry instanceof KeyStore.SecretKeyEntry) {
                return ((KeyStore.SecretKeyEntry) entry).getSecretKey();
            }
        }
        return generateNewKey();
    }

    private SecretKey generateNewKey() throws Exception {
        KeyGenerator keyGenerator = KeyGenerator.getInstance(KeyProperties.KEY_ALGORITHM_AES, ANDROID_KEYSTORE);
        KeyGenParameterSpec.Builder builder = new KeyGenParameterSpec.Builder(
                KEY_ALIAS,
                KeyProperties.PURPOSE_ENCRYPT | KeyProperties.PURPOSE_DECRYPT
        )
                .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
                .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
                .setKeySize(256)
                .setUserAuthenticationRequired(true);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            builder.setUserAuthenticationParameters(0, KeyProperties.AUTH_BIOMETRIC_STRONG);
        } else {
            builder.setUserAuthenticationValidityDurationSeconds(-1);
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            builder.setInvalidatedByBiometricEnrollment(true);
        }

        keyGenerator.init(builder.build());
        return keyGenerator.generateKey();
    }

    private void deleteKeyAndVault() {
        try {
            KeyStore keyStore = getKeyStore();
            if (keyStore.containsAlias(KEY_ALIAS)) {
                keyStore.deleteEntry(KEY_ALIAS);
            }
        } catch (Exception ignored) {
        }
        getPrefs().edit().clear().apply();
    }

    @PluginMethod
    public void checkStatus(PluginCall call) {
        JSObject ret = new JSObject();
        try {
            BiometricManager biometricManager = BiometricManager.from(getContext());
            int canAuth = biometricManager.canAuthenticate(BiometricManager.Authenticators.BIOMETRIC_STRONG);

            boolean isAvailable = (canAuth == BiometricManager.BIOMETRIC_SUCCESS ||
                    canAuth == BiometricManager.BIOMETRIC_ERROR_NONE_ENROLLED);
            boolean hasEnrolled = (canAuth == BiometricManager.BIOMETRIC_SUCCESS);

            SharedPreferences prefs = getPrefs();
            boolean hasStoredCiphertext = prefs.contains(PREF_CIPHERTEXT) && prefs.contains(PREF_IV);

            boolean keyExists = false;
            try {
                KeyStore keyStore = getKeyStore();
                keyExists = keyStore.containsAlias(KEY_ALIAS);
            } catch (Exception ignored) {
            }

            boolean isRegistered = hasStoredCiphertext && keyExists && hasEnrolled;

            ret.put("isAvailable", isAvailable);
            ret.put("hasEnrolledBiometrics", hasEnrolled);
            ret.put("isRegistered", isRegistered);
            ret.put("canUseBiometrics", isAvailable && hasEnrolled);
            call.resolve(ret);
        } catch (Exception e) {
            ret.put("isAvailable", false);
            ret.put("hasEnrolledBiometrics", false);
            ret.put("isRegistered", false);
            ret.put("canUseBiometrics", false);
            ret.put("error", e.getMessage());
            call.resolve(ret);
        }
    }

    @PluginMethod
    public void registerPassword(PluginCall call) {
        String password = call.getString("password");
        if (password == null || password.trim().isEmpty()) {
            call.reject("密碼不可為空");
            return;
        }

        getActivity().runOnUiThread(() -> {
            try {
                // Remove old key and stored data first to start clean
                deleteKeyAndVault();
                SecretKey secretKey = generateNewKey();

                Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
                cipher.init(Cipher.ENCRYPT_MODE, secretKey);

                BiometricPrompt.CryptoObject cryptoObject = new BiometricPrompt.CryptoObject(cipher);
                FragmentActivity activity = (FragmentActivity) getActivity();
                Executor executor = ContextCompat.getMainExecutor(getContext());

                BiometricPrompt biometricPrompt = new BiometricPrompt(activity, executor,
                        new BiometricPrompt.AuthenticationCallback() {
                            @Override
                            public void onAuthenticationSucceeded(@NonNull BiometricPrompt.AuthenticationResult result) {
                                super.onAuthenticationSucceeded(result);
                                try {
                                    Cipher authenticatedCipher = result.getCryptoObject() != null
                                            ? result.getCryptoObject().getCipher()
                                            : null;
                                    if (authenticatedCipher == null) {
                                        call.reject("生物辨識加密核心初始化失敗");
                                        return;
                                    }

                                    byte[] ciphertext = authenticatedCipher.doFinal(password.getBytes(StandardCharsets.UTF_8));
                                    byte[] iv = authenticatedCipher.getIV();

                                    String cipherBase64 = Base64.encodeToString(ciphertext, Base64.NO_WRAP);
                                    String ivBase64 = Base64.encodeToString(iv, Base64.NO_WRAP);

                                    getPrefs().edit()
                                            .putString(PREF_CIPHERTEXT, cipherBase64)
                                            .putString(PREF_IV, ivBase64)
                                            .apply();

                                    JSObject ret = new JSObject();
                                    ret.put("success", true);
                                    call.resolve(ret);
                                } catch (Exception e) {
                                    deleteKeyAndVault();
                                    call.reject("加密儲存失敗: " + e.getMessage());
                                }
                            }

                            @Override
                            public void onAuthenticationError(int errorCode, @NonNull CharSequence errString) {
                                super.onAuthenticationError(errorCode, errString);
                                deleteKeyAndVault();
                                JSObject ret = new JSObject();
                                ret.put("success", false);
                                ret.put("cancelled", errorCode == BiometricPrompt.ERROR_USER_CANCELED ||
                                        errorCode == BiometricPrompt.ERROR_NEGATIVE_BUTTON);
                                ret.put("message", errString.toString());
                                call.resolve(ret);
                            }

                            @Override
                            public void onAuthenticationFailed() {
                                super.onAuthenticationFailed();
                                // Individual fingerprint attempt failed, prompt stays open for another try
                            }
                        });

                BiometricPrompt.PromptInfo promptInfo = new BiometricPrompt.PromptInfo.Builder()
                        .setTitle("啟用指紋快速出示")
                        .setSubtitle("感應 Samsung S23 指紋以安全綁定票券憑證")
                        .setDescription("金鑰存放於 Samsung Knox 硬體安全晶片中，不具備密碼直接洩漏風險。")
                        .setNegativeButtonText("取消")
                        .setAllowedAuthenticators(BiometricManager.Authenticators.BIOMETRIC_STRONG)
                        .build();

                biometricPrompt.authenticate(promptInfo, cryptoObject);
            } catch (Exception e) {
                deleteKeyAndVault();
                call.reject("初始化指紋綁定失敗: " + e.getMessage());
            }
        });
    }

    @PluginMethod
    public void authenticateAndGetPassword(PluginCall call) {
        SharedPreferences prefs = getPrefs();
        String cipherBase64 = prefs.getString(PREF_CIPHERTEXT, null);
        String ivBase64 = prefs.getString(PREF_IV, null);

        if (cipherBase64 == null || ivBase64 == null) {
            JSObject ret = new JSObject();
            ret.put("success", false);
            ret.put("code", "NOT_REGISTERED");
            ret.put("message", "尚未綁定指紋快速解鎖");
            call.resolve(ret);
            return;
        }

        getActivity().runOnUiThread(() -> {
            try {
                KeyStore keyStore = getKeyStore();
                if (!keyStore.containsAlias(KEY_ALIAS)) {
                    deleteKeyAndVault();
                    JSObject ret = new JSObject();
                    ret.put("success", false);
                    ret.put("code", "KEY_NOT_FOUND");
                    ret.put("message", "硬體安全金鑰不存在，請重新輸入密碼");
                    call.resolve(ret);
                    return;
                }

                SecretKey secretKey = (SecretKey) keyStore.getKey(KEY_ALIAS, null);
                byte[] iv = Base64.decode(ivBase64, Base64.NO_WRAP);
                byte[] ciphertext = Base64.decode(cipherBase64, Base64.NO_WRAP);

                Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
                GCMParameterSpec spec = new GCMParameterSpec(GCM_TAG_LENGTH, iv);
                cipher.init(Cipher.DECRYPT_MODE, secretKey, spec);

                BiometricPrompt.CryptoObject cryptoObject = new BiometricPrompt.CryptoObject(cipher);
                FragmentActivity activity = (FragmentActivity) getActivity();
                Executor executor = ContextCompat.getMainExecutor(getContext());

                BiometricPrompt biometricPrompt = new BiometricPrompt(activity, executor,
                        new BiometricPrompt.AuthenticationCallback() {
                            @Override
                            public void onAuthenticationSucceeded(@NonNull BiometricPrompt.AuthenticationResult result) {
                                super.onAuthenticationSucceeded(result);
                                try {
                                    Cipher authenticatedCipher = result.getCryptoObject() != null
                                            ? result.getCryptoObject().getCipher()
                                            : null;
                                    if (authenticatedCipher == null) {
                                        call.reject("生物辨識解密核心失效");
                                        return;
                                    }

                                    byte[] decryptedBytes = authenticatedCipher.doFinal(ciphertext);
                                    String password = new String(decryptedBytes, StandardCharsets.UTF_8);

                                    JSObject ret = new JSObject();
                                    ret.put("success", true);
                                    ret.put("password", password);
                                    call.resolve(ret);
                                } catch (Exception e) {
                                    JSObject ret = new JSObject();
                                    ret.put("success", false);
                                    ret.put("code", "DECRYPT_ERROR");
                                    ret.put("message", "解密失敗: " + e.getMessage());
                                    call.resolve(ret);
                                }
                            }

                            @Override
                            public void onAuthenticationError(int errorCode, @NonNull CharSequence errString) {
                                super.onAuthenticationError(errorCode, errString);
                                JSObject ret = new JSObject();
                                ret.put("success", false);
                                ret.put("code", (errorCode == BiometricPrompt.ERROR_USER_CANCELED ||
                                        errorCode == BiometricPrompt.ERROR_NEGATIVE_BUTTON)
                                        ? "USER_CANCELLED" : "AUTH_ERROR");
                                ret.put("message", errString.toString());
                                call.resolve(ret);
                            }

                            @Override
                            public void onAuthenticationFailed() {
                                super.onAuthenticationFailed();
                                // Individual attempt failed, prompt stays open
                            }
                        });

                BiometricPrompt.PromptInfo promptInfo = new BiometricPrompt.PromptInfo.Builder()
                        .setTitle("出示票券憑證")
                        .setSubtitle("感應 Samsung S23 指紋以快速出示")
                        .setNegativeButtonText("改用密碼輸入")
                        .setAllowedAuthenticators(BiometricManager.Authenticators.BIOMETRIC_STRONG)
                        .build();

                biometricPrompt.authenticate(promptInfo, cryptoObject);
            } catch (KeyPermanentlyInvalidatedException e) {
                // Triggered if new fingerprints were enrolled in Android system settings
                deleteKeyAndVault();
                JSObject ret = new JSObject();
                ret.put("success", false);
                ret.put("code", "KEY_INVALIDATED");
                ret.put("message", "系統指紋生物辨識資訊已變更，基於安全考量已自動清除綁定，請重新輸入密碼。");
                call.resolve(ret);
            } catch (Exception e) {
                JSObject ret = new JSObject();
                ret.put("success", false);
                ret.put("code", "ERROR");
                ret.put("message", "生物辨識驗證啟動失敗: " + e.getMessage());
                call.resolve(ret);
            }
        });
    }

    @PluginMethod
    public void clearRegistration(PluginCall call) {
        deleteKeyAndVault();
        JSObject ret = new JSObject();
        ret.put("success", true);
        call.resolve(ret);
    }
}
