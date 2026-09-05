(function () {
  "use strict";

  let activeTicketBlobUrl = null;
  let pdfJsLoadingPromise = null;
  let modalPushedState = false;

  function getCore() {
    return window.ECCV_CORE || {
      esc: function (v) {
        if (v == null) return "";
        return String(v)
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#39;");
      },
      assetPath: function (p) {
        const isDay = document.body && document.body.dataset.page === "day";
        return (isDay ? "../" : "./") + p.replace(/^\.\//, "");
      }
    };
  }

  function getAndroid() {
    return window.ECCV_ANDROID || {
      isNative: function () { return false; },
      getBiometrics: function () { return null; },
      checkBiometricsStatus: async function () {
        return { isAvailable: false, hasEnrolledBiometrics: false, isRegistered: false, canUseBiometrics: false };
      }
    };
  }

  function loadPdfJs() {
    if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
    if (pdfJsLoadingPromise) return pdfJsLoadingPromise;

    const core = getCore();
    pdfJsLoadingPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = core.assetPath("vendor/pdfjs/pdf.min.js");
      script.onload = () => {
        if (window.pdfjsLib) {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = core.assetPath("vendor/pdfjs/pdf.worker.min.js");
          resolve(window.pdfjsLib);
        } else {
          pdfJsLoadingPromise = null;
          reject(new Error("PDF.js 初始化失敗"));
        }
      };
      script.onerror = () => {
        pdfJsLoadingPromise = null;
        reject(new Error("無法載入 PDF.js 模組"));
      };
      document.head.appendChild(script);
    });
    return pdfJsLoadingPromise;
  }

  function handleModalKeydown(e) {
    if (e.key === "Escape") {
      closeTicketModal();
    }
  }

  function closeTicketModal() {
    const modal = document.getElementById("ticket-modal-root");
    if (activeTicketBlobUrl) {
      URL.revokeObjectURL(activeTicketBlobUrl);
      activeTicketBlobUrl = null;
    }
    if (modal) {
      modal.remove();
    }
    if (modalPushedState) {
      modalPushedState = false;
      if (history.state && history.state.eccvModal === "ticket") {
        history.back();
      }
    }
    document.body.style.overflow = "";
    document.removeEventListener("keydown", handleModalKeydown);
  }

  async function decryptTicket(encUrl, password) {
    const resp = await fetch(encUrl);
    if (!resp.ok) {
      throw new Error(`無法載入加密票券檔案 (${resp.status})`);
    }
    const buffer = await resp.arrayBuffer();
    if (buffer.byteLength < 28) {
      throw new Error("加密檔案格式損毀");
    }

    const salt = buffer.slice(0, 16);
    const iv = buffer.slice(16, 28);
    const ciphertextWithTag = buffer.slice(28);

    const enc = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
      "raw",
      enc.encode(password),
      { name: "PBKDF2" },
      false,
      ["deriveKey"]
    );

    const aesKey = await window.crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: salt,
        iterations: 600000,
        hash: "SHA-256"
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["decrypt"]
    );

    let decryptedBuffer;
    try {
      decryptedBuffer = await window.crypto.subtle.decrypt(
        { name: "AES-GCM", iv: iv },
        aesKey,
        ciphertextWithTag
      );
    } catch (_) {
      throw new Error("密碼錯誤，請確認後重新輸入。");
    }

    const view = new Uint8Array(decryptedBuffer);
    const mimeLen = view[0];
    const mimeBytes = view.slice(1, 1 + mimeLen);
    const mimeType = new TextDecoder().decode(mimeBytes);
    const fileBytes = view.slice(1 + mimeLen);

    const blob = new Blob([fileBytes], { type: mimeType });
    const objectUrl = URL.createObjectURL(blob);
    return { objectUrl, mimeType, fileBytes };
  }

  function setupTouchZoom(viewportEl, targetEl, displayEl, zoomInBtn, zoomOutBtn, resetBtn) {
    if (!viewportEl || !targetEl) return;

    let scale = 1.0;
    let translateX = 0;
    let translateY = 0;
    let isPinching = false;
    let startDistance = 0;
    let startScale = 1.0;
    let isPanning = false;
    let lastTouchX = 0;
    let lastTouchY = 0;
    let lastTapTime = 0;

    function clampBounds() {
      if (scale <= 1.05) {
        translateX = 0;
        translateY = 0;
        return;
      }
      const maxPanX = Math.max(0, (targetEl.offsetWidth * (scale - 1)) / 2 + 80);
      const maxPanY = Math.max(0, (targetEl.offsetHeight * (scale - 1)) / 2 + 120);
      translateX = Math.max(-maxPanX, Math.min(maxPanX, translateX));
      translateY = Math.max(-maxPanY, Math.min(maxPanY, translateY));
    }

    function applyTransform(withTransition) {
      targetEl.style.transition = withTransition ? "transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)" : "none";
      targetEl.style.transformOrigin = "center top";
      targetEl.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`;

      if (displayEl) {
        displayEl.textContent = `${Math.round(scale * 100)}%`;
      }
      if (scale > 1.05) {
        viewportEl.classList.add("is-zoomed");
      } else {
        viewportEl.classList.remove("is-zoomed");
      }
    }

    viewportEl.addEventListener("touchstart", (e) => {
      if (e.touches.length === 2) {
        isPinching = true;
        isPanning = false;
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        startDistance = Math.hypot(dx, dy);
        startScale = scale;
        return;
      }

      if (e.touches.length === 1) {
        const now = Date.now();
        if (now - lastTapTime < 320) {
          e.preventDefault();
          if (scale > 1.25) {
            scale = 1.0;
            translateX = 0;
            translateY = 0;
          } else {
            scale = 2.2;
            const rect = viewportEl.getBoundingClientRect();
            const tapX = e.touches[0].clientX - rect.left - rect.width / 2;
            translateX = -tapX * 0.7;
            clampBounds();
          }
          applyTransform(true);
          lastTapTime = 0;
          return;
        }
        lastTapTime = now;

        if (scale > 1.05) {
          isPanning = true;
          lastTouchX = e.touches[0].clientX;
          lastTouchY = e.touches[0].clientY;
        }
      }
    }, { passive: false });

    viewportEl.addEventListener("touchmove", (e) => {
      if (isPinching && e.touches.length === 2) {
        e.preventDefault();
        e.stopPropagation();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const currentDistance = Math.hypot(dx, dy);
        const factor = currentDistance / (startDistance || 1);
        scale = Math.min(4.0, Math.max(1.0, startScale * factor));
        clampBounds();
        applyTransform(false);
        return;
      }

      if (isPanning && e.touches.length === 1 && scale > 1.05) {
        e.preventDefault();
        const dx = e.touches[0].clientX - lastTouchX;
        const dy = e.touches[0].clientY - lastTouchY;
        lastTouchX = e.touches[0].clientX;
        lastTouchY = e.touches[0].clientY;
        translateX += dx;
        translateY += dy;
        clampBounds();
        applyTransform(false);
      }
    }, { passive: false });

    function handleTouchEnd(e) {
      if (e.touches.length < 2) {
        isPinching = false;
      }
      if (e.touches.length === 0) {
        isPanning = false;
        if (scale < 1.08) {
          scale = 1.0;
          translateX = 0;
          translateY = 0;
          applyTransform(true);
        } else {
          clampBounds();
          applyTransform(true);
        }
      }
    }

    viewportEl.addEventListener("touchend", handleTouchEnd, { passive: true });
    viewportEl.addEventListener("touchcancel", handleTouchEnd, { passive: true });

    zoomInBtn?.addEventListener("click", () => {
      scale = Math.min(4.0, scale + 0.35);
      clampBounds();
      applyTransform(true);
    });

    zoomOutBtn?.addEventListener("click", () => {
      scale = Math.max(1.0, scale - 0.35);
      clampBounds();
      applyTransform(true);
    });

    resetBtn?.addEventListener("click", () => {
      scale = 1.0;
      translateX = 0;
      translateY = 0;
      applyTransform(true);
    });
  }

  function openTicketModal(ticketId) {
    const trip = window.TRIP || {};
    const ticket = (trip.tickets || []).find((t) => t.id === ticketId);
    if (!ticket) return;

    const core = getCore();
    const android = getAndroid();
    const esc = core.esc;
    const assetPath = core.assetPath;

    closeTicketModal();

    try {
      history.pushState({ eccvModal: "ticket" }, "");
      modalPushedState = true;
    } catch (_) {}

    const modal = document.createElement("div");
    modal.id = "ticket-modal-root";
    modal.className = "ticket-modal-overlay";
    modal.innerHTML = `
      <div class="ticket-modal-container" role="dialog" aria-modal="true" aria-labelledby="ticket-modal-title">
        <header class="ticket-modal-header">
          <div class="ticket-modal-title-group">
            <span class="ticket-badge">${esc(ticket.badge)}</span>
            <h2 id="ticket-modal-title">${esc(ticket.title)}</h2>
            <small>${esc(ticket.subtitle)}</small>
          </div>
          <div class="ticket-modal-actions">
            <button type="button" class="ticket-modal-action-btn ticket-modal-toggle-size" id="ticket-modal-toggle-size" aria-label="全螢幕放大" title="全螢幕放大">
              <span class="size-icon" aria-hidden="true">⛶</span>
              <span class="size-label">放大</span>
            </button>
            <button type="button" class="ticket-modal-close" aria-label="關閉" data-ticket-action="close">✕</button>
          </div>
        </header>

        <div class="ticket-modal-body" id="ticket-modal-body">
          <div class="ticket-prompt-view" id="ticket-prompt-view">
            <div class="ticket-biometric-card" id="ticket-biometric-card" hidden>
              <div class="ticket-biometric-icon" id="ticket-bio-icon" aria-hidden="true">👆</div>
              <div class="ticket-biometric-info">
                <h3 id="ticket-bio-title">生物辨識快速出示</h3>
                <p id="ticket-bio-desc">感應生物辨識，立即驗證出示票券憑證</p>
              </div>
              <div class="ticket-error-msg" id="ticket-bio-error-msg" hidden></div>
              <div class="ticket-biometric-actions">
                <button type="button" class="button button-primary ticket-biometric-btn" id="ticket-trigger-bio-btn">
                  <span id="ticket-bio-btn-text">👆 感應出示</span>
                </button>
                <button type="button" class="ticket-biometric-fallback-btn" id="ticket-switch-password-btn">
                  改用密碼輸入
                </button>
              </div>
            </div>

            <div class="ticket-password-view" id="ticket-password-view">
              <div class="ticket-security-notice">
                <span class="security-shield" aria-hidden="true">🎫</span>
                <div>
                  <strong>票券驗證</strong>
                  <p>請輸入密碼以出示憑證，關閉後即自動銷毀記憶體暫存。</p>
                </div>
              </div>

              <form class="ticket-password-form" id="ticket-password-form">
                <label for="ticket-password-input">請輸入通關密碼</label>
                <div class="ticket-input-row">
                  <input
                    type="password"
                    id="ticket-password-input"
                    class="ticket-password-input"
                    placeholder="請輸入密碼"
                    autocomplete="off"
                    autocorrect="off"
                    autocapitalize="off"
                    spellcheck="false"
                    required
                  />
                  <button type="button" class="ticket-toggle-eye" aria-label="顯示或隱藏密碼">👁️</button>
                </div>

                <div class="ticket-error-msg" id="ticket-error-msg" hidden></div>

                <div class="ticket-form-actions">
                  <button type="submit" class="button button-primary ticket-submit-btn" id="ticket-submit-btn">
                    <span class="btn-spinner" hidden>⏳ </span>
                    <span class="btn-text">出示憑證與 QR 碼</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleModalKeydown);

    function setModalMaximized(maximized) {
      const isMax = !!maximized;
      modal.classList.toggle("is-maximized", isMax);
      const container = modal.querySelector(".ticket-modal-container");
      container?.classList.toggle("is-maximized", isMax);
      const toggleBtn = modal.querySelector("#ticket-modal-toggle-size");
      if (toggleBtn) {
        const icon = toggleBtn.querySelector(".size-icon");
        const label = toggleBtn.querySelector(".size-label");
        if (isMax) {
          if (icon) icon.textContent = "🗗";
          if (label) label.textContent = "還原";
          toggleBtn.setAttribute("title", "還原視窗大小");
          toggleBtn.setAttribute("aria-label", "還原視窗大小");
        } else {
          if (icon) icon.textContent = "⛶";
          if (label) label.textContent = "放大";
          toggleBtn.setAttribute("title", "全螢幕放大");
          toggleBtn.setAttribute("aria-label", "全螢幕放大");
        }
      }
    }

    modal.querySelector("#ticket-modal-toggle-size")?.addEventListener("click", () => {
      const currentlyMax = modal.classList.contains("is-maximized");
      setModalMaximized(!currentlyMax);
    });

    const bioCard = modal.querySelector("#ticket-biometric-card");
    const pwdView = modal.querySelector("#ticket-password-view");
    const bioErrorMsg = modal.querySelector("#ticket-bio-error-msg");
    const triggerBioBtn = modal.querySelector("#ticket-trigger-bio-btn");
    const switchPwdBtn = modal.querySelector("#ticket-switch-password-btn");

    const form = modal.querySelector("#ticket-password-form");
    const input = modal.querySelector("#ticket-password-input");
    const eyeBtn = modal.querySelector(".ticket-toggle-eye");
    const errorMsg = modal.querySelector("#ticket-error-msg");
    const submitBtn = modal.querySelector("#ticket-submit-btn");
    const btnSpinner = modal.querySelector(".btn-spinner");
    const btnText = modal.querySelector(".btn-text");

    function switchToPasswordView(message) {
      if (bioCard) bioCard.hidden = true;
      if (pwdView) pwdView.hidden = false;
      if (message && errorMsg) {
        errorMsg.textContent = message;
        errorMsg.hidden = false;
      }
      setTimeout(() => input?.focus(), 50);
    }

    async function triggerBiometricAuth() {
      if (!bioCard || bioCard.hidden) return;
      if (triggerBioBtn) triggerBioBtn.disabled = true;
      if (bioErrorMsg) bioErrorMsg.hidden = true;

      try {
        const res = await android.authenticateAndGetPassword();
        if (res && res.success && res.password) {
          await renderDecryptedView(res.password);
        } else {
          if (triggerBioBtn) triggerBioBtn.disabled = false;
          if (res && res.code === "USER_CANCELLED") {
            switchToPasswordView();
          } else if (res && res.code === "KEY_INVALIDATED") {
            switchToPasswordView(res.message || "系統生物辨識資訊變更，基於安全考量已自動清除綁定，請重新輸入密碼。");
          } else if (res && res.message) {
            if (bioErrorMsg) {
              bioErrorMsg.textContent = res.message;
              bioErrorMsg.hidden = false;
            }
          }
        }
      } catch (err) {
        if (triggerBioBtn) triggerBioBtn.disabled = false;
        switchToPasswordView(err.message || "生物辨識啟動失敗，請輸入密碼。");
      }
    }

    switchPwdBtn?.addEventListener("click", () => switchToPasswordView());
    triggerBioBtn?.addEventListener("click", () => triggerBiometricAuth());

    (async () => {
      try {
        const bioStatus = await android.checkBiometricsStatus();
        if (bioStatus && bioStatus.canUseBiometrics) {
          const deviceLabel = bioStatus.deviceLabel || "生物辨識";
          const deviceIcon = bioStatus.deviceIcon || "👆";
          const bioIconEl = modal.querySelector("#ticket-bio-icon");
          const bioTitleEl = modal.querySelector("#ticket-bio-title");
          const bioDescEl = modal.querySelector("#ticket-bio-desc");
          const bioBtnTextEl = modal.querySelector("#ticket-bio-btn-text");

          if (bioIconEl) bioIconEl.textContent = deviceIcon;
          if (bioTitleEl) bioTitleEl.textContent = `${deviceLabel} 快速出示`;
          if (bioDescEl) bioDescEl.textContent = `感應 ${deviceLabel}，立即驗證出示票券憑證`;
          if (bioBtnTextEl) bioBtnTextEl.textContent = `${deviceIcon} 感應 ${deviceLabel} 出示`;

          if (bioStatus.isRegistered) {
            if (bioCard) bioCard.hidden = false;
            if (pwdView) pwdView.hidden = true;
            setTimeout(() => triggerBiometricAuth(), 120);
            return;
          }
        }
        setTimeout(() => input?.focus(), 50);
      } catch (_) {
        setTimeout(() => input?.focus(), 50);
      }
    })();

    eyeBtn?.addEventListener("click", () => {
      const isPwd = input.type === "password";
      input.type = isPwd ? "text" : "password";
      eyeBtn.textContent = isPwd ? "🙈" : "👁️";
    });

    async function renderDecryptedView(password) {
      const encUrl = assetPath(`assets/tickets/${ticket.encFile}`);
      const { objectUrl, mimeType, fileBytes } = await decryptTicket(encUrl, password);
      activeTicketBlobUrl = objectUrl;

      const isPhone = window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
      if (isPhone) {
        setModalMaximized(true);
      }

      const isPdf = mimeType === "application/pdf";
      const contentMarkup = isPdf ? `
        <div class="ticket-pdf-frame">
          <div class="ticket-zoom-toolbar">
            <div class="ticket-zoom-controls">
              <button type="button" class="ticket-zoom-btn ticket-zoom-out" id="ticket-zoom-out" aria-label="縮小" title="縮小">－</button>
              <span class="ticket-zoom-display" id="ticket-zoom-display">100%</span>
              <button type="button" class="ticket-zoom-btn ticket-zoom-in" id="ticket-zoom-in" aria-label="放大" title="放大">＋</button>
              <button type="button" class="ticket-zoom-btn ticket-zoom-reset" id="ticket-zoom-reset" aria-label="重設比例" title="重設比例">重設</button>
            </div>
            <span class="ticket-zoom-hint"><span aria-hidden="true">🤏</span> 支援雙指縮放・雙擊放大</span>
          </div>
          <div class="ticket-pdf-viewport" id="ticket-pdf-viewport">
            <div class="ticket-pdf-loading" id="ticket-pdf-loading">
              <span class="spinner-icon">⏳</span> 正在渲染高解析度票券頁面...
            </div>
            <div class="ticket-pdf-pages" id="ticket-pdf-pages"></div>
          </div>
          <div class="ticket-pdf-actions">
            <button type="button" class="button button-secondary ticket-pdf-fullscreen-btn" id="ticket-pdf-fullscreen-btn">
              <span>⛶</span> 全螢幕放大檢視
            </button>
            <a href="${objectUrl}" target="_blank" rel="noopener noreferrer" class="button button-ghost ticket-pdf-open-btn">
              <span>📄</span> 在新分頁開啟原始 PDF
            </a>
            <a href="${objectUrl}" download="${esc(ticket.encFile.replace('.enc', '.pdf'))}" class="button button-ghost ticket-pdf-download-btn">
              <span>💾</span> 下載 / 另存原始 PDF
            </a>
          </div>
        </div>
      ` : `
        <div class="ticket-qr-frame">
          <div class="ticket-zoom-toolbar">
            <div class="ticket-zoom-controls">
              <button type="button" class="ticket-zoom-btn ticket-zoom-out" id="ticket-zoom-out" aria-label="縮小" title="縮小">－</button>
              <span class="ticket-zoom-display" id="ticket-zoom-display">100%</span>
              <button type="button" class="ticket-zoom-btn ticket-zoom-in" id="ticket-zoom-in" aria-label="放大" title="放大">＋</button>
              <button type="button" class="ticket-zoom-btn ticket-zoom-reset" id="ticket-zoom-reset" aria-label="重設比例" title="重設比例">重設</button>
            </div>
            <span class="ticket-zoom-hint"><span aria-hidden="true">🤏</span> 支援雙指縮放・雙擊放大</span>
          </div>
          <div class="ticket-pdf-viewport ticket-qr-viewport" id="ticket-pdf-viewport">
            <div class="ticket-qr-wrap" id="ticket-pdf-pages">
              <img src="${objectUrl}" alt="${esc(ticket.title)} QR Code" class="ticket-qr-image" />
            </div>
          </div>
          <div class="ticket-brightness-badge">
            <span aria-hidden="true">💡</span> 提示：驗票時請將手機螢幕調至最高亮度，方便掃描機讀取
          </div>
        </div>
      `;

      const bodyEl = modal.querySelector("#ticket-modal-body");
      bodyEl.innerHTML = `
        <div class="ticket-decrypted-view">
          ${contentMarkup}

          <div class="ticket-details-box">
            <h4>憑證核對資訊</h4>
            <dl class="ticket-details-grid">
              ${(ticket.details || []).map((d) => `<div><dt>${esc(d.label)}</dt><dd>${esc(d.value)}</dd></div>`).join("")}
            </dl>
            ${ticket.qrHint ? `<div class="ticket-hint-alert"><span aria-hidden="true">▸</span> ${esc(ticket.qrHint)}</div>` : ""}
          </div>

          <div class="ticket-modal-bottom-actions">
            <button type="button" class="button button-primary ticket-destroy-btn" data-ticket-action="close">
              ✓ 驗票完畢（關閉並銷毀記憶體暫存）
            </button>
          </div>
        </div>
      `;

      const viewportEl = bodyEl.querySelector("#ticket-pdf-viewport");
      const targetEl = bodyEl.querySelector("#ticket-pdf-pages");
      const displayEl = bodyEl.querySelector("#ticket-zoom-display");
      const zoomInBtn = bodyEl.querySelector("#ticket-zoom-in");
      const zoomOutBtn = bodyEl.querySelector("#ticket-zoom-out");
      const resetBtn = bodyEl.querySelector("#ticket-zoom-reset");
      setupTouchZoom(viewportEl, targetEl, displayEl, zoomInBtn, zoomOutBtn, resetBtn);

      if (isPdf) {
        const pagesContainer = bodyEl.querySelector("#ticket-pdf-pages");
        const loadingEl = bodyEl.querySelector("#ticket-pdf-loading");
        bodyEl.querySelector("#ticket-pdf-fullscreen-btn")?.addEventListener("click", () => {
          setModalMaximized(true);
        });

        (async () => {
          try {
            const pdfjs = await loadPdfJs();
            const loadingTask = pdfjs.getDocument({ data: fileBytes });
            const pdf = await loadingTask.promise;
            if (!pagesContainer) return;

            for (let num = 1; num <= pdf.numPages; num++) {
              const page = await pdf.getPage(num);
              const dpr = Math.min(3, Math.max(2, window.devicePixelRatio || 2));
              const viewport = page.getViewport({ scale: dpr });

              const pageCard = document.createElement("div");
              pageCard.className = "ticket-pdf-page-card";
              if (pdf.numPages > 1) {
                const badge = document.createElement("div");
                badge.className = "ticket-page-badge";
                badge.textContent = `第 ${num} / ${pdf.numPages} 頁 · 4 位同行憑證`;
                pageCard.appendChild(badge);
              }

              const canvas = document.createElement("canvas");
              canvas.className = "ticket-pdf-canvas";
              canvas.width = viewport.width;
              canvas.height = viewport.height;
              pageCard.appendChild(canvas);
              pagesContainer.appendChild(pageCard);

              const ctx = canvas.getContext("2d");
              await page.render({ canvasContext: ctx, viewport }).promise;
            }
            if (loadingEl) loadingEl.hidden = true;
          } catch (renderErr) {
            console.warn("PDF.js render fallback:", renderErr);
            if (loadingEl) loadingEl.hidden = true;
            if (pagesContainer) {
              pagesContainer.innerHTML = `
                <iframe src="${objectUrl}" class="ticket-pdf-iframe" title="${esc(ticket.title)}"></iframe>
              `;
            }
          }
        })();
      }

      (async () => {
        try {
          const bioStatus = await android.checkBiometricsStatus();
          if (bioStatus && bioStatus.canUseBiometrics && !bioStatus.isRegistered && !sessionStorage.getItem("eccv_bio_dismissed")) {
            const deviceLabel = bioStatus.deviceLabel || "生物辨識";
            const deviceIcon = bioStatus.deviceIcon || "👆";
            const isNative = android.isNative();
            const securityNote = isNative
              ? "由 Samsung Knox 硬體安全晶片保管，下次出示可直接感應指紋。"
              : "由裝置安全晶片（Apple Secure Enclave / WebAuthn）保管，下次出示直接感應解鎖。";

            const enrollCard = document.createElement("div");
            enrollCard.className = "ticket-enroll-card";
            enrollCard.id = "ticket-enroll-card";
            enrollCard.innerHTML = `
              <div class="ticket-enroll-header">
                <span class="enroll-icon" aria-hidden="true">${deviceIcon}</span>
                <div>
                  <strong>啟用 ${esc(deviceLabel)} 快速出示？</strong>
                  <p>${esc(securityNote)}</p>
                </div>
              </div>
              <div class="ticket-enroll-actions">
                <button type="button" class="button button-primary" id="ticket-enroll-btn">
                  <span>${deviceIcon} 立即啟用 ${esc(deviceLabel)}</span>
                </button>
                <button type="button" class="button button-ghost" id="ticket-enroll-dismiss-btn">
                  <span>稍後再說</span>
                </button>
              </div>
            `;

            const bottomActions = bodyEl.querySelector(".ticket-modal-bottom-actions");
            if (bottomActions) {
              bottomActions.parentElement.insertBefore(enrollCard, bottomActions);
            } else {
              bodyEl.querySelector(".ticket-decrypted-view")?.appendChild(enrollCard);
            }

            enrollCard.querySelector("#ticket-enroll-dismiss-btn")?.addEventListener("click", () => {
              enrollCard.remove();
              try { sessionStorage.setItem("eccv_bio_dismissed", "1"); } catch (_) {}
            });

            enrollCard.querySelector("#ticket-enroll-btn")?.addEventListener("click", async () => {
              const enrollBtn = enrollCard.querySelector("#ticket-enroll-btn");
              enrollBtn.disabled = true;
              enrollBtn.textContent = `請感應 ${deviceLabel}...`;
              try {
                const res = await android.registerPassword(password);
                if (res && res.success) {
                  enrollCard.innerHTML = `
                    <div class="ticket-enroll-success">
                      <span aria-hidden="true">✓</span>
                      <span>已成功啟用 ${esc(deviceLabel)} 快速出示！下次點擊將直接驗證。</span>
                    </div>
                  `;
                } else {
                  enrollBtn.disabled = false;
                  enrollBtn.innerHTML = `<span>${deviceIcon} 立即啟用 ${esc(deviceLabel)}</span>`;
                  if (res && res.message && !res.cancelled) {
                    alert(res.message);
                  }
                }
              } catch (regErr) {
                enrollBtn.disabled = false;
                enrollBtn.innerHTML = `<span>${deviceIcon} 立即啟用 ${esc(deviceLabel)}</span>`;
                alert("生物辨識綁定失敗: " + (regErr.message || regErr));
              }
            });
          }
        } catch (_) {}
      })();
    }

    form?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const password = input.value.trim();
      if (!password) return;

      errorMsg.hidden = true;
      submitBtn.disabled = true;
      btnSpinner.hidden = false;
      btnText.textContent = "正在驗證出示中...";

      try {
        await renderDecryptedView(password);
      } catch (err) {
        errorMsg.textContent = err.message || "密碼錯誤，請確認後重新輸入。";
        errorMsg.hidden = false;
        submitBtn.disabled = false;
        btnSpinner.hidden = true;
        btnText.textContent = "出示憑證與 QR 碼";
        input.select();
      }
    });
  }

  function setupTicketModal() {
    document.addEventListener("click", (e) => {
      const openBtn = e.target.closest("[data-ticket-action='open']");
      if (openBtn) {
        e.preventDefault();
        e.stopPropagation();
        const ticketId = openBtn.getAttribute("data-ticket-id");
        if (ticketId) openTicketModal(ticketId);
        return;
      }

      const closeBtn = e.target.closest("[data-ticket-action='close']");
      if (closeBtn) {
        e.preventDefault();
        closeTicketModal();
        return;
      }

      if (e.target.classList.contains("ticket-modal-overlay")) {
        closeTicketModal();
      }
    });

    window.addEventListener("popstate", () => {
      const modal = document.getElementById("ticket-modal-root");
      if (modal) {
        modalPushedState = false;
        closeTicketModal();
      }
    });
  }

  window.ECCV_TICKETS = {
    open: openTicketModal,
    close: closeTicketModal,
    decrypt: decryptTicket,
    setup: setupTicketModal
  };
})();
