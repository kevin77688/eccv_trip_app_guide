(function () {
  "use strict";

  function isNativeAndroid() {
    const capacitor = window.Capacitor;
    return Boolean(
      capacitor &&
      typeof capacitor.isNativePlatform === "function" &&
      capacitor.isNativePlatform() &&
      capacitor.getPlatform?.() === "android"
    );
  }

  function getBiometricsPlugin() {
    if (!isNativeAndroid()) return null;
    const capacitor = window.Capacitor;
    if (capacitor.isPluginAvailable?.("Biometrics")) {
      return capacitor.Plugins?.Biometrics || capacitor.registerPlugin?.("Biometrics");
    }
    return capacitor.Plugins?.Biometrics || null;
  }

  async function checkBiometricsStatus() {
    if (!isNativeAndroid()) {
      return { isAvailable: false, hasEnrolledBiometrics: false, isRegistered: false, canUseBiometrics: false };
    }
    const biometrics = getBiometricsPlugin();
    if (!biometrics) {
      return { isAvailable: false, hasEnrolledBiometrics: false, isRegistered: false, canUseBiometrics: false };
    }
    try {
      const res = await biometrics.checkStatus();
      return res || { isAvailable: false, hasEnrolledBiometrics: false, isRegistered: false, canUseBiometrics: false };
    } catch (err) {
      console.warn("checkBiometricsStatus error:", err);
      return { isAvailable: false, hasEnrolledBiometrics: false, isRegistered: false, canUseBiometrics: false };
    }
  }

  async function registerPassword(password) {
    const biometrics = getBiometricsPlugin();
    if (!biometrics) throw new Error("Biometrics plugin unavailable");
    return biometrics.registerPassword({ password });
  }

  async function authenticateAndGetPassword() {
    const biometrics = getBiometricsPlugin();
    if (!biometrics) throw new Error("Biometrics plugin unavailable");
    return biometrics.authenticateAndGetPassword();
  }

  async function clearRegistration() {
    const biometrics = getBiometricsPlugin();
    if (!biometrics) return;
    return biometrics.clearRegistration();
  }

  function getOfflineTranslatorPlugin() {
    if (!isNativeAndroid()) return null;
    const capacitor = window.Capacitor;
    if (capacitor.isPluginAvailable?.("OfflineTranslator")) {
      return capacitor.Plugins?.OfflineTranslator || capacitor.registerPlugin?.("OfflineTranslator");
    }
    return capacitor.Plugins?.OfflineTranslator || null;
  }
  function getAppUpdaterPlugin() {
    if (!isNativeAndroid()) return null;
    const capacitor = window.Capacitor;
    if (capacitor.isPluginAvailable?.("AppUpdater")) {
      return capacitor.Plugins?.AppUpdater || capacitor.registerPlugin?.("AppUpdater");
    }
    return capacitor.Plugins?.AppUpdater || null;
  }

  async function clearCacheAndExit() {
    try {
      if ("caches" in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      }
      if ("serviceWorker" in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map((r) => r.unregister()));
      }
      try { sessionStorage.clear(); } catch (_) {}
    } catch (e) {
      console.warn("clearCache error:", e);
    }

    const updater = getAppUpdaterPlugin();
    if (updater) {
      try {
        await updater.clearCacheAndExit();
        return;
      } catch (err) {
        console.warn("Native clearCacheAndExit error:", err);
      }
    }
    window.location.reload(true);
  }


  window.ECCV_ANDROID = {
    isNative: isNativeAndroid,
    getBiometrics: getBiometricsPlugin,
    checkBiometricsStatus: checkBiometricsStatus,
    registerPassword: registerPassword,
    authenticateAndGetPassword: authenticateAndGetPassword,
    clearRegistration: clearRegistration,
    getOfflineTranslator: getOfflineTranslatorPlugin,
    clearCacheAndExit: clearCacheAndExit
  };
})();
