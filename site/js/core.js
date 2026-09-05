(function () {
  "use strict";

  const trip = window.TRIP || {};
  const body = document.body;
  const root = document.getElementById("app");
  const page = body?.dataset.page || "home";
  const dayKey = body?.dataset.day || "";
  const isDayPage = page === "day";
  const base = isDayPage ? "../" : "./";
  const themeStorageKey = "eccv-trip-theme";

  function preferredTheme() {
    try {
      const saved = localStorage.getItem(themeStorageKey);
      if (saved === "light" || saved === "dark") return saved;
    } catch (_) {
      // Fall back to the operating system preference when storage is unavailable.
    }
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function applyTheme(theme, persist) {
    const nextTheme = theme === "dark" ? "dark" : "light";
    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.style.colorScheme = nextTheme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", nextTheme === "dark" ? "#0d1519" : "#f5f2ea");
    const toggle = document.querySelector("[data-theme-toggle]");
    if (toggle) {
      const nextLabel = nextTheme === "dark" ? "切換為亮色模式" : "切換為深色模式";
      toggle.setAttribute("aria-label", nextLabel);
      toggle.setAttribute("title", nextLabel);
    }
    if (persist) {
      try { localStorage.setItem(themeStorageKey, nextTheme); } catch (_) { /* Theme still applies for this page view. */ }
    }
  }

  applyTheme(preferredTheme(), false);

  const esc = (value) => String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

  let bilingualNamePattern = null;

  function bilingualText(value) {
    const source = String(value ?? "");
    const names = trip.bilingualNames || {};
    const keys = Object.keys(names);
    if (!source || !keys.length) return source;
    if (!bilingualNamePattern) {
      const escapedKeys = keys
        .sort((left, right) => right.length - left.length)
        .map((key) => key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
      bilingualNamePattern = new RegExp(escapedKeys.join("|"), "g");
    }
    return source.replace(bilingualNamePattern, (name) => `${name}（${names[name]}）`);
  }

  const homeLink = `${base}index.html`;
  const placesLink = `${base}places.html`;
  const logisticsLink = `${base}logistics.html`;
  const packingLink = `${base}packing.html`;
  const toolsLink = `${base}tools.html`;
  const dayLink = (key) => `${base}days/${key}.html`;

  function cityLabel(cityKey) {
    return bilingualText(({ malmo: "Malmö", copenhagen: "Copenhagen", paris: "Paris", transfer: "移動日", travel: "飛行日" })[cityKey] || "旅程");
  }

  function assetPath(path) {
    if (!path || /^(?:https?:)?\/\//.test(path)) return path;
    return `${base}${path.replace(/^\.\//, "")}`;
  }

  function googleMapsLink(id, place) {
    const visual = trip.placeVisuals?.[id] || {};
    const query = visual.mapQuery || `${place.title}, ${place.region}`;
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
  }

  function placeLocation(id, place) {
    const visual = trip.placeVisuals?.[id] || {};
    return visual.mapQuery || `${place.title}, ${place.region}`;
  }

  let leafletLoader = null;

  function loadLeaflet() {
    if (window.L?.map) return Promise.resolve(window.L);
    if (leafletLoader) return leafletLoader;

    leafletLoader = new Promise((resolve, reject) => {
      if (!document.getElementById("leaflet-route-style")) {
        const stylesheet = document.createElement("link");
        stylesheet.id = "leaflet-route-style";
        stylesheet.rel = "stylesheet";
        stylesheet.href = assetPath("vendor/leaflet/leaflet.css");
        document.head.appendChild(stylesheet);
      }

      const existing = document.getElementById("leaflet-route-script");
      if (existing) {
        existing.addEventListener("load", () => resolve(window.L), { once: true });
        existing.addEventListener("error", () => reject(new Error("Leaflet unavailable")), { once: true });
        return;
      }

      const script = document.createElement("script");
      script.id = "leaflet-route-script";
      script.src = assetPath("vendor/leaflet/leaflet.js");
      script.onload = () => window.L?.map ? resolve(window.L) : reject(new Error("Leaflet did not initialize"));
      script.onerror = () => reject(new Error("Leaflet unavailable"));
      document.head.appendChild(script);
    });

    return leafletLoader;
  }

  async function copyText(value) {
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(value);
        return true;
      } catch (_) {
        // Fall through to the legacy copy path when the page lacks clipboard permission.
      }
    }
    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    let copied = false;
    try { copied = document.execCommand("copy"); } catch (_) { copied = false; }
    textarea.remove();
    return copied;
  }

  function searchMarkup() {
    return `
      <div class="site-search" data-search>
        <label class="search-field" for="trip-search">
          <span class="search-icon" aria-hidden="true">⌕</span>
          <input id="trip-search" type="search" placeholder="搜尋日期、城市、景點或交通" autocomplete="off" aria-label="搜尋整趟旅程" aria-controls="search-results" aria-expanded="false" />
          <span class="search-shortcut" aria-hidden="true">⌘ K</span>
          <button class="search-clear" type="button" aria-label="清除搜尋" hidden>×</button>
        </label>
        <div class="search-results" id="search-results" role="listbox" hidden></div>
      </div>`;
  }

  function header() {
    const active = page === "places" ? "places" : page === "logistics" ? "logistics" : page === "packing" ? "packing" : page === "tools" ? "tools" : "home";
    return `
      <header class="site-header">
        <div class="nav-wrap">
          <a class="brand" href="${homeLink}" aria-label="回到旅程首頁">
            <span class="brand-mark" aria-hidden="true"><img src="${assetPath("assets/eccv-mark.png")}" alt="" /></span>
            <span class="brand-copy"><strong>ECCV 2026</strong><small>北歐到巴黎・14 天</small></span>
          </a>
          <nav class="main-nav" aria-label="主要導覽">
            <a class="${active === "home" ? "is-active" : ""}" href="${homeLink}">總覽</a>
            <a class="${active === "places" ? "is-active" : ""}" href="${placesLink}">景點</a>
            <a class="${active === "logistics" ? "is-active" : ""}" href="${logisticsLink}">交通資訊</a>
            <a class="${active === "packing" ? "is-active" : ""}" href="${packingLink}">行李</a>
            <a class="${active === "tools" ? "is-active" : ""}" href="${toolsLink}">小工具</a>
          </nav>
          <div class="header-tools">
            <button class="search-toggle" type="button" data-search-toggle aria-expanded="false" aria-controls="trip-search">⌕ <span>搜尋</span></button>
            <button class="theme-toggle" type="button" data-theme-toggle aria-label="切換色彩模式">
              <span class="theme-icon-sun" aria-hidden="true">☼</span>
              <span class="theme-icon-moon" aria-hidden="true">◐</span>
            </button>
            ${searchMarkup()}
          </div>
        </div>
      </header>`;
  }

  function setupThemeToggle() {
    const toggle = document.querySelector("[data-theme-toggle]");
    if (!toggle) return;
    applyTheme(document.documentElement.dataset.theme, false);
    toggle.addEventListener("click", () => {
      applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark", true);
    });
  }

  function mobileNav() {
    const navIcon = (name) => {
      const icons = {
        home: `<svg viewBox="0 0 24 24" focusable="false"><path d="M3.5 10.7 12 3.8l8.5 6.9v9.1h-6v-5.6h-5v5.6h-6Z" /></svg>`,
        places: `<svg viewBox="0 0 24 24" focusable="false"><path d="M20 10c0 5.2-8 11-8 11s-8-5.8-8-11a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.6" /></svg>`,
        logistics: `<svg viewBox="0 0 24 24" focusable="false"><rect x="4" y="3.5" width="16" height="15" rx="3" /><path d="M7 8h10M7 13h10M8 18.5l-2 2M16 18.5l2 2" /><circle cx="8" cy="16" r="1" /><circle cx="16" cy="16" r="1" /></svg>`,
        packing: `<svg viewBox="0 0 24 24" focusable="false"><path d="M9 6V4.5h6V6M6 6h12a2 2 0 0 1 2 2v11H4V8a2 2 0 0 1 2-2Z" /><path d="M8 9v7M16 9v7M8 19v2M16 19v2" /></svg>`,
        tools: `<svg viewBox="0 0 24 24" focusable="false"><path d="M14.4 6.3a4.5 4.5 0 0 0-5.8 5.8l-5.1 5.1a2.3 2.3 0 1 0 3.3 3.3l5.1-5.1a4.5 4.5 0 0 0 5.8-5.8l-2.8 2.8-3.3-3.3Z" /></svg>`
      };
      return `<span class="mobile-nav-icon" aria-hidden="true">${icons[name]}</span>`;
    };
    const active = page === "places" ? "places" : page === "logistics" ? "logistics" : page === "packing" ? "packing" : page === "tools" ? "tools" : "home";
    return `
      <nav class="mobile-nav" aria-label="手機快速導覽">
        <a class="${active === "home" ? "is-active" : ""}" href="${homeLink}">${navIcon("home")}<small>總覽</small></a>
        <a class="${active === "places" ? "is-active" : ""}" href="${placesLink}">${navIcon("places")}<small>景點</small></a>
        <a class="${active === "logistics" ? "is-active" : ""}" href="${logisticsLink}">${navIcon("logistics")}<small>交通</small></a>
        <a class="${active === "packing" ? "is-active" : ""}" href="${packingLink}">${navIcon("packing")}<small>行李</small></a>
        <a class="${active === "tools" ? "is-active" : ""}" href="${toolsLink}">${navIcon("tools")}<small>小工具</small></a>
      </nav>`;
  }

  function footer() {
    return `
      <footer class="site-footer">
        <div class="footer-inner">
          <div><strong>ECCV 2026 Europe Trip</strong><span>手機先看今天，桌機再看全程。</span></div>
          <p>航班、班次、入口與營業時間，仍請以出發前官方資訊為準。</p>
        </div>
      </footer>`;
  }

  function searchEntries() {
    const days = Object.entries(trip.days || {}).map(([key, day]) => ({
      type: "每日行程",
      eyebrow: `${day.date.slice(5)} · ${bilingualText(day.city)}`,
      title: bilingualText(day.title),
      text: bilingualText([day.date, day.weekday, day.city, day.title, day.summary, day.stay, day.transport.duration, day.transport.steps.join(" "), day.schedule.map((item) => `${item.time} ${item.title} ${item.detail}`).join(" ")].join(" ")),
      href: dayLink(key)
    }));
    const places = Object.entries(trip.places || {}).map(([id, place]) => {
      const details = trip.placeDetails?.[id] || {};
      const dateText = Object.entries(trip.days || {}).filter(([, day]) => day.places.includes(id)).map(([, day]) => day.date.slice(5)).join(" ") || "未排入每日行程";
      return {
        type: "景點",
        eyebrow: `${place.region} · ${place.stay}`,
        title: `${place.local}｜${place.title}`,
        text: [place.region, place.title, place.local, ...(trip.placeSearchNames?.[id] || []), place.kicker, place.intro, place.stay, details.why, dateText, details.booking?.label, details.booking?.note].join(" "),
        href: `${placesLink}#place-${id}`
      };
    });
    const bags = window.ECCV_PAGES?.packing?.getBags
      ? window.ECCV_PAGES.packing.getBags()
      : (trip.packing?.bags || []);
    const packing = bags.map((bag) => ({
      type: "行李清單",
      eyebrow: `${bag.number} · ${bag.capacity}`,
      title: bag.label,
      text: [bag.headline, bag.rule, (bag.items || []).map((item) => `${item.group || ""} ${item.name}`).join(" ")].join(" "),
      href: `${packingLink}#bag-${bag.id}`
    }));
    return [
      ...days,
      ...places,
      ...packing,
      { type: "交通資訊", eyebrow: "航班 · 時區 · 座位", title: "航班時間軸", text: (trip.flights || []).map((flight) => `${Object.values(flight).filter((value) => !Array.isArray(value)).join(" ")} ${(flight.passengers || []).map((passenger) => Object.values(passenger).join(" ")).join(" ")}`).join(" "), href: `${logisticsLink}#flights` },
      { type: "住宿", eyebrow: "三段住宿", title: "住宿地址與入住提醒", text: (trip.stays || []).map((stay) => Object.values(stay).join(" ")).join(" "), href: `${logisticsLink}#stays` },
      { type: "交通 App", eyebrow: "瑞典 · 丹麥 · 法國", title: "旅途中要用的三個 App", text: (trip.transportApps || []).map((app) => Object.values(app).join(" ")).join(" "), href: `${logisticsLink}#apps` },
      { type: "ECCV 註冊", eyebrow: `${trip.registration?.status || ""} · ${trip.registration?.type || ""}`, title: "ECCV 註冊與 badge", text: Object.values(trip.registration || {}).join(" "), href: `${logisticsLink}#registration` },
      { type: "急難救助", eyebrow: "112 · 國泰信用卡 · 代表處 · 護照遺失", title: "歐洲急難救助與駐外代表處", text: "112 報警 警察 救護車 SAMU 15 17 18 114 1813 駐法國台北代表處 駐丹麥台北代表處 駐瑞典台北代表處 外交部急難救助 護照遺失 偷竊 信用卡掛失 國泰世華 國泰 信用卡 刷爆 臨時調額 擋刷 客服電話 0223831000 0800818001 Visa Mastercard 報案證明 緊急專線", href: `${logisticsLink}#emergency` },
      { type: "小工具", eyebrow: "天氣 · 匯率 · 翻譯", title: "小工具｜旅行快速參考", text: "台北 Malmö Copenhagen 哥本哈根 Paris 巴黎 降雨機率 攝氏 匯率 換算 文字 照片 翻譯 行程焦點", href: toolsLink },
      { type: "小工具", eyebrow: "TWD · EUR · DKK · SEK", title: "台幣與當地貨幣換算", text: "新台幣 台幣 台灣 台北 歐元 法國 丹麥克朗 瑞典克朗 匯率 交換方向 手續費", href: `${toolsLink}#tools-exchange` }
    ];
  }

  function normalizeSearch(value) {
    return String(value).normalize("NFKC").toLocaleLowerCase().replace(/[·・／/—–-]/g, " ").replace(/\s+/g, " ").trim();
  }

  function setupSearch() {
    const search = document.querySelector("[data-search]");
    const input = search?.querySelector("input");
    const results = search?.querySelector(".search-results");
    const clear = search?.querySelector(".search-clear");
    const toggle = document.querySelector("[data-search-toggle]");
    if (!search || !input || !results || !clear) return;

    const entries = searchEntries().map((entry) => ({ ...entry, haystack: normalizeSearch(`${entry.title} ${entry.eyebrow} ${entry.text}`) }));
    const quick = [
      { type: "快速前往", eyebrow: "09/06 - 09/19", title: "查看 14 天每日行程", href: `${homeLink}#itinerary` },
      { type: "快速前往", eyebrow: "座位與時區", title: "查看所有航班", href: `${logisticsLink}#flights` },
      { type: "快速前往", eyebrow: "地址與入住", title: "查看住宿資訊", href: `${logisticsLink}#stays` },
      { type: "快速前往", eyebrow: "特色與地圖", title: "搜尋所有景點", href: placesLink },
      { type: "快速前往", eyebrow: "Paid · Full Passport", title: "查看 ECCV 註冊與 badge", href: `${logisticsLink}#registration` },
      { type: "快速前往", eyebrow: "小包 · 後背包 · 行李箱", title: "開啟行李準備清單", href: packingLink },
      { type: "快速前往", eyebrow: "時間 · 天氣 · 行程焦點", title: "開啟小工具", href: toolsLink }
    ];

    const renderResults = (items, emptyText) => {
      results.innerHTML = items.length
        ? items.slice(0, 8).map((item) => `<a class="search-result" role="option" href="${item.href}"><span class="search-result-type">${esc(item.type)}</span><span><strong>${esc(item.title)}</strong><small>${esc(item.eyebrow)}</small></span><b aria-hidden="true">→</b></a>`).join("")
        : `<p class="search-empty">${esc(emptyText)}</p>`;
      results.hidden = false;
      input.setAttribute("aria-expanded", "true");
      search.classList.add("is-open");
    };

    const update = () => {
      const query = normalizeSearch(input.value);
      clear.hidden = !query;
      if (!query) {
        renderResults(quick, "");
        return;
      }
      const tokens = query.split(" ").filter(Boolean);
      const matches = entries.filter((entry) => tokens.every((token) => entry.haystack.includes(token)));
      renderResults(matches, `找不到「${input.value.trim()}」，可以改搜城市、日期或景點名稱。`);
    };

    const close = () => {
      results.hidden = true;
      input.setAttribute("aria-expanded", "false");
      search.classList.remove("is-open");
      document.querySelector(".site-header")?.classList.remove("search-expanded");
      toggle?.setAttribute("aria-expanded", "false");
    };

    const open = () => {
      document.querySelector(".site-header")?.classList.add("search-expanded");
      toggle?.setAttribute("aria-expanded", "true");
      input.focus();
      update();
    };
    toggle?.addEventListener("click", () => {
      if (toggle.getAttribute("aria-expanded") === "true") close();
      else open();
    });

    input.addEventListener("focus", update);
    input.addEventListener("input", update);
    input.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        close();
        input.blur();
        toggle?.focus();
      }
      if (event.key === "Enter") {
        const first = results.querySelector("a");
        if (first) {
          event.preventDefault();
          first.click();
        }
      }
    });
    clear.addEventListener("click", () => {
      input.value = "";
      input.focus();
      update();
    });
    document.addEventListener("click", (event) => {
      if (!search.contains(event.target) && !toggle?.contains(event.target)) close();
    });
    document.addEventListener("keydown", (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        open();
      }
    });
    document.querySelectorAll("[data-focus-search]").forEach((button) => button.addEventListener("click", open));
  }

  function setupImageFallbacks() {
    document.querySelectorAll(".place-image img").forEach((image) => {
      image.addEventListener("error", () => {
        image.hidden = true;
        image.closest(".place-image")?.classList.add("is-missing");
      }, { once: true });
    });
  }

  function setupAddressCopy() {
    document.querySelectorAll("[data-copy-address]").forEach((button) => {
      button.addEventListener("click", async () => {
        const original = button.dataset.copyLabel || button.textContent;
        const copied = await copyText(button.dataset.copyAddress || "");
        button.textContent = copied ? "已複製" : "複製失敗";
        button.classList.toggle("is-copied", copied);
        button.classList.toggle("is-copy-failed", !copied);
        window.setTimeout(() => {
          button.textContent = original;
          button.classList.remove("is-copied", "is-copy-failed");
        }, 1800);
      });
    });
  }

  function layout(content) {
    if (!root) return;
    root.innerHTML = `${header()}<main class="page-shell">${content}</main>${footer()}${mobileNav()}`;
    setupThemeToggle();
    setupSearch();
    setupImageFallbacks();
    setupAddressCopy();
  }

  function sectionHeading(kicker, title, text) {
    return `<div class="section-heading"><span class="eyebrow">${esc(kicker)}</span><h2>${esc(title)}</h2>${text ? `<p>${esc(text)}</p>` : ""}</div>`;
  }

  function setupSwipeNavigation() {
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;
    let startTime = 0;
    let gestureDecided = false;
    let isHorizontal = false;
    let isIgnored = false;
    let didSwipeNavigate = false;

    document.addEventListener("click", (e) => {
      if (didSwipeNavigate) {
        e.preventDefault();
        e.stopPropagation();
        didSwipeNavigate = false;
      }
    }, true);

    document.addEventListener("touchstart", (e) => {
      if (e.touches.length !== 1) {
        isIgnored = true;
        return;
      }
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      currentX = startX;
      currentY = startY;
      startTime = Date.now();
      gestureDecided = false;
      isHorizontal = false;
      isIgnored = false;

      const edgeThreshold = 20;
      if (startX < edgeThreshold || startX > window.innerWidth - edgeThreshold) {
        isIgnored = true;
        return;
      }

      if (e.target.closest("a, button, summary, dialog, nav, .filter-row, .places-filter-toolbar, .packing-bag-pills, .logistics-tabs-scroll, .route-map-canvas, .leaflet-container, input, textarea, select, pre, code, .ticket-modal-overlay, #ticket-modal-root, .ticket-pdf-viewport")) {
        isIgnored = true;
        return;
      }
    }, { passive: true });

    document.addEventListener("touchmove", (e) => {
      if (isIgnored || e.touches.length !== 1) return;
      const touch = e.touches[0];
      currentX = touch.clientX;
      currentY = touch.clientY;
      const deltaX = currentX - startX;
      const deltaY = currentY - startY;

      if (!gestureDecided) {
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);
        if (absX >= 8 || absY >= 8) {
          gestureDecided = true;
          if (absX > absY * 1.8) {
            isHorizontal = true;
          } else {
            isIgnored = true;
            return;
          }
        }
      }

      if (isHorizontal && e.cancelable) {
        e.preventDefault();
      }
    }, { passive: false });

    const handleSwipeEnd = () => {
      if (isIgnored || !isHorizontal) return;
      const deltaX = currentX - startX;
      const deltaY = currentY - startY;
      const elapsed = Date.now() - startTime;

      isIgnored = true;

      if (Math.abs(deltaX) < 80 || Math.abs(deltaX) < Math.abs(deltaY) * 1.8 || elapsed > 700) {
        return;
      }

      let targetUrl = null;
      const directionClass = deltaX < 0 ? "is-swiping-left" : "is-swiping-right";

      if (page === "day") {
        const keys = Object.keys(trip.days || {});
        const currentKey = body?.dataset.day || "09-08";
        const currentIndex = keys.indexOf(currentKey);
        if (deltaX < 0 && currentIndex !== -1 && currentIndex < keys.length - 1) {
          targetUrl = dayLink(keys[currentIndex + 1]);
        } else if (deltaX > 0 && currentIndex > 0) {
          targetUrl = dayLink(keys[currentIndex - 1]);
        }
      } else {
        const mainTabs = ["home", "places", "logistics", "packing", "tools"];
        const tabUrls = {
          home: homeLink,
          places: placesLink,
          logistics: logisticsLink,
          packing: packingLink,
          tools: toolsLink
        };
        const currentIndex = mainTabs.indexOf(page);
        if (currentIndex !== -1) {
          if (deltaX < 0 && currentIndex < mainTabs.length - 1) {
            targetUrl = tabUrls[mainTabs[currentIndex + 1]];
          } else if (deltaX > 0 && currentIndex > 0) {
            targetUrl = tabUrls[mainTabs[currentIndex - 1]];
          }
        }
      }

      if (targetUrl) {
        didSwipeNavigate = true;
        const pageShell = document.querySelector(".page-shell");
        if (pageShell) {
          pageShell.classList.add(directionClass);
        }
        setTimeout(() => {
          window.location.href = targetUrl;
        }, 70);
      }
    };

    document.addEventListener("touchend", handleSwipeEnd, { passive: true });
    document.addEventListener("touchcancel", () => { isIgnored = true; }, { passive: true });
  }

  function toast(message, duration = 3200) {
    const existing = document.querySelector(".app-toast");
    if (existing) existing.remove();
    const el = document.createElement("div");
    el.className = "app-toast";
    el.setAttribute("role", "status");
    el.setAttribute("aria-live", "polite");
    el.textContent = message;
    document.body.appendChild(el);
    requestAnimationFrame(() => {
      el.classList.add("is-visible");
    });
    setTimeout(() => {
      el.classList.remove("is-visible");
      setTimeout(() => el.remove(), 250);
    }, duration);
  }

  function confirmModal({ title = "確認操作", message = "", confirmText = "確定", cancelText = "取消", danger = false }) {
    return new Promise((resolve) => {
      const existing = document.getElementById("eccv-confirm-modal");
      if (existing) existing.remove();

      const overlay = document.createElement("div");
      overlay.id = "eccv-confirm-modal";
      overlay.className = "confirm-modal-overlay";
      overlay.innerHTML = `
        <div class="confirm-modal-container" role="dialog" aria-modal="true" aria-labelledby="confirm-modal-title">
          <div class="confirm-modal-header">
            <h3 id="confirm-modal-title">${esc(title)}</h3>
          </div>
          <div class="confirm-modal-body">
            <p>${esc(message).replace(/\n/g, "<br>")}</p>
          </div>
          <div class="confirm-modal-actions">
            <button type="button" class="button button-ghost confirm-modal-cancel">${esc(cancelText)}</button>
            <button type="button" class="button ${danger ? "button-primary" : "button-secondary"} confirm-modal-ok">${esc(confirmText)}</button>
          </div>
        </div>
      `;

      let resolved = false;
      const cleanup = (val) => {
        if (resolved) return;
        resolved = true;
        overlay.classList.remove("is-active");
        setTimeout(() => overlay.remove(), 200);
        document.removeEventListener("keydown", onKeyDown);
        resolve(val);
      };

      const onKeyDown = (e) => {
        if (e.key === "Escape") cleanup(false);
      };

      overlay.querySelector(".confirm-modal-cancel").addEventListener("click", () => cleanup(false));
      overlay.querySelector(".confirm-modal-ok").addEventListener("click", () => cleanup(true));
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) cleanup(false);
      });
      document.addEventListener("keydown", onKeyDown);

      document.body.appendChild(overlay);
      requestAnimationFrame(() => overlay.classList.add("is-active"));
    });
  }

  let swRegistration = null;

  function showPwaUpdateBanner(reg) {
    if (document.getElementById("pwa-update-banner")) return;
    const banner = document.createElement("aside");
    banner.id = "pwa-update-banner";
    banner.className = "pwa-update-banner";
    banner.setAttribute("role", "alert");
    banner.innerHTML = `
      <div class="pwa-update-banner-content">
        <span class="pwa-update-icon" aria-hidden="true">🚀</span>
        <div class="pwa-update-text">
          <strong>ECCV 旅程指南有新版本</strong>
          <small>已下載最新離線資源，點擊立即更新。</small>
        </div>
      </div>
      <div class="pwa-update-actions">
        <button type="button" class="button button-primary button-sm pwa-update-btn">立即套用</button>
        <button type="button" class="button button-ghost button-sm pwa-dismiss-btn" aria-label="稍後更新">✕</button>
      </div>
    `;

    banner.querySelector(".pwa-update-btn").addEventListener("click", () => {
      if (reg?.waiting) {
        reg.waiting.postMessage({ type: "SKIP_WAITING" });
      }
      window.location.reload();
    });

    banner.querySelector(".pwa-dismiss-btn").addEventListener("click", () => {
      banner.classList.remove("is-visible");
      setTimeout(() => banner.remove(), 250);
    });

    document.body.appendChild(banner);
    requestAnimationFrame(() => banner.classList.add("is-visible"));
  }

  function setupServiceWorker() {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        const swUrl = page === "day" ? "../sw.js" : "./sw.js";
        navigator.serviceWorker.register(swUrl).then((reg) => {
          swRegistration = reg;
          if (reg.waiting) {
            showPwaUpdateBanner(reg);
          }
          reg.addEventListener("updatefound", () => {
            const newWorker = reg.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                  showPwaUpdateBanner(reg);
                }
              });
            }
          });
          window.addEventListener("focus", () => {
            reg.update().catch(() => {});
          });
        }).catch(() => {});

        let refreshing = false;
        navigator.serviceWorker.addEventListener("controllerchange", () => {
          if (!refreshing) {
            refreshing = true;
            window.location.reload();
          }
        });
      });
    }
  }

  async function checkPwaUpdate() {
    if (!("serviceWorker" in navigator)) {
      return { supported: false, updated: false, message: "此環境不支援 Service Worker" };
    }
    try {
      const swUrl = page === "day" ? "../sw.js" : "./sw.js";
      let reg = await navigator.serviceWorker.getRegistration();
      if (!reg) {
        reg = await navigator.serviceWorker.register(swUrl);
      } else {
        try {
          await reg.update();
        } catch (_) {}
      }
      swRegistration = reg;
      if (reg.waiting) {
        showPwaUpdateBanner(reg);
        return { supported: true, updated: true, message: "發現新版本，請點擊更新" };
      }
      return { supported: true, updated: false, message: "目前已是最新版本（v20260906-02）" };
    } catch (e) {
      return { supported: true, updated: false, message: "目前已是最新版本（v20260906-02）" };
    }
  }

  window.ECCV_CORE = {
    trip: trip,
    page: page,
    dayKey: dayKey,
    isDayPage: isDayPage,
    base: base,
    homeLink: homeLink,
    placesLink: placesLink,
    logisticsLink: logisticsLink,
    packingLink: packingLink,
    toolsLink: toolsLink,
    dayLink: dayLink,
    esc: esc,
    bilingualText: bilingualText,
    cityLabel: cityLabel,
    assetPath: assetPath,
    googleMapsLink: googleMapsLink,
    placeLocation: placeLocation,
    copyText: copyText,
    loadLeaflet: loadLeaflet,
    layout: layout,
    sectionHeading: sectionHeading,
    header: header,
    mobileNav: mobileNav,
    footer: footer,
    setupSwipeNavigation: setupSwipeNavigation,
    setupServiceWorker: setupServiceWorker,
    checkPwaUpdate: checkPwaUpdate,
    toast: toast,
    confirmModal: confirmModal,
    applyTheme: applyTheme,
    preferredTheme: preferredTheme
  };
})();
