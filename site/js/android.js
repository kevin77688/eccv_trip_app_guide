(function () {
  "use strict";

  const STORAGE_KEY = "eccv_bio_vault_v1";

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

  function bufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  function base64ToBuffer(base64) {
    const binary = window.atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }

  function detectDeviceType() {
    if (isNativeAndroid()) {
      return { type: "android", label: "Samsung S23 指紋", icon: "👆" };
    }
    const ua = navigator.userAgent || "";
    const platform = navigator.platform || "";
    const maxTouchPoints = navigator.maxTouchPoints || 0;
    const isIOS = /iPhone|iPad|iPod/.test(ua) || (platform === "MacIntel" && maxTouchPoints > 1);
    const isMac = /Macintosh|Mac OS X/.test(ua) && !isIOS;

    if (isMac) {
      return { type: "apple-mac", label: "MacBook Touch ID", icon: "👆" };
    }
    if (isIOS) {
      return { type: "apple-ios", label: "Apple Face ID / Touch ID", icon: "👤" };
    }
    return { type: "webauthn", label: "生物辨識金鑰", icon: "🔑" };
  }

  async function checkBiometricsStatus() {
    if (isNativeAndroid()) {
      const biometrics = getBiometricsPlugin();
      if (!biometrics) {
        return { isAvailable: false, hasEnrolledBiometrics: false, isRegistered: false, canUseBiometrics: false };
      }
      try {
        const res = await biometrics.checkStatus();
        return {
          isAvailable: Boolean(res?.isAvailable),
          hasEnrolledBiometrics: Boolean(res?.hasEnrolledBiometrics),
          isRegistered: Boolean(res?.isRegistered),
          canUseBiometrics: Boolean(res?.canUseBiometrics),
          deviceType: "android",
          deviceLabel: "Samsung S23 指紋",
          deviceIcon: "👆"
        };
      } catch (err) {
        console.warn("Native checkBiometricsStatus error:", err);
        return { isAvailable: false, hasEnrolledBiometrics: false, isRegistered: false, canUseBiometrics: false };
      }
    }

    // Web / Apple WebAuthn platform authenticator check
    if (!window.isSecureContext || !window.PublicKeyCredential || typeof window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable !== "function") {
      return { isAvailable: false, hasEnrolledBiometrics: false, isRegistered: false, canUseBiometrics: false };
    }

    try {
      const isAvailable = await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      if (!isAvailable) {
        return { isAvailable: false, hasEnrolledBiometrics: false, isRegistered: false, canUseBiometrics: false };
      }

      let isRegistered = false;
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          isRegistered = Boolean(parsed && parsed.credId && parsed.ciphertext && parsed.iv && parsed.salt);
        }
      } catch (_) {}

      const deviceInfo = detectDeviceType();
      return {
        isAvailable: true,
        hasEnrolledBiometrics: true,
        isRegistered: isRegistered,
        canUseBiometrics: true,
        deviceType: deviceInfo.type,
        deviceLabel: deviceInfo.label,
        deviceIcon: deviceInfo.icon
      };
    } catch (err) {
      console.warn("WebAuthn check error:", err);
      return { isAvailable: false, hasEnrolledBiometrics: false, isRegistered: false, canUseBiometrics: false };
    }
  }

  async function registerPassword(password) {
    if (!password || !password.trim()) {
      throw new Error("密碼不可為空");
    }

    if (isNativeAndroid()) {
      const biometrics = getBiometricsPlugin();
      if (!biometrics) throw new Error("Biometrics plugin unavailable");
      return biometrics.registerPassword({ password });
    }

    // WebAuthn enrollment
    if (!window.isSecureContext || !navigator.credentials?.create) {
      throw new Error("此環境不支援安全生物辨識憑證註冊");
    }

    const challenge = window.crypto.getRandomValues(new Uint8Array(32));
    const userId = window.crypto.getRandomValues(new Uint8Array(16));

    const credential = await navigator.credentials.create({
      publicKey: {
        challenge: challenge,
        rp: {
          name: "ECCV 2026 Trip Guide",
          id: window.location.hostname
        },
        user: {
          id: userId,
          name: "traveler",
          displayName: "ECCV 2026 Traveler"
        },
        pubKeyCredParams: [
          { alg: -7, type: "public-key" },  // ES256
          { alg: -257, type: "public-key" } // RS256
        ],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "required",
          requireResidentKey: false
        },
        timeout: 60000,
        attestation: "none"
      }
    });

    if (!credential || !credential.rawId) {
      throw new Error("生物辨識建立憑證失敗");
    }

    // Derive local encryption key from credential.rawId + salt
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    const keyMaterial = await window.crypto.subtle.importKey(
      "raw",
      credential.rawId,
      { name: "PBKDF2" },
      false,
      ["deriveKey"]
    );

    const aesKey = await window.crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: salt,
        iterations: 100000,
        hash: "SHA-256"
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt"]
    );

    const enc = new TextEncoder();
    const ciphertext = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv: iv },
      aesKey,
      enc.encode(password)
    );

    const vault = {
      credId: bufferToBase64(credential.rawId),
      salt: bufferToBase64(salt.buffer),
      iv: bufferToBase64(iv.buffer),
      ciphertext: bufferToBase64(ciphertext)
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(vault));
    return { success: true };
  }

  async function authenticateAndGetPassword() {
    if (isNativeAndroid()) {
      const biometrics = getBiometricsPlugin();
      if (!biometrics) throw new Error("Biometrics plugin unavailable");
      return biometrics.authenticateAndGetPassword();
    }

    // WebAuthn authentication
    let vault = null;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) vault = JSON.parse(stored);
    } catch (_) {}

    if (!vault || !vault.credId || !vault.ciphertext || !vault.iv || !vault.salt) {
      return { success: false, code: "NOT_REGISTERED", message: "尚未綁定生物辨識快速出示" };
    }

    if (!window.isSecureContext || !navigator.credentials?.get) {
      return { success: false, code: "UNAVAILABLE", message: "目前環境不支援生物辨識登入" };
    }

    const challenge = window.crypto.getRandomValues(new Uint8Array(32));
    const credIdBuffer = base64ToBuffer(vault.credId);

    let assertion;
    try {
      assertion = await navigator.credentials.get({
        publicKey: {
          challenge: challenge,
          allowCredentials: [{
            id: credIdBuffer,
            type: "public-key"
          }],
          userVerification: "required",
          timeout: 60000
        }
      });
    } catch (err) {
      const isCancelled = err.name === "NotAllowedError" || err.name === "AbortError";
      return {
        success: false,
        code: isCancelled ? "USER_CANCELLED" : "AUTH_ERROR",
        message: isCancelled ? "已取消生物辨識驗證" : (err.message || "生物辨識驗證失敗")
      };
    }

    if (!assertion || !assertion.rawId) {
      return { success: false, code: "AUTH_ERROR", message: "未能取得生物辨識授權憑證" };
    }

    try {
      const salt = new Uint8Array(base64ToBuffer(vault.salt));
      const iv = new Uint8Array(base64ToBuffer(vault.iv));
      const ciphertext = base64ToBuffer(vault.ciphertext);

      const keyMaterial = await window.crypto.subtle.importKey(
        "raw",
        assertion.rawId,
        { name: "PBKDF2" },
        false,
        ["deriveKey"]
      );

      const aesKey = await window.crypto.subtle.deriveKey(
        {
          name: "PBKDF2",
          salt: salt,
          iterations: 100000,
          hash: "SHA-256"
        },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        false,
        ["decrypt"]
      );

      const decrypted = await window.crypto.subtle.decrypt(
        { name: "AES-GCM", iv: iv },
        aesKey,
        ciphertext
      );

      const dec = new TextDecoder();
      const password = dec.decode(decrypted);
      return { success: true, password: password };
    } catch (err) {
      return { success: false, code: "DECRYPT_ERROR", message: "生物憑證密文解密失敗: " + err.message };
    }
  }

  async function clearRegistration() {
    if (isNativeAndroid()) {
      const biometrics = getBiometricsPlugin();
      if (biometrics) {
        await biometrics.clearRegistration();
      }
    }
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_) {}
    return { success: true };
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

  const eccvBio = {
    isNative: isNativeAndroid,
    getBiometrics: getBiometricsPlugin,
    checkBiometricsStatus: checkBiometricsStatus,
    registerPassword: registerPassword,
    authenticateAndGetPassword: authenticateAndGetPassword,
    clearRegistration: clearRegistration,
    detectDeviceType: detectDeviceType,
    getOfflineTranslator: getOfflineTranslatorPlugin,
    clearCacheAndExit: clearCacheAndExit
  };

  window.ECCV_ANDROID = eccvBio;
  window.ECCV_BIO = eccvBio;
})();
