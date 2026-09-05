package com.kevin.eccvtrip;

import android.os.Handler;
import android.os.Looper;
import android.webkit.WebView;
import android.widget.Toast;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "AppUpdater")
public class AppUpdaterPlugin extends Plugin {

    @PluginMethod
    public void clearCacheAndExit(PluginCall call) {
        getActivity().runOnUiThread(() -> {
            try {
                WebView webView = getBridge() != null ? getBridge().getWebView() : null;
                if (webView != null) {
                    webView.clearCache(true);
                }
            } catch (Exception ignored) {
            }

            Toast.makeText(getContext(), "快取已清除（保留行李清單），App 即將關閉", Toast.LENGTH_SHORT).show();
            call.resolve();

            new Handler(Looper.getMainLooper()).postDelayed(() -> {
                if (getActivity() != null) {
                    getActivity().finishAffinity();
                    System.exit(0);
                }
            }, 800);
        });
    }
}
