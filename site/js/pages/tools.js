(function () {
  "use strict";

  function getCore() {
    return window.ECCV_CORE;
  }

  function getAndroid() {
    return window.ECCV_ANDROID || {
      isNative: function () { return false; },
      getBiometrics: function () { return null; },
      checkBiometricsStatus: async function () {
        return { isAvailable: false, hasEnrolledBiometrics: false, isRegistered: false, canUseBiometrics: false };
      },
      clearRegistration: async function () {},
      getOfflineTranslator: function () { return null; }
    };
  }

  function toolsLocations() {
    const trip = window.TRIP || {};
    return Array.isArray(trip.tools?.locations) ? trip.tools.locations : [];
  }

  function dateKeyInTimezone(date, timezone) {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).formatToParts(date).reduce((result, part) => {
      if (part.type !== "literal") result[part.type] = part.value;
      return result;
    }, {});
    return `${parts.year}/${parts.month}/${parts.day}`;
  }

  function formatClockTime(date, timezone) {
    return new Intl.DateTimeFormat("zh-TW", {
      timeZone: timezone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    }).format(date);
  }

  function formatClockDate(date, timezone) {
    return new Intl.DateTimeFormat("zh-TW", {
      timeZone: timezone,
      weekday: "short",
      month: "numeric",
      day: "numeric"
    }).format(date);
  }

  function formatTimezoneOffset(date, timezone, fallback) {
    try {
      const part = new Intl.DateTimeFormat("en-US", { timeZone: timezone, timeZoneName: "longOffset" })
        .formatToParts(date)
        .find((item) => item.type === "timeZoneName");
      if (part?.value) return part.value.replace(/^GMT/, "UTC");
    } catch (_) {
      // The data fallback still gives the user a useful offset if Intl lacks longOffset.
    }
    return fallback;
  }

  function formatScheduleDate(date) {
    const [year, month, day] = String(date).split("/").map(Number);
    if (!year || !month || !day) return date;
    return new Intl.DateTimeFormat("zh-TW", { timeZone: "UTC", weekday: "short", month: "numeric", day: "numeric" })
      .format(new Date(Date.UTC(year, month - 1, day, 12)));
  }

  function scheduleTimezone(day) {
    if (day.cityKey === "travel") return "Asia/Taipei";
    if (day.cityKey === "malmo" || day.cityKey === "copenhagen") return "Europe/Copenhagen";
    if (day.cityKey === "paris") return "Europe/Paris";
    return /Copenhagen|哥本哈根/.test(day.city) ? "Europe/Copenhagen" : "Europe/Paris";
  }

  function automaticToolsDay(now) {
    const trip = window.TRIP || {};
    const entries = Object.entries(trip.days || {});
    const today = entries.find(([, day]) => day.date === dateKeyInTimezone(now, scheduleTimezone(day)));
    if (today) return { key: today[0], mode: "today" };

    const referenceDate = dateKeyInTimezone(now, "Asia/Taipei");
    const next = entries.find(([, day]) => day.date > referenceDate);
    const defaultKey = trip.tools?.defaultFocusDay && trip.days[trip.tools.defaultFocusDay]
      ? trip.tools.defaultFocusDay
      : entries[0]?.[0] || "09-06";
    if (next) return { key: next[0], mode: next[0] === defaultKey ? "default" : "next" };
    return { key: entries[entries.length - 1]?.[0] || "09-06", mode: "past" };
  }

  function toolsFocusForDay(key) {
    const trip = window.TRIP || {};
    const day = trip.days?.[key];
    if (!day) return null;
    let clockId = "paris";
    let placeLabel = day.city;
    let note = day.summary;

    if (day.cityKey === "travel") {
      clockId = "taipei";
      placeLabel = key === "09-19" ? "台北（返抵）" : "台北（出發）";
    } else if (day.cityKey === "malmo") {
      clockId = "malmo";
      placeLabel = "Malmö";
      note = "ECCV 2026 主會場所在地（Malmö Arena／Malmömässan）。";
    } else if (day.cityKey === "copenhagen") {
      clockId = "copenhagen";
      placeLabel = "Copenhagen";
    } else if (day.cityKey === "transfer" && /Copenhagen|哥本哈根/.test(day.city)) {
      clockId = "copenhagen";
      placeLabel = "Copenhagen → Beauvais";
    } else if (day.cityKey === "transfer") {
      clockId = "paris";
      placeLabel = "Paris → CDG";
    } else if (day.cityKey === "paris") {
      clockId = "paris";
      placeLabel = /Beauvais/.test(day.city) ? "Beauvais → Paris" : "Paris";
    }

    return {
      key,
      day,
      clockId,
      placeLabel,
      note,
      schedule: day.schedule || []
    };
  }

  function weatherSvg(code) {
    const value = Number(code);
    if (value === 0) {
      return `<svg class="weather-svg" viewBox="0 0 24 24" fill="none" stroke="#e09923" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`;
    }
    if ([1, 2].includes(value)) {
      return `<svg class="weather-svg" viewBox="0 0 24 24" fill="none" stroke="#2e7d77" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/><circle cx="8" cy="8" r="3" fill="#e09923" stroke="#e09923" stroke-width="0" opacity=".7"/></svg>`;
    }
    if (value === 3) {
      return `<svg class="weather-svg" viewBox="0 0 24 24" fill="none" stroke="#607278" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>`;
    }
    if ([45, 48].includes(value)) {
      return `<svg class="weather-svg" viewBox="0 0 24 24" fill="none" stroke="#78909c" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 14h16M4 18h16M4 10h16"/></svg>`;
    }
    if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(value)) {
      return `<svg class="weather-svg" viewBox="0 0 24 24" fill="none" stroke="#1b6e65" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.5 15H9a5 5 0 1 1 4.79-6.43A3.5 3.5 0 0 1 20 12a3.5 3.5 0 0 1-2.5 3Z"/><path d="M8 18l-1 3m5-3l-1 3m5-3l-1 3"/></svg>`;
    }
    if ([71, 73, 75, 77, 85, 86].includes(value)) {
      return `<svg class="weather-svg" viewBox="0 0 24 24" fill="none" stroke="#5dade2" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v18m9-9H3m15.36-6.36L5.64 18.36M18.36 18.36L5.64 5.64"/></svg>`;
    }
    if ([95, 96, 99].includes(value)) {
      return `<svg class="weather-svg" viewBox="0 0 24 24" fill="none" stroke="#d85d43" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`;
    }
    return `<svg class="weather-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M12 8v4l2.5 2.5"/></svg>`;
  }

  function weatherCodeInfo(code) {
    const value = Number(code);
    const svg = weatherSvg(value);
    if (value === 0) return { icon: svg, label: "晴朗" };
    if ([1, 2].includes(value)) return { icon: svg, label: "多雲" };
    if (value === 3) return { icon: svg, label: "陰天" };
    if ([45, 48].includes(value)) return { icon: svg, label: "有霧" };
    if ([51, 53, 55, 56, 57].includes(value)) return { icon: svg, label: "毛毛雨" };
    if ([61, 63, 65, 66, 67].includes(value)) return { icon: svg, label: "下雨" };
    if ([71, 73, 75, 77, 85, 86].includes(value)) return { icon: svg, label: "降雪" };
    if ([80, 81, 82].includes(value)) return { icon: svg, label: "陣雨" };
    if ([95, 96, 99].includes(value)) return { icon: svg, label: "雷雨" };
    return { icon: svg, label: "天氣資料" };
  }

  function temperature(value) {
    if (value === null || value === undefined || value === "") return "-";
    const number = Number(value);
    return Number.isFinite(number) ? `${Math.round(number)}°C` : "-";
  }

  function precipitationProbability(value) {
    if (value === null || value === undefined || value === "") return "-";
    const number = Number(value);
    return Number.isFinite(number) ? `${Math.round(number)}%` : "-";
  }

  function weatherDateLabel(date) {
    return formatScheduleDate(String(date).replace(/-/g, "/"));
  }

  function taipeiCardMarkup(location) {
    const core = getCore();
    const esc = core.esc;
    return `
      <article class="tool-city-card tool-city-card-taipei" data-tool-city-card data-tool-city="taipei">
        <div class="tool-city-card-heading">
          <div><span class="eyebrow">${esc(location.region || "台灣")} · 母國時間</span><h3>${esc(location.label)} <small>${esc(location.english)}</small></h3></div>
          <span class="tool-focus-badge" data-tool-focus-badge hidden>行程焦點</span>
        </div>
        <div class="tool-city-summary">
          <div class="tool-clock-panel">
            <div class="tool-clock-time" data-clock-time="taipei">--:--:--</div>
            <div class="tool-clock-meta">
              <span data-clock-date="taipei">日期載入中</span>
              <span data-clock-offset="taipei">${esc(location.code || "CST")} · ${esc(location.note || "全年 UTC+8")}</span>
            </div>
            <div class="tool-clock-cities-hint"><span>09/06 出發 · 09/19 返抵</span></div>
          </div>
          <div class="tool-weather" data-weather-body="taipei" aria-live="polite">
            <div class="tool-weather-loading"><span class="tool-weather-loading-icon" aria-hidden="true">◌</span><span>台北天氣載入中…</span></div>
          </div>
        </div>
      </article>`;
  }

  function europeCardMarkup(locations) {
    const core = getCore();
    const esc = core.esc;
    const tabs = locations.map((loc, idx) => `
      <button type="button" class="tool-europe-tab${idx === 0 ? " is-active" : ""}" role="tab" aria-selected="${idx === 0 ? "true" : "false"}" data-europe-tab="${esc(loc.id)}" aria-controls="weather-panel-${esc(loc.id)}">
        <div class="tool-europe-tab-top">
          <span class="tool-europe-tab-flag" aria-hidden="true">${esc(loc.flag || "📍")}</span>
          <strong>${esc(loc.label)}</strong>
        </div>
        <div class="tool-europe-tab-bottom">
          <small>${esc(loc.stage || loc.english)}</small>
          <div class="tool-europe-tab-glance" data-tab-glance="${esc(loc.id)}">
            <span class="tab-temp">--°</span>
            <span class="tab-icon">◌</span>
          </div>
        </div>
      </button>
    `).join("") + `
      <button type="button" class="tool-europe-tab tool-europe-tab-gps" role="tab" aria-selected="false" data-europe-tab="gps" aria-controls="weather-panel-gps">
        <div class="tool-europe-tab-top">
          <span class="tool-europe-tab-flag" aria-hidden="true">🧭</span>
          <strong>GPS 定位</strong>
        </div>
        <div class="tool-europe-tab-bottom">
          <small class="gps-tab-status" data-gps-tab-status>點擊定位</small>
          <div class="tool-europe-tab-glance" data-tab-glance="gps">
            <span class="tab-temp">--°</span>
            <span class="tab-icon">📍</span>
          </div>
        </div>
      </button>`;

    const panels = locations.map((loc, idx) => `
      <div class="tool-europe-panel${idx === 0 ? " is-active" : ""}" id="weather-panel-${esc(loc.id)}" data-europe-panel="${esc(loc.id)}" role="tabpanel"${idx !== 0 ? " hidden" : ""}>
        <div class="tool-europe-panel-header">
          <div class="tool-europe-panel-title">
            <span class="eyebrow">${esc(loc.region)}</span>
            <h4>${esc(loc.label)} <small>${esc(loc.english)}</small></h4>
          </div>
          <span class="tool-europe-panel-stage">${esc(loc.stage || "")}</span>
        </div>
        <div class="tool-weather-panel-body" data-weather-body="${esc(loc.id)}" aria-live="polite">
          <div class="tool-weather-loading"><span class="tool-weather-loading-icon" aria-hidden="true">◌</span><span>${esc(loc.label)} 天氣載入中…</span></div>
        </div>
      </div>
    `).join("") + `
      <div class="tool-europe-panel" id="weather-panel-gps" data-europe-panel="gps" role="tabpanel" hidden>
        <div class="tool-europe-panel-header">
          <div class="tool-europe-panel-title">
            <span class="eyebrow" data-gps-badge>GEOLOCATION WEATHER</span>
            <h4 data-gps-title>目前位置天氣 <small data-gps-coords>尚未定位</small></h4>
          </div>
          <button type="button" class="button button-primary button-sm tool-gps-trigger-btn" data-gps-trigger-btn>
            <span aria-hidden="true">🧭</span> 取得 GPS 定位
          </button>
        </div>
        <div class="tool-weather-panel-body" data-weather-body="gps" aria-live="polite">
          <div class="tool-weather-empty">
            <span class="tool-weather-loading-icon" aria-hidden="true">📍</span>
            <strong>尚未取得 GPS 定位</strong>
            <p>點擊「取得 GPS 定位」按鈕，手機將跳出定位授權詢問；允許後即刻依真實經緯度查詢當地氣象。</p>
          </div>
        </div>
      </div>`;

    return `
      <article class="tool-city-card tool-city-card-europe" data-tool-city-card data-tool-city="europe">
        <div class="tool-city-card-heading">
          <div><span class="eyebrow">歐洲旅程目的地 · CEST UTC+2</span><h3>歐洲當地時間 <small>Malmö・哥本哈根・巴黎</small></h3></div>
          <span class="tool-focus-badge" data-tool-focus-badge hidden>行程焦點</span>
        </div>
        <div class="tool-city-summary tool-europe-summary">
          <div class="tool-clock-panel">
            <div class="tool-clock-time" data-clock-time="europe">--:--:--</div>
            <div class="tool-clock-meta">
              <span data-clock-date="europe">日期載入中</span>
              <span data-clock-offset="europe">CEST · UTC+02:00</span>
            </div>
            <div class="tool-clock-cities-hint"><span>比台北慢 6 小時 · 3 城市同時區</span></div>
          </div>
          <div class="tool-weather tool-europe-weather-wrap">
            <div class="tool-europe-tabs" role="tablist" aria-label="選擇歐洲城市天氣">
              ${tabs}
            </div>
            <div class="tool-europe-panels">
              ${panels}
            </div>
          </div>
        </div>
      </article>`;
  }

  function weatherMarkup(forecast) {
    const core = getCore();
    const esc = core.esc;
    const current = forecast.current || {};
    const daily = forecast.daily || {};
    const currentInfo = weatherCodeInfo(current.weather_code);
    const dates = Array.isArray(daily.time) ? daily.time.slice(0, 5) : [];
    const max = Array.isArray(daily.temperature_2m_max) ? daily.temperature_2m_max : [];
    const min = Array.isArray(daily.temperature_2m_min) ? daily.temperature_2m_min : [];
    const rain = Array.isArray(daily.precipitation_probability_max) ? daily.precipitation_probability_max : [];
    const codes = Array.isArray(daily.weather_code) ? daily.weather_code : [];
    const forecastRows = dates.map((date, index) => {
      const info = weatherCodeInfo(codes[index]);
      const fullDate = weatherDateLabel(date);
      const shortDate = String(date).split("-").slice(1).map(Number).join("/");
      return `<li><span title="${esc(fullDate)}" aria-label="${esc(fullDate)}">${esc(shortDate)}</span><strong aria-label="${esc(info.label)}">${info.icon}</strong><small>${esc(temperature(max[index]))} / ${esc(temperature(min[index]))}</small><em>雨 ${esc(precipitationProbability(rain[index]))}</em></li>`;
    }).join("");
    const updateTime = current.time ? String(current.time).replace("T", " ") : "目前";
    return `
      <div class="tool-weather-now">
        <span class="tool-weather-icon" aria-hidden="true">${currentInfo.icon}</span>
        <div><span class="tool-weather-label">目前 ${esc(currentInfo.label)}</span><strong>${esc(temperature(current.temperature_2m))}</strong><small>體感 ${esc(temperature(current.apparent_temperature))} · 更新 ${esc(updateTime)}</small></div>
        <div class="tool-rain-chance"><span>今日降雨機率</span><strong>${esc(precipitationProbability(rain[0]))}</strong><small>日最高預報</small></div>
      </div>
      ${forecastRows ? `<ol class="tool-weather-forecast" aria-label="未來五天天氣預報">${forecastRows}</ol>` : ""}`;
  }

  function weatherErrorMarkup() {
    return `<div class="tool-weather-error"><strong>暫時無法取得天氣</strong><span>請檢查網路後再試一次；時鐘與行程焦點仍可正常使用。</span><button type="button" class="tool-retry-button" data-weather-retry>重新整理天氣</button></div>`;
  }

  async function fetchLocationWeather(location) {
    const params = new URLSearchParams({
      latitude: String(location.latitude),
      longitude: String(location.longitude),
      current: "temperature_2m,apparent_temperature,weather_code",
      daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
      temperature_unit: "celsius",
      forecast_days: "5",
      timezone: location.timezone || "auto"
    });
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`, { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error(`Weather request failed: ${response.status}`);
    return response.json();
  }

  function exchangeCurrency(currencies, code) {
    return currencies.find((currency) => currency.code === code) || { code, label: code, symbol: code };
  }

  function formatExchangeAmount(code, value, currencies, digits) {
    const number = Number(value);
    if (!Number.isFinite(number)) return "-";
    const currency = exchangeCurrency(currencies, code);
    const fractionDigits = digits ?? (code === "TWD" ? 0 : 2);
    return `${currency.symbol} ${new Intl.NumberFormat("en-US", { minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits }).format(number)}`;
  }

  function formatExchangeRate(code, value, currencies) {
    return formatExchangeAmount(code, value, currencies, Math.abs(Number(value)) < 1 ? 4 : 2);
  }

  async function fetchExchangeRates(exchange) {
    const response = await fetch(exchange.endpoint, { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error(`Exchange request failed: ${response.status}`);
    const data = await response.json();
    if (data.result && data.result !== "success") throw new Error("Exchange provider returned an error");
    if (!data.rates || !Number.isFinite(Number(data.rates.TWD))) throw new Error("Exchange response has no rates");
    return data;
  }

  function formatExchangeUpdated(data) {
    const timestamp = Number(data.time_last_update_unix);
    if (!Number.isFinite(timestamp)) return "剛剛";
    return new Intl.DateTimeFormat("zh-TW", { dateStyle: "short", timeStyle: "short" }).format(new Date(timestamp * 1000));
  }

  function setupExchange() {
    const trip = window.TRIP || {};
    const core = getCore();
    const esc = core.esc;
    const exchange = trip.tools?.exchange;
    const currencies = Array.isArray(trip.tools?.currencies) ? trip.tools.currencies : [];
    const amountInput = document.querySelector("[data-exchange-amount]");
    const fromSelect = document.querySelector("[data-exchange-from]");
    const toSelect = document.querySelector("[data-exchange-to]");
    const fromSymbol = document.querySelector("[data-exchange-from-symbol]");
    const result = document.querySelector("[data-exchange-result]");
    const rateText = document.querySelector("[data-exchange-rate]");
    const resultNote = document.querySelector("[data-exchange-result-note]");
    const pairText = document.querySelector("[data-exchange-pair]");
    const status = document.querySelector("[data-exchange-status]");
    const retry = document.querySelector("[data-exchange-retry]");
    if (!exchange || currencies.length < 2 || !amountInput || !fromSelect || !toSelect || !result) return;

    const options = currencies.map((currency) => `<option value="${esc(currency.code)}">${esc(currency.code)} · ${esc(currency.label)}${currency.usedIn ? `（${esc(currency.usedIn)}）` : ""}</option>`).join("");
    fromSelect.innerHTML = options;
    toSelect.innerHTML = options;
    fromSelect.value = currencies.some((currency) => currency.code === exchange.defaultFrom) ? exchange.defaultFrom : currencies[0].code;
    toSelect.value = currencies.some((currency) => currency.code === exchange.defaultTo) ? exchange.defaultTo : currencies[1].code;
    let rates = null;
    let cachedExchangeData = null;
    try {
      const raw = localStorage.getItem("eccv-exchange-cache");
      if (raw) {
        cachedExchangeData = JSON.parse(raw);
        if (cachedExchangeData?.rates && Number.isFinite(Number(cachedExchangeData.rates.TWD))) {
          rates = cachedExchangeData.rates;
          if (status) status.textContent = `離線快取匯率 · ${formatExchangeUpdated(cachedExchangeData)}`;
        }
      }
    } catch (_) {}

    const render = () => {
      const from = fromSelect.value;
      const to = toSelect.value;
      const source = exchangeCurrency(currencies, from);
      const target = exchangeCurrency(currencies, to);
      const amount = Number(amountInput.value);
      if (fromSymbol) fromSymbol.textContent = source.symbol;
      if (pairText) pairText.textContent = `${from} ${source.label} → ${to} ${target.label}`;
      if (!rates) {
        result.textContent = "匯率載入中…";
        if (rateText) rateText.textContent = "正在取得最新參考匯率";
        if (resultNote) resultNote.textContent = exchange.note;
        return;
      }
      const fromRate = Number(rates[from]);
      const toRate = Number(rates[to]);
      const factor = fromRate && toRate ? toRate / fromRate : NaN;
      if (!Number.isFinite(amount) || amount < 0) {
        result.textContent = "請輸入有效金額";
        if (rateText) rateText.textContent = "金額需為 0 或以上";
        return;
      }
      if (!Number.isFinite(factor)) {
        result.textContent = "暫無此幣別匯率";
        if (rateText) rateText.textContent = "請稍後再試";
        return;
      }
      result.textContent = formatExchangeAmount(to, amount * factor, currencies);
      if (rateText) rateText.textContent = `1 ${from} ≈ ${formatExchangeRate(to, factor, currencies)}`;
      if (resultNote) resultNote.textContent = exchange.note;
    };

    const load = async () => {
      if (status) status.textContent = "正在更新匯率…";
      if (retry) retry.hidden = true;
      try {
        const data = await fetchExchangeRates(exchange);
        rates = data.rates;
        cachedExchangeData = data;
        try { localStorage.setItem("eccv-exchange-cache", JSON.stringify(data)); } catch (_) {}
        if (status) status.textContent = `匯率更新完成 · ${formatExchangeUpdated(data)}`;
        render();
      } catch (_) {
        if (cachedExchangeData?.rates) {
          rates = cachedExchangeData.rates;
          if (status) status.textContent = `離線模式（使用 ${formatExchangeUpdated(cachedExchangeData)} 快取）`;
        } else {
          rates = null;
          if (status) status.textContent = "匯率暫時無法更新 · 可重試";
        }
        if (retry) retry.hidden = false;
        render();
      }
    };

    amountInput.addEventListener("input", render);
    fromSelect.addEventListener("change", render);
    toSelect.addEventListener("change", render);
    document.querySelector("[data-exchange-swap]")?.addEventListener("click", () => {
      const from = fromSelect.value;
      fromSelect.value = toSelect.value;
      toSelect.value = from;
      render();
    });
    document.querySelectorAll("[data-exchange-quick]").forEach((button) => button.addEventListener("click", () => {
      amountInput.value = button.dataset.exchangeQuick;
      render();
    }));
    retry?.addEventListener("click", load);
    render();
    load();
  }

  function translationContentText(data) {
    const content = data?.choices?.[0]?.message?.content;
    const text = Array.isArray(content)
      ? content.map((part) => typeof part === "string" ? part : part?.text || "").join("")
      : content;
    return typeof text === "string" ? text.replace(/<think>[\s\S]*?<\/think>/gi, "").trim() : "";
  }

  function resolveEndpoint(raw) {
    const trimmed = String(raw || "").trim();
    if (!trimmed) return "";
    try {
      const url = new URL(trimmed);
      const cleanPath = url.pathname.replace(/\/+$/, "");
      if (cleanPath.endsWith("/chat/completions")) {
        return url.toString();
      }
      if (cleanPath.endsWith("/v1")) {
        url.pathname = `${cleanPath}/chat/completions`;
        return url.toString();
      }
      if (!cleanPath || cleanPath === "") {
        url.pathname = "/v1/chat/completions";
        return url.toString();
      }
      url.pathname = `${cleanPath}/chat/completions`;
      return url.toString();
    } catch (_) {
      return trimmed;
    }
  }

  async function requestTranslation(translator, messages, model) {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 12000);
    let response;
    const endpoint = resolveEndpoint(translator.endpoint);
    try {
      response = await fetch(endpoint, {
        method: "POST",
        headers: { Authorization: `Bearer ${translator.apiKey}`, "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ model, messages, temperature: 0.2, stream: false }),
        signal: controller.signal
      });
    } catch (fetchErr) {
      if (fetchErr.name === "AbortError") {
        const timeoutErr = new Error("連線逾時（超過 12 秒無回應）");
        timeoutErr.code = "TIMEOUT";
        timeoutErr.detail = "連線逾時（超過 12 秒無回應）";
        throw timeoutErr;
      }
      const isHttpCleartext = endpoint.startsWith("http://") && !endpoint.includes("localhost") && !endpoint.includes("127.0.0.1");
      const networkErr = new Error(
        isHttpCleartext
          ? "無法連線：Android 預設封鎖未加密 HTTP，請使用 https:// 網址"
          : "無法連線至 API 伺服器：請確認網路連線、網址正確性，或伺服器是否允許跨來源請求（CORS）"
      );
      networkErr.code = "NETWORK_ERROR";
      networkErr.detail = networkErr.message;
      networkErr.cause = fetchErr;
      throw networkErr;
    } finally {
      window.clearTimeout(timeout);
    }
    let data = {};
    try { data = await response.json(); } catch (_) { /* The generic error below is clearer than an empty response. */ }
    if (!response.ok) {
      const serverMessage = data?.error?.message || data?.message || response.statusText || "";
      let detail = `HTTP ${response.status}`;
      if (response.status === 401) {
        detail = `API Key 無效或未授權（HTTP 401）${serverMessage ? `：${serverMessage}` : ""}`;
      } else if (response.status === 404) {
        detail = `找不到模型或路徑（HTTP 404）${serverMessage ? `：${serverMessage}` : "，請確認 Model ID 是否正確"}`;
      } else if (response.status === 429) {
        detail = `已超出額度限制或頻率限制（HTTP 429）${serverMessage ? `：${serverMessage}` : ""}`;
      } else if (serverMessage) {
        detail = `API 錯誤（HTTP ${response.status}）：${serverMessage}`;
      }
      const err = new Error(detail);
      err.status = response.status;
      err.detail = detail;
      throw err;
    }
    const text = translationContentText(data);
    if (!text) throw new Error("API 回傳成功但無文字內容");
    return { text, model: data.model || model };
  }

  async function translateWithFallback(translator, messages) {
    const models = [translator.model, translator.fallbackModel].filter((model, index, list) => model && list.indexOf(model) === index);
    let lastError;
    for (const model of models) {
      try {
        return await requestTranslation(translator, messages, model);
      } catch (error) {
        lastError = error;
      }
    }
    throw lastError || new Error("No translation model is configured");
  }

  function imageFileDataUrl(file) {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error("No image selected"));
        return;
      }
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("Image could not be read"));
      reader.onload = () => {
        const source = String(reader.result || "");
        const image = new Image();
        image.onerror = () => resolve(source);
        image.onload = () => {
          const maxSide = 1600;
          if (image.naturalWidth <= maxSide && image.naturalHeight <= maxSide) {
            resolve(source);
            return;
          }
          const scale = Math.min(maxSide / image.naturalWidth, maxSide / image.naturalHeight);
          const canvas = document.createElement("canvas");
          canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
          canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
          canvas.getContext("2d")?.drawImage(image, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", 0.84));
        };
        image.src = source;
      };
      reader.readAsDataURL(file);
    });
  }

  function setupTranslator() {
    const trip = window.TRIP || {};
    const core = getCore();
    const android = getAndroid();
    const esc = core.esc;
    const translator = trip.tools?.translator;
    const credentialStorageKey = "eccv-translator-credentials-v1";
    const languages = Array.isArray(translator?.languages) ? translator.languages : [];
    const textInput = document.querySelector("[data-translate-input]");
    const targetSelect = document.querySelector("[data-translate-target]");
    const textButton = document.querySelector("[data-translate-text]");
    const imageButton = document.querySelector("[data-translate-image]");
    const imageInput = document.querySelector("[data-translate-file]");
    const cameraButton = document.querySelector("[data-translate-camera]");
    const cameraPanel = document.querySelector("[data-translate-camera-panel]");
    const cameraVideo = document.querySelector("[data-translate-camera-video]");
    const cameraShoot = document.querySelector("[data-translate-camera-shoot]");
    const cameraClose = document.querySelector("[data-translate-camera-close]");
    const cameraStatus = document.querySelector("[data-translate-camera-status]");
    const resultNode = document.querySelector("[data-translate-result]");
    const resultModel = document.querySelector("[data-translate-model]");
    const googleAttribution = document.querySelector("[data-google-translate-attribution]");
    const status = document.querySelector("[data-translate-status]");
    const count = document.querySelector("[data-translate-count]");
    const previewWrap = document.querySelector("[data-translate-preview-wrap]");
    const preview = document.querySelector("[data-translate-preview]");
    const fileName = document.querySelector("[data-translate-file-name]");
    const offlinePanel = document.querySelector("[data-offline-translate-panel]");
    const offlineDisclaimer = document.querySelector("[data-offline-translate-disclaimer]");
    const offlineStatus = document.querySelector("[data-offline-translate-status]");
    const offlineButton = document.querySelector("[data-offline-translate-prepare]");
    const endpointInput = document.querySelector("[data-translate-endpoint]");
    const modelInput = document.querySelector("[data-translate-model-input]");
    const apiKeyInput = document.querySelector("[data-translate-api-key]");
    const keyToggle = document.querySelector("[data-translate-key-toggle]");
    const connectionVerify = document.querySelector("[data-translate-connection-verify], [data-translate-connection-save]");
    const connectionClear = document.querySelector("[data-translate-connection-clear]");
    const connectionState = document.querySelector("[data-translate-connection-state]");
    const connectionHelp = document.querySelector("[data-translate-connection-help]");
    if (!translator || !languages.length || !textInput || !targetSelect || !textButton || !imageButton || !imageInput || !cameraButton || !cameraPanel || !cameraVideo || !cameraShoot || !cameraClose || !resultNode || !endpointInput || !modelInput || !apiKeyInput || !connectionVerify || !connectionClear) return;

    targetSelect.innerHTML = languages.map((language) => `<option value="${esc(language.code)}">${esc(language.label)}</option>`).join("");
    targetSelect.value = languages.some((language) => language.code === translator.defaultTarget) ? translator.defaultTarget : languages[0].code;

    const offlineTranslator = android.getOfflineTranslator();

    let credentials = { endpoint: "", model: "", apiKey: "" };
    let verifiedCredentials = null;
    try {
      const savedCredentials = JSON.parse(localStorage.getItem(credentialStorageKey) || "null");
      if (savedCredentials && typeof savedCredentials.endpoint === "string" && typeof savedCredentials.apiKey === "string") {
        credentials = {
          endpoint: savedCredentials.endpoint.trim(),
          model: typeof savedCredentials.model === "string" ? savedCredentials.model.trim() : "",
          apiKey: savedCredentials.apiKey.trim()
        };
        if (savedCredentials.verified) {
          verifiedCredentials = {
            ...credentials,
            verified: true,
            verifiedAt: savedCredentials.verifiedAt || Date.now(),
            verifiedModel: savedCredentials.verifiedModel || credentials.model || ""
          };
        }
      }
    } catch (_) {
      // Invalid or unavailable local storage is treated as an empty connection.
    }
    endpointInput.value = credentials.endpoint;
    modelInput.value = credentials.model;
    apiKeyInput.value = credentials.apiKey;
    let selectedImage = null;
    let previewUrl = "";
    let busy = false;
    let verifyingConnection = false;
    let lastVerificationError = "";
    let preparingOffline = false;
    let offlineReady = false;
    let cameraStream = null;
    let cameraStarting = false;
    let cameraRequestId = 0;

    const targetLanguage = () => languages.find((language) => language.code === targetSelect.value) || languages[0];
    const validEndpoint = (value) => {
      try {
        const url = new URL(String(value || "").trim());
        return url.protocol === "https:" || url.protocol === "http:";
      } catch (_) {
        return false;
      }
    };
    const hasCredentials = () => validEndpoint(credentials.endpoint) && Boolean(credentials.apiKey);
    const pendingCredentialsValid = () => validEndpoint(endpointInput.value) && Boolean(apiKeyInput.value.trim());
    const isCurrentInputVerified = () => {
      if (!verifiedCredentials || !verifiedCredentials.verified) return false;
      return (
        endpointInput.value.trim() === verifiedCredentials.endpoint &&
        modelInput.value.trim() === verifiedCredentials.model &&
        apiKeyInput.value.trim() === verifiedCredentials.apiKey
      );
    };
    const onlineTranslator = () => {
      const ep = credentials.endpoint;
      const defaultModel = ep.includes("openai.com") ? "gpt-4o-mini" : translator.model;
      const selectedModel = credentials.model || defaultModel;
      return {
        ...translator,
        endpoint: ep,
        model: selectedModel,
        fallbackModel: credentials.model ? "" : translator.fallbackModel,
        apiKey: credentials.apiKey
      };
    };
    const renderConnectionState = () => {
      if (!connectionState) return;
      connectionState.classList.remove("is-ready", "is-pending", "is-testing", "is-error");

      if (verifyingConnection) {
        connectionState.textContent = "連線測試中…";
        connectionState.classList.add("is-testing");
        if (connectionHelp) {
          connectionHelp.className = "translate-connection-help";
          connectionHelp.textContent = "正在發送測試請求至 API 伺服器…";
        }
        return;
      }

      if (isCurrentInputVerified()) {
        const modelLabel = verifiedCredentials.verifiedModel ? `（${verifiedCredentials.verifiedModel}）` : "";
        connectionState.textContent = `✓ 已驗證連線${modelLabel}`;
        connectionState.classList.add("is-ready");
        if (connectionHelp) {
          connectionHelp.className = "translate-connection-help is-success";
          connectionHelp.textContent = `✓ 連線驗證成功！設定已儲存在這台裝置，翻譯時將優先使用此 API。`;
        }
        if (status && !busy) {
          status.textContent = "線上 API 已就緒（優先使用）";
        }
      } else if (lastVerificationError) {
        connectionState.textContent = "✗ 驗證失敗";
        connectionState.classList.add("is-error");
        if (connectionHelp) {
          connectionHelp.className = "translate-connection-help is-error";
          connectionHelp.textContent = `✗ 驗證失敗：${lastVerificationError}。請修正後再點擊「驗證連線」。`;
        }
        if (status && !busy) {
          status.textContent = offlineTranslator ? "可使用 Android 離線翻譯 · 線上驗證失敗" : "線上驗證失敗，請檢查設定";
        }
      } else if (pendingCredentialsValid()) {
        connectionState.textContent = "待驗證連線";
        connectionState.classList.add("is-pending");
        if (connectionHelp) {
          connectionHelp.className = "translate-connection-help";
          connectionHelp.textContent = "設定尚未驗證。請按「驗證連線」確認伺服器與金鑰正常回應。";
        }
        if (status && !busy) {
          status.textContent = offlineTranslator ? "可使用 Android 離線翻譯 · 線上待驗證" : "請驗證線上 API 連線";
        }
      } else {
        connectionState.textContent = "尚未設定";
        if (connectionHelp) {
          connectionHelp.className = "translate-connection-help";
          connectionHelp.textContent = "支援 Base URL（如 https://api.openai.com/v1）或完整 endpoint；點擊「驗證連線」測試成功後自動儲存。";
        }
        if (status && !busy) {
          status.textContent = offlineTranslator ? "可使用 Android 離線翻譯" : "請先設定線上翻譯";
        }
      }
    };
    const updateControls = () => {
      const isVerified = isCurrentInputVerified();
      const translationAvailable = isVerified || hasCredentials() || Boolean(offlineTranslator);
      if (count) count.textContent = `${textInput.value.length} 字`;
      textButton.disabled = busy || verifyingConnection || !translationAvailable || !textInput.value.trim();
      imageButton.disabled = busy || verifyingConnection || !translationAvailable || !selectedImage;
      targetSelect.disabled = busy || verifyingConnection;
      imageInput.disabled = busy || verifyingConnection || cameraStarting || !translationAvailable;
      cameraButton.disabled = busy || verifyingConnection || cameraStarting || Boolean(cameraStream) || !translationAvailable;
      cameraShoot.disabled = busy || verifyingConnection || !cameraStream;
      if (offlineButton) offlineButton.disabled = busy || verifyingConnection || preparingOffline || offlineReady;
      endpointInput.disabled = busy || verifyingConnection;
      modelInput.disabled = busy || verifyingConnection;
      apiKeyInput.disabled = busy || verifyingConnection;
      if (keyToggle) keyToggle.disabled = busy || verifyingConnection;

      if (connectionVerify) {
        if (verifyingConnection) {
          connectionVerify.textContent = "正在驗證連線…";
          connectionVerify.disabled = true;
          connectionVerify.className = "button button-primary";
        } else if (isVerified) {
          connectionVerify.textContent = "✓ 連線成功";
          connectionVerify.disabled = false;
          connectionVerify.className = "button button-success";
          connectionVerify.title = "已完成驗證，點擊可重新測試連線";
        } else {
          connectionVerify.textContent = lastVerificationError ? "重新驗證連線" : "驗證連線";
          connectionVerify.disabled = busy || !pendingCredentialsValid();
          connectionVerify.className = "button button-primary";
          connectionVerify.title = pendingCredentialsValid() ? "點擊測試 API 連線並儲存至本機" : "請輸入 Base URL 與 API Key";
        }
      }

      connectionClear.disabled = busy || verifyingConnection || (
        !credentials.endpoint && !credentials.model && !credentials.apiKey &&
        !endpointInput.value && !modelInput.value && !apiKeyInput.value
      );
    };
    const setBusy = (value, label) => {
      busy = value;
      if (status && label) status.textContent = label;
      updateControls();
    };
    const showTranslation = (response, kind) => {
      resultNode.textContent = response.text;
      if (resultModel) {
        if (response.offline) {
          resultModel.textContent = response.fallbackReason
            ? `Android 離線模型 · 線上失敗備援（${response.fallbackReason}）`
            : "Android 離線模型 · ML Kit";
        } else {
          resultModel.textContent = response.model === translator.fallbackModel ? `備援模型 · ${response.model}` : `模型 · ${response.model}`;
        }
      }
      if (googleAttribution) googleAttribution.hidden = !response.offline;
      if (status) {
        if (response.offline && response.fallbackReason) {
          status.textContent = `${kind === "image" ? "圖片" : "文字"}翻譯完成 · 線上失敗已自動改用離線備援`;
        } else {
          status.textContent = `${kind === "image" ? "圖片" : "文字"}翻譯完成${response.offline ? " · 離線" : ""}`;
        }
      }
    };
    const translateOffline = async (kind, payload, target) => {
      if (!offlineTranslator) throw new Error("Android offline translator unavailable");
      const response = kind === "image"
        ? await offlineTranslator.translateImage({ image: payload, targetLanguage: target.code })
        : await offlineTranslator.translateText({ text: payload, targetLanguage: target.code });
      return { ...response, offline: true };
    };
    const translateSmart = async (kind, messages, payload, target) => {
      let onlineFailure = null;
      if (offlineTranslator && navigator.onLine === false) return translateOffline(kind, payload, target);
      if (hasCredentials()) {
        try {
          return await translateWithFallback(onlineTranslator(), messages);
        } catch (onlineError) {
          console.warn("Online translation failed, falling back:", onlineError);
          onlineFailure = onlineError;
          if (!offlineTranslator) throw onlineError;
        }
      }
      if (offlineTranslator) {
        const offResult = await translateOffline(kind, payload, target);
        if (onlineFailure) {
          offResult.fallbackReason = onlineFailure.detail || onlineFailure.message || "線上 API 連線失敗";
        }
        return offResult;
      }
      throw new Error("Translation connection is not configured");
    };
    const runTranslation = async (kind, messages, payload, target) => {
      if (busy) return;
      setBusy(true, kind === "image" ? "正在讀取圖片並翻譯…" : "正在翻譯…");
      try {
        const response = await translateSmart(kind, messages, payload, target);
        showTranslation(response, kind);
      } catch (_) {
        if (googleAttribution) googleAttribution.hidden = true;
        resultNode.textContent = offlineTranslator && !offlineReady
          ? "離線語言包尚未準備完成。請先連上 Wi-Fi，按下方按鈕下載一次。"
          : "翻譯暫時失敗，請稍後再試。";
        if (resultModel) resultModel.textContent = offlineTranslator ? "線上與離線翻譯皆不可用" : "服務暫時不可用";
        if (status) status.textContent = offlineTranslator && !offlineReady ? "尚未準備離線語言包" : "翻譯失敗 · 請稍後再試";
      } finally {
        setBusy(false);
      }
    };

    const translateImage = async () => {
      if (!selectedImage || busy) return;
      const target = targetLanguage();
      setBusy(true, "正在讀取圖片並翻譯…");
      try {
        const imageDataUrl = await imageFileDataUrl(selectedImage);
        const messages = [
          { role: "system", content: translator.systemPrompt },
          { role: "user", content: [
            { type: "text", text: `Read all visible text in this image and translate it into ${target.label} (${target.code}). Preserve the reading order and return only the translation.` },
            { type: "image_url", image_url: { url: imageDataUrl } }
          ] }
        ];
        const response = await translateSmart("image", messages, imageDataUrl, target);
        showTranslation(response, "image");
      } catch (_) {
        if (googleAttribution) googleAttribution.hidden = true;
        resultNode.textContent = offlineTranslator && !offlineReady
          ? "離線語言包尚未準備完成。請先連上 Wi-Fi，按下方按鈕下載一次。"
          : "圖片翻譯暫時失敗，請換一張圖片或稍後再試。";
        if (resultModel) resultModel.textContent = offlineTranslator ? "線上與離線翻譯皆不可用" : "服務暫時不可用";
        if (status) status.textContent = offlineTranslator && !offlineReady ? "尚未準備離線語言包" : "圖片翻譯失敗 · 請稍後再試";
      } finally {
        setBusy(false);
      }
    };

    const chooseImage = (file) => {
      selectedImage = file || null;
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      previewUrl = "";
      if (selectedImage && preview && previewWrap) {
        previewUrl = URL.createObjectURL(selectedImage);
        preview.src = previewUrl;
        preview.alt = `待翻譯圖片：${selectedImage.name}`;
        previewWrap.hidden = false;
        if (fileName) fileName.textContent = selectedImage.name;
      } else if (previewWrap) {
        previewWrap.hidden = true;
      }
      updateControls();
      if (selectedImage) window.setTimeout(translateImage, 0);
    };

    const stopCamera = () => {
      cameraRequestId += 1;
      cameraStarting = false;
      cameraStream?.getTracks().forEach((track) => track.stop());
      cameraStream = null;
      cameraVideo.srcObject = null;
      cameraPanel.hidden = true;
      updateControls();
    };

    const startCamera = async () => {
      if (busy || cameraStarting || cameraStream) return;
      cameraPanel.hidden = false;
      if (cameraStatus) cameraStatus.textContent = "正在啟動後鏡頭…";
      cameraStarting = true;
      const requestId = ++cameraRequestId;
      updateControls();
      try {
        if (!navigator.mediaDevices?.getUserMedia) throw new Error("Camera API unavailable");
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: { facingMode: { ideal: "environment" }, width: { ideal: 1600 }, height: { ideal: 1200 } }
        });
        if (requestId !== cameraRequestId) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        cameraStream = stream;
        cameraVideo.srcObject = cameraStream;
        await cameraVideo.play();
        if (requestId !== cameraRequestId) return;
        if (cameraStatus) cameraStatus.textContent = "對準文字後，按「拍攝並翻譯」。";
        if (status) status.textContent = "相機已開啟";
      } catch (_) {
        if (requestId !== cameraRequestId) return;
        cameraStream?.getTracks().forEach((track) => track.stop());
        cameraStream = null;
        cameraVideo.srcObject = null;
        if (cameraStatus) cameraStatus.textContent = "無法開啟相機。請允許相機權限，或改用上傳圖片。";
        if (status) status.textContent = "相機無法使用 · 可改用上傳圖片";
      } finally {
        if (requestId === cameraRequestId) {
          cameraStarting = false;
          updateControls();
        }
      }
    };

    const cameraFrameFile = () => new Promise((resolve, reject) => {
      if (!cameraStream || !cameraVideo.videoWidth || !cameraVideo.videoHeight) {
        reject(new Error("Camera is not ready"));
        return;
      }
      const canvas = document.createElement("canvas");
      canvas.width = cameraVideo.videoWidth;
      canvas.height = cameraVideo.videoHeight;
      const context = canvas.getContext("2d");
      if (!context) {
        reject(new Error("Canvas is unavailable"));
        return;
      }
      context.drawImage(cameraVideo, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Photo could not be created"));
          return;
        }
        const stamp = new Date().toISOString().replace(/[:.]/g, "-");
        resolve(new File([blob], `camera-${stamp}.jpg`, { type: "image/jpeg", lastModified: Date.now() }));
      }, "image/jpeg", 0.9);
    });

    const takePhoto = async () => {
      if (!cameraStream || busy) return;
      cameraShoot.disabled = true;
      if (cameraStatus) cameraStatus.textContent = "正在擷取照片…";
      try {
        const file = await cameraFrameFile();
        stopCamera();
        chooseImage(file);
      } catch (_) {
        if (cameraStatus) cameraStatus.textContent = "拍攝失敗，請等畫面穩定後再試一次。";
        updateControls();
      }
    };

    const verifyAndSaveConnection = async () => {
      if (verifyingConnection || busy) return;
      const endpoint = endpointInput.value.trim();
      let model = modelInput.value.trim();
      if (!model && endpoint.includes("openai.com")) {
        model = "gpt-4o-mini";
        modelInput.value = "gpt-4o-mini";
      }
      const apiKey = apiKeyInput.value.trim();

      if (!validEndpoint(endpoint) || !apiKey) {
        lastVerificationError = "請輸入以 http:// 或 https:// 開頭的完整 endpoint 或 Base URL，以及 API Key。";
        renderConnectionState();
        updateControls();
        return;
      }

      verifyingConnection = true;
      lastVerificationError = "";
      renderConnectionState();
      updateControls();

      const testModel = model || (endpoint.includes("openai.com") ? "gpt-4o-mini" : translator.model);
      const testConfig = {
        endpoint,
        model: testModel,
        apiKey
      };

      try {
        const testResult = await requestTranslation(
          testConfig,
          [
            { role: "system", content: "You are a translator. Translate to Traditional Chinese. Return only translation." },
            { role: "user", content: "Hello" }
          ],
          testModel
        );

        credentials = { endpoint, model, apiKey };
        verifiedCredentials = {
          ...credentials,
          verified: true,
          verifiedAt: Date.now(),
          verifiedModel: testResult.model || testModel
        };

        try {
          localStorage.setItem(credentialStorageKey, JSON.stringify(verifiedCredentials));
        } catch (_) {}

        lastVerificationError = "";
      } catch (err) {
        lastVerificationError = err.detail || err.message || "連線測試失敗";
      } finally {
        verifyingConnection = false;
        renderConnectionState();
        updateControls();
      }
    };

    const clearCredentials = () => {
      credentials = { endpoint: "", model: "", apiKey: "" };
      verifiedCredentials = null;
      lastVerificationError = "";
      endpointInput.value = "";
      modelInput.value = "";
      apiKeyInput.value = "";
      apiKeyInput.type = "password";
      if (keyToggle) {
        keyToggle.textContent = "顯示";
        keyToggle.setAttribute("aria-label", "顯示 API Key");
        keyToggle.setAttribute("title", "顯示 API Key");
      }
      try { localStorage.removeItem(credentialStorageKey); } catch (_) { /* The in-memory copy is still cleared. */ }
      renderConnectionState();
      updateControls();
    };

    const onInputChange = () => {
      lastVerificationError = "";
      renderConnectionState();
      updateControls();
    };

    textInput.addEventListener("input", updateControls);
    endpointInput.addEventListener("input", onInputChange);
    modelInput.addEventListener("input", onInputChange);
    apiKeyInput.addEventListener("input", onInputChange);
    connectionVerify.addEventListener("click", verifyAndSaveConnection);
    connectionClear.addEventListener("click", clearCredentials);
    keyToggle?.addEventListener("click", () => {
      const reveal = apiKeyInput.type === "password";
      apiKeyInput.type = reveal ? "text" : "password";
      keyToggle.textContent = reveal ? "隱藏" : "顯示";
      keyToggle.setAttribute("aria-label", reveal ? "隱藏 API Key" : "顯示 API Key");
      keyToggle.setAttribute("title", reveal ? "隱藏 API Key" : "顯示 API Key");
    });
    targetSelect.addEventListener("change", updateControls);
    imageInput.addEventListener("change", () => {
      const file = imageInput.files?.[0] || null;
      imageInput.value = "";
      chooseImage(file);
    });
    textButton.addEventListener("click", () => {
      const text = textInput.value.trim();
      if (!text) return;
      const target = targetLanguage();
      runTranslation("text", [
        { role: "system", content: translator.systemPrompt },
        { role: "user", content: `Translate the following text into ${target.label} (${target.code}). Return only the translation.\n\n${text}` }
      ], text, target);
    });
    cameraButton.addEventListener("click", startCamera);
    cameraShoot.addEventListener("click", takePhoto);
    cameraClose.addEventListener("click", stopCamera);
    imageButton.addEventListener("click", translateImage);
    window.addEventListener("pagehide", stopCamera);
    if (offlineTranslator && offlinePanel && offlineButton && offlineStatus) {
      offlinePanel.hidden = false;
      if (offlineDisclaimer) offlineDisclaimer.hidden = false;
      const refreshOfflineStatus = async () => {
        try {
          const packStatus = await offlineTranslator.status();
          offlineReady = Boolean(packStatus.ready);
          const downloaded = Array.isArray(packStatus.downloadedLanguages) ? packStatus.downloadedLanguages.length : 0;
          offlineStatus.textContent = offlineReady
            ? "已準備完成。飛航模式下可翻譯文字，也可用相機辨識拉丁字母告示。"
            : `尚未準備完成（${downloaded}/${packStatus.requiredCount || 6} 個語言包）。出發前請連上 Wi-Fi 下載。`;
          offlineButton.textContent = offlineReady ? "離線翻譯已準備" : "下載離線語言包";
        } catch (_) {
          offlineStatus.textContent = "無法讀取離線語言包狀態，請重新開啟 App 再試。";
        }
        updateControls();
      };
      offlineButton.addEventListener("click", async () => {
        if (preparingOffline || offlineReady) return;
        preparingOffline = true;
        offlineButton.textContent = "正在下載，請勿關閉 App…";
        offlineStatus.textContent = "正在透過 Wi-Fi 下載英文、法文、丹麥文、瑞典文、芬蘭文與中文模型；約需 180 MB。";
        updateControls();
        try {
          await offlineTranslator.prepare({ wifiOnly: true });
          offlineReady = true;
          offlineStatus.textContent = "下載完成。建議開啟飛航模式做一次文字與照片測試。";
          offlineButton.textContent = "離線翻譯已準備";
        } catch (_) {
          offlineStatus.textContent = "下載未完成。請確認正在使用 Wi-Fi、有足夠空間，然後再試一次。";
          offlineButton.textContent = "重新下載離線語言包";
        } finally {
          preparingOffline = false;
          updateControls();
        }
      });
      refreshOfflineStatus();
    }
    renderConnectionState();
    updateControls();
  }

  async function setupBiometricTools() {
    const android = getAndroid();
    const section = document.getElementById("tools-security");
    if (!section) return;

    if (!android.isNative()) {
      section.hidden = true;
      return;
    }

    const status = await android.checkBiometricsStatus();
    if (!status.canUseBiometrics && !status.isRegistered) {
      section.hidden = true;
      return;
    }

    section.hidden = false;
    const bioPill = document.querySelector("[data-tools-bio-pill]");
    const bioDesc = document.querySelector("[data-tools-bio-desc]");
    const bioBadge = document.querySelector("[data-tools-bio-badge]");
    const bioActions = document.querySelector("[data-tools-bio-actions]");
    const clearBtn = document.querySelector("[data-tools-bio-clear]");

    if (status.isRegistered) {
      if (bioPill) bioPill.textContent = "已啟用快速出示";
      if (bioDesc) bioDesc.textContent = "已成功綁定 Samsung S23 原生指紋。出示任何票券時可直接感應螢幕指紋，由 Knox 安全晶片即時解密。若系統變更指紋，金鑰將自動作廢以策安全。";
      if (bioBadge) {
        bioBadge.textContent = "● 已綁定";
        bioBadge.className = "tools-biometric-status-pill is-active";
      }
      if (bioActions) bioActions.hidden = false;
      clearBtn?.addEventListener("click", async () => {
        const core = getCore();
        const ok = core.confirmModal
          ? await core.confirmModal({
              title: "清除指紋綁定",
              message: "確定要清除 Samsung S23 指紋綁定嗎？\n清除後出示票券需重新輸入密碼。",
              confirmText: "清除綁定",
              cancelText: "取消",
              danger: true
            })
          : confirm("確定要清除 Samsung S23 指紋綁定嗎？清除後出示票券需重新輸入密碼。");
        if (ok) {
          await android.clearRegistration();
          if (core.toast) core.toast("已成功清除指紋綁定。");
          else alert("已成功清除指紋綁定。");
          setupBiometricTools();
        }
      });
    } else if (status.canUseBiometrics) {
      if (bioPill) bioPill.textContent = "可啟用";
      if (bioDesc) bioDesc.textContent = "偵測到本機支援 Samsung S23 硬體指紋。首次在任一票券出示時輸入正確密碼，即可一鍵綁定指紋快速出示。";
      if (bioBadge) {
        bioBadge.textContent = "可啟用";
        bioBadge.className = "tools-biometric-status-pill is-idle";
      }
      if (bioActions) bioActions.hidden = true;
    }
  }

  function toolsAppCardMarkup(app) {
    const core = getCore();
    const esc = core.esc;
    const icons = {
      skanetrafiken: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="3" width="16" height="15" rx="3"/><path d="M4 11h16M8 15h.01M16 15h.01M7 18l-2 3M17 18l2 3"/></svg>`,
      rejseplanen: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`,
      ryanair: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 20 2.5c-1.5-1.5-3.5-1-5 0.5L11.5 6.5 3.3 4.7c-.5-.1-.9.2-1 .7l-.2.9c-.1.5.1 1 .5 1.3l6.2 5.1-3.6 3.6-2.6-.5c-.3-.1-.7.1-.9.4l-.3.4c-.2.4-.1.8.2 1.1l2.8 2.8 2.8 2.8c.3.3.7.4 1.1.2l.4-.3c.3-.2.5-.6.4-.9l-.5-2.6 3.6-3.6 5.1 6.2c.3.4.8.6 1.3.5l.9-.2c.5-.1.8-.5.7-1Z"/></svg>`,
      "bonjour-ratp": `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9.5"/><path d="M7 16V8l5 6 5-6v8"/></svg>`
    };
    const appIcon = icons[app.id] || `<svg viewBox="0 0 24 24"><rect x="5" y="2" width="14" height="20" rx="3"/></svg>`;
    return `
      <article class="tools-app-card tools-app-card-${esc(app.accent || "teal")}">
        <div class="tools-app-header">
          <div class="tools-app-icon" aria-hidden="true">${appIcon}</div>
          <div class="tools-app-title-wrap">
            <div class="tools-app-meta">
              <span class="tools-app-stage">${esc(app.stageBadge || "")}</span>
              <span class="tools-app-category">${esc(app.category)}</span>
            </div>
            <h3 class="tools-app-title">${esc(app.name)}</h3>
          </div>
          <a class="tools-app-web-btn" href="${esc(app.webUrl)}" target="_blank" rel="noreferrer" title="開啟 ${esc(app.name)} 官方網站" aria-label="${esc(app.name)} 官方網站">
            <span>官網</span>
            <span aria-hidden="true">↗</span>
          </a>
        </div>
        <p class="tools-app-desc">${esc(app.desc)}</p>
        <div class="tools-app-download-grid">
          <a class="tools-download-btn tools-download-ios" href="${esc(app.iosUrl)}" target="_blank" rel="noreferrer" aria-label="在 App Store 下載 ${esc(app.name)}">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.65-.79 1.1-1.9 0.98-3.01-.96.04-2.12.64-2.8 1.44-.6.69-1.12 1.81-.98 2.89 1.07.08 2.15-.53 2.8-1.32Z"/></svg>
            <span>App Store</span>
          </a>
          <a class="tools-download-btn tools-download-android" href="${esc(app.androidUrl)}" target="_blank" rel="noreferrer" aria-label="在 Google Play 下載 ${esc(app.name)}">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true"><path d="M3.609 1.814 13.792 12 3.61 22.186a2.126 2.126 0 0 1-.22-.387A2.072 2.072 0 0 1 3.2 21.05V2.95c0-.265.064-.515.19-.75.056-.134.128-.261.22-.386M15.207 13.414l2.798 2.8-14.07 7.915 11.272-10.715M17.994 7.8 15.207 10.586 3.935 0l14.06 7.8M18.814 8.264l2.846 1.602c1.25.704 1.25 1.862 0 2.568l-2.846 1.602L15.914 12l2.9-3.736Z"/></svg>
            <span>Google Play</span>
          </a>
        </div>
      </article>`;
  }
  function setupUpdateTools() {
    const core = getCore();
    const isNative = window.ECCV_ANDROID?.isNative?.() || false;
    const exitBtn = document.querySelector("[data-app-cache-exit]");
    const checkBtn = document.querySelector("[data-pwa-check-update]");

    if (checkBtn) {
      checkBtn.addEventListener("click", async () => {
        checkBtn.disabled = true;
        const originalHtml = checkBtn.innerHTML;
        checkBtn.innerHTML = `<span aria-hidden="true">⏳</span> 檢查更新中…`;
        try {
          const res = await (core.checkPwaUpdate ? core.checkPwaUpdate() : Promise.resolve({ supported: false, updated: false, message: "無支援" }));
          if (res.updated) {
            if (core.toast) core.toast("發現新版本，正在套用更新…");
            setTimeout(() => window.location.reload(), 800);
          } else {
            if (core.toast) core.toast(res.message || "目前已是最新版本（v20260905-20）");
          }
        } catch (_) {
          if (core.toast) core.toast("檢查更新失敗，請確認網路連線");
        } finally {
          checkBtn.disabled = false;
          checkBtn.innerHTML = originalHtml;
        }
      });
    }

    if (exitBtn) {
      exitBtn.addEventListener("click", async () => {
        const confirmTitle = isNative ? "清除快取並重啟 App" : "清除離線快取";
        const confirmMsg = isNative
          ? "確定要清除本機快取並重啟 App 嗎？\n（行李清單與個人設定皆會保留，重新開啟 App 即可載入最新編譯資源）"
          : "確定要清除瀏覽器離線快取並重新載入嗎？\n（行李清單與個人設定皆會完整保留）";
        const confirmOk = isNative ? "清除並重啟" : "清除並重整";

        const ok = core.confirmModal
          ? await core.confirmModal({
              title: confirmTitle,
              message: confirmMsg,
              confirmText: confirmOk,
              cancelText: "取消"
            })
          : confirm(confirmMsg);

        if (!ok) return;

        exitBtn.disabled = true;
        exitBtn.innerHTML = `<span aria-hidden="true">⏳</span> 清除中…`;

        if (isNative && window.ECCV_ANDROID?.clearCacheAndExit) {
          await window.ECCV_ANDROID.clearCacheAndExit();
        } else {
          try {
            if ("caches" in window) {
              const keys = await caches.keys();
              await Promise.all(keys.map((k) => caches.delete(k)));
            }
            try { sessionStorage.clear(); } catch (_) {}
          } catch (e) {
            console.warn("clearCache error:", e);
          }
          if (core.toast) core.toast("快取已清除，正在重新載入最新頁面…");
          setTimeout(() => {
            window.location.reload();
          }, 400);
        }
      });
    }
  }



  function setupTools() {
    const core = getCore();
    const esc = core.esc;
    const bilingualText = core.bilingualText;
    const locations = toolsLocations();
    if (!locations.length) return;
    const now = new Date();
    const automatic = automaticToolsDay(now);
    const focusLabel = document.querySelector("[data-tools-focus-label]");
    const focusPlace = document.querySelector("[data-tools-focus-place]");
    const focusMeta = document.querySelector("[data-tools-focus-meta]");
    const focusNote = document.querySelector("[data-tools-focus-note]");
    const focusMode = document.querySelector("[data-tools-focus-mode]");
    let automaticFocusKey = automatic.key;

    const switchEuropeTab = (targetId) => {
      document.querySelectorAll("[data-europe-tab]").forEach((tab) => {
        const active = tab.dataset.europeTab === targetId;
        tab.classList.toggle("is-active", active);
        tab.setAttribute("aria-selected", active ? "true" : "false");
      });
      document.querySelectorAll("[data-europe-panel]").forEach((panel) => {
        const active = panel.dataset.europePanel === targetId;
        panel.classList.toggle("is-active", active);
        panel.hidden = !active;
      });
    };

    document.querySelectorAll("[data-europe-tab]").forEach((tab) => {
      tab.addEventListener("click", () => {
        switchEuropeTab(tab.dataset.europeTab);
      });
    });

    const updateFocus = (key, mode = "manual") => {
      const focus = toolsFocusForDay(key);
      if (!focus) return;
      const location = locations.find((item) => item.id === focus.clockId);
      const modeText = mode === "today" ? "今天的行程" : mode === "default" ? `預設位置：${location?.label || "台北"}` : mode === "next" ? "下一個行程日" : mode === "past" ? "最近一個行程日" : "手動查看";
      const isEuropeFocus = ["malmo", "copenhagen", "paris"].includes(focus.clockId);
      document.querySelectorAll("[data-tool-city-card]").forEach((card) => {
        const active = card.dataset.toolCity === focus.clockId || (isEuropeFocus && card.dataset.toolCity === "europe");
        card.classList.toggle("is-focus", active);
        const badge = card.querySelector("[data-tool-focus-badge]");
        if (badge) {
          badge.hidden = !active;
          badge.textContent = active ? `行程焦點 · ${bilingualText(focus.placeLabel)}` : "行程焦點";
        }
      });
      if (isEuropeFocus) {
        switchEuropeTab(focus.clockId);
      }
      if (focusLabel) focusLabel.textContent = modeText;
      if (focusPlace) focusPlace.textContent = bilingualText(focus.placeLabel);
      if (focusMeta) focusMeta.textContent = `${formatScheduleDate(focus.day.date)} · ${bilingualText(focus.day.city)} · ${location?.label || "當地時間"}`;
      if (focusNote) focusNote.textContent = bilingualText(focus.note);
      if (focusMode) focusMode.textContent = "依每日行程自動判斷";
    };

    const tick = () => {
      const current = new Date();
      locations.forEach((location) => {
        const time = document.querySelector(`[data-clock-time="${location.id}"]`);
        const date = document.querySelector(`[data-clock-date="${location.id}"]`);
        const offset = document.querySelector(`[data-clock-offset="${location.id}"]`);
        if (time) time.textContent = formatClockTime(current, location.timezone);
        if (date) date.textContent = formatClockDate(current, location.timezone);
        if (offset) offset.textContent = `${location.code} · ${formatTimezoneOffset(current, location.timezone, location.note)}`;
      });
      const europeTime = document.querySelector(`[data-clock-time="europe"]`);
      const europeDate = document.querySelector(`[data-clock-date="europe"]`);
      const europeOffset = document.querySelector(`[data-clock-offset="europe"]`);
      const europeLoc = locations.find((item) => item.id === "copenhagen") || { timezone: "Europe/Copenhagen", code: "CEST", note: "2026 年 9 月 UTC+2" };
      if (europeTime) europeTime.textContent = formatClockTime(current, europeLoc.timezone);
      if (europeDate) europeDate.textContent = formatClockDate(current, europeLoc.timezone);
      if (europeOffset) europeOffset.textContent = `${europeLoc.code} · ${formatTimezoneOffset(current, europeLoc.timezone, europeLoc.note)}`;

      const automaticNow = automaticToolsDay(current);
      if (automaticNow.key !== automaticFocusKey) {
        automaticFocusKey = automaticNow.key;
        updateFocus(automaticNow.key, automaticNow.mode);
      }
      const updated = document.querySelector("[data-tools-clock-updated]");
      if (updated) updated.textContent = `時鐘每秒更新 · ${formatClockTime(current, "Asia/Taipei")} 台北時間`;
    };

    const loadWeather = async () => {
      const status = document.querySelector("[data-tools-weather-status]");
      let successCount = 0;
      if (status) status.textContent = "正在更新天氣…";
      await Promise.all(locations.map(async (location) => {
        const bodyNode = document.querySelector(`[data-weather-body="${location.id}"]`);
        const glanceNode = document.querySelector(`[data-tab-glance="${location.id}"]`);
        if (bodyNode) {
          bodyNode.innerHTML = `<div class="tool-weather-loading"><span class="tool-weather-loading-icon" aria-hidden="true">◌</span><span>天氣載入中…</span></div>`;
        }
        try {
          const forecast = await fetchLocationWeather(location);
          successCount += 1;
          if (bodyNode) bodyNode.innerHTML = weatherMarkup(forecast);
          if (glanceNode) {
            const current = forecast.current || {};
            const info = weatherCodeInfo(current.weather_code);
            const tempStr = temperature(current.temperature_2m);
            glanceNode.innerHTML = `<span class="tab-temp">${esc(tempStr)}</span><span class="tab-icon" title="${esc(info.label)}" aria-label="${esc(info.label)}">${info.icon}</span>`;
          }
        } catch (_) {
          if (bodyNode) {
            bodyNode.innerHTML = weatherErrorMarkup();
            bodyNode.querySelector("[data-weather-retry]")?.addEventListener("click", loadWeather, { once: true });
          }
          if (glanceNode) {
            glanceNode.innerHTML = `<span class="tab-temp">--°</span><span class="tab-icon">!</span>`;
          }
        }
      }));
      if (status) {
        const timestamp = formatClockTime(new Date(), "Asia/Taipei");
        status.textContent = successCount === locations.length
          ? `天氣更新完成 · ${timestamp} 台北時間`
          : successCount
            ? `天氣部分更新 · ${timestamp} 台北時間`
            : "天氣暫時無法更新 · 可在各卡片重試";
      }
    };

    updateFocus(automatic.key, automatic.mode);
    tick();
    window.setInterval(tick, 1000);
    loadWeather();

    const triggerGpsWeather = () => {
      switchEuropeTab("gps");
      const bodyNode = document.querySelector('[data-weather-body="gps"]');
      const glanceNode = document.querySelector('[data-tab-glance="gps"]');
      const coordsNode = document.querySelector("[data-gps-coords]");
      const titleNode = document.querySelector("[data-gps-title]");
      const statusSmall = document.querySelector("[data-gps-tab-status]");
      const triggerBtn = document.querySelector("[data-gps-trigger-btn]");

      if (!navigator.geolocation) {
        if (bodyNode) bodyNode.innerHTML = `<div class="tool-weather-error"><strong>此裝置不支援 GPS 定位</strong><span>請確認瀏覽器或裝置具備定位功能。</span></div>`;
        return;
      }

      if (triggerBtn) {
        triggerBtn.disabled = true;
        triggerBtn.innerHTML = `<span aria-hidden="true">⏳</span> 定位中…`;
      }
      if (bodyNode) {
        bodyNode.innerHTML = `<div class="tool-weather-loading"><span class="tool-weather-loading-icon" aria-hidden="true">◌</span><span>正在向系統申請 GPS 定位…</span></div>`;
      }
      if (statusSmall) statusSmall.textContent = "定位中…";

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          if (triggerBtn) {
            triggerBtn.disabled = false;
            triggerBtn.innerHTML = `<span aria-hidden="true">↻</span> 重新定位`;
          }
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const latStr = lat.toFixed(2);
          const lonStr = lon.toFixed(2);
          if (coordsNode) coordsNode.textContent = `${latStr}°, ${lonStr}°`;
          if (statusSmall) statusSmall.textContent = "已定位";

          const knownCities = [
            { id: "taipei", name: "台北", lat: 25.03, lon: 121.56 },
            { id: "malmo", name: "Malmö (馬爾默)", lat: 55.60, lon: 13.00 },
            { id: "copenhagen", name: "Copenhagen (哥本哈根)", lat: 55.67, lon: 12.56 },
            { id: "beauvais", name: "Beauvais (博韋)", lat: 49.43, lon: 2.08 },
            { id: "paris", name: "Paris (巴黎)", lat: 48.85, lon: 2.35 }
          ];
          const closest = knownCities.map(c => ({
            ...c,
            dist: Math.hypot(c.lat - lat, c.lon - lon)
          })).sort((a, b) => a.dist - b.dist)[0];

          const label = closest && closest.dist < 0.8 ? closest.name : `經緯 ${latStr}°, ${lonStr}°`;
          if (titleNode) titleNode.innerHTML = `${esc(label)} <small>${latStr}°, ${lonStr}°</small>`;

          try {
            const gpsLocation = {
              id: "gps",
              label,
              latitude: lat,
              longitude: lon,
              timezone: "auto"
            };
            const forecast = await fetchLocationWeather(gpsLocation);
            if (bodyNode) bodyNode.innerHTML = weatherMarkup(forecast);
            if (glanceNode) {
              const current = forecast.current || {};
              const info = weatherCodeInfo(current.weather_code);
              const tempStr = temperature(current.temperature_2m);
              glanceNode.innerHTML = `<span class="tab-temp">${esc(tempStr)}</span><span class="tab-icon" title="${esc(info.label)}" aria-label="${esc(info.label)}">${info.icon}</span>`;
            }
          } catch (_) {
            if (bodyNode) {
              bodyNode.innerHTML = `<div class="tool-weather-error"><strong>定位成功但天氣連線逾時</strong><span>請檢查網路連線後重試。</span><button type="button" class="tool-retry-button" data-gps-retry>重試天氣</button></div>`;
              bodyNode.querySelector("[data-gps-retry]")?.addEventListener("click", triggerGpsWeather, { once: true });
            }
          }
        },
        (error) => {
          if (triggerBtn) {
            triggerBtn.disabled = false;
            triggerBtn.innerHTML = `<span aria-hidden="true">🧭</span> 取得 GPS 定位`;
          }
          if (statusSmall) statusSmall.textContent = "定位失敗";
          let msg = "請確認已開啟裝置定位功能並允許 App 存取位置。";
          if (error.code === error.PERMISSION_DENIED) {
            msg = "定位授權遭拒絕。請至手機「設定 → 應用程式 → ECCV 2026」開啟「位置」權限。";
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            msg = "目前無法偵測到 GPS 訊號（例如身處室內或地下室），請稍後再試。";
          } else if (error.code === error.TIMEOUT) {
            msg = "定位請求逾時，請至收訊良好處重試。";
          }
          if (bodyNode) {
            bodyNode.innerHTML = `<div class="tool-weather-error"><strong>GPS 定位未完成</strong><span>${esc(msg)}</span><button type="button" class="tool-retry-button" data-gps-retry>再試一次</button></div>`;
            bodyNode.querySelector("[data-gps-retry]")?.addEventListener("click", triggerGpsWeather, { once: true });
          }
        },
        { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 }
      );
    };

    document.querySelectorAll("[data-gps-trigger-btn]").forEach(btn => {
      btn.addEventListener("click", triggerGpsWeather);
    });

    const gpsTab = document.querySelector('[data-europe-tab="gps"]');
    if (gpsTab) {
      gpsTab.addEventListener("click", () => {
        const bodyNode = document.querySelector('[data-weather-body="gps"]');
        if (bodyNode && !bodyNode.querySelector(".tool-weather-now")) {
          triggerGpsWeather();
        }
      });
    }

    if (window.location.hash === "#weather-gps") {
      triggerGpsWeather();
    }
  }

  function renderTools() {
    const trip = window.TRIP || {};
    const core = getCore();
    const esc = core.esc;
    const layout = core.layout;
    const sectionHeading = core.sectionHeading;
    const assetPath = core.assetPath;
    const isNative = window.ECCV_ANDROID?.isNative?.() || false;

    const locations = toolsLocations();
    const weather = trip.tools?.weather || {};
    const taipeiLocation = locations.find((item) => item.id === "taipei") || locations[0];
    const europeLocations = locations.filter((item) => item.id !== "taipei");
    const cityCards = [
      taipeiCardMarkup(taipeiLocation),
      europeCardMarkup(europeLocations)
    ].join("");
    const recommendedApps = trip.tools?.recommendedApps || [];
    const appCards = recommendedApps.map(toolsAppCardMarkup).join("");

    layout(`
      <section class="tools-quick-reference" aria-labelledby="tools-quick-title">
        <div class="tools-quick-copy"><span class="eyebrow light">QUICK REFERENCE</span><strong id="tools-quick-title">快速前往</strong></div>
        <nav class="tools-quick-links" aria-label="小工具快速前往">
          <a class="tools-quick-link tools-quick-weather" href="#tools-clocks">
            <span class="tools-quick-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="8" cy="8" r="3.5"/><path d="M8 1.5v2M1.5 8h2M3.4 3.4l1.4 1.4M16.8 18.5H8.5a4.5 4.5 0 0 1-.6-9 6.3 6.3 0 0 1 11.8 2.9 3.1 3.1 0 0 1-2.9 6.1Z"/></svg></span>
            <span><small>雙時區・四地天氣</small><strong>天氣</strong></span><b aria-hidden="true">↓</b>
          </a>
          <a class="tools-quick-link tools-quick-currency" href="#tools-exchange">
            <span class="tools-quick-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M15.5 7.5h-4a3 3 0 0 0 0 6h1a3 3 0 0 1 0 6h-4M12 4.5v3M12 19.5v-3"/></svg></span>
            <span><small>EUR・DKK・SEK</small><strong>匯率</strong></span><b aria-hidden="true">↓</b>
          </a>
          <a class="tools-quick-link tools-quick-translate" href="#tools-translate">
            <span class="tools-quick-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 5h10M9 3v2c0 5-2.2 8.3-6 10M6 10c1.5 2 3.2 3.5 5.5 4.5M13 21l4-10 4 10M14.5 17h5"/></svg></span>
            <span><small>文字・照片</small><strong>翻譯</strong></span><b aria-hidden="true">↓</b>
          </a>
          <a class="tools-quick-link tools-quick-apps" href="#tools-apps">
            <span class="tools-quick-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="5" y="2" width="14" height="20" rx="3"/><path d="M12 18h.01"/></svg></span>
            <span><small>交通與登機</small><strong>推薦 App</strong></span><b aria-hidden="true">↓</b>
          </a>
          <a class="tools-quick-link tools-quick-update" href="#tools-update">
            <span class="tools-quick-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21h5v-5"/></svg></span>
            <span><small>${isNative ? "APK・快取" : "PWA・快取"}</small><strong>更新維護</strong></span><b aria-hidden="true">↓</b>
          </a>
        </nav>
      </section>

      <section class="tools-block tools-weather-section content-section" id="tools-clocks">
        <div class="section-heading-row"><div>${sectionHeading("WORLD CLOCKS + WEATHER", "雙時區對照與四地即時天氣", "台北（CST UTC+8）與歐洲旅程（CEST UTC+2，Malmö・哥本哈根・巴黎共用時區）；時鐘每秒更新，可切換查看歐洲各城市即時天氣與五天預報。")}</div><span class="result-count" data-tools-clock-updated>時鐘準備中…</span></div>
        <div class="tool-city-grid">${cityCards}</div>
        <div class="tools-weather-footer"><span data-tools-weather-status>天氣載入中…</span><span>資料來源 <a href="${esc(weather.attributionUrl || "https://open-meteo.com/")}" target="_blank" rel="noreferrer">${esc(weather.provider || "Open-Meteo")} ↗</a> · ${esc(weather.note || "出發前與當天再確認。")}</span></div>
      </section>

      <section class="tools-block content-section tools-exchange-section" id="tools-exchange">
        <div class="section-heading-row"><div>${sectionHeading("EXCHANGE RATE", "當地貨幣與台幣換算", "預設將歐元換算為新台幣（法國）；也可選丹麥克朗或瑞典克朗，再按交換按鈕切換方向。")}</div><span class="result-count" data-exchange-status>匯率載入中…</span></div>
        <div class="exchange-tool-card">
          <div class="exchange-controls">
            <div class="exchange-pair-line"><span>旅行換匯參考</span><strong data-exchange-pair>EUR 歐元 → TWD 新台幣</strong></div>
            <label class="exchange-amount-field"><span>輸入金額</span><div class="exchange-amount-wrap"><span data-exchange-from-symbol>€</span><input type="number" inputmode="decimal" min="0" step="0.01" value="100" data-exchange-amount aria-label="輸入換算金額" /></div></label>
            <div class="exchange-currency-row">
              <label><span>從</span><select data-exchange-from aria-label="選擇來源幣別"><option value="EUR">載入中…</option></select></label>
              <button class="exchange-swap" type="button" data-exchange-swap aria-label="交換換算方向" title="交換換算方向"><span aria-hidden="true">⇄</span><small>交換</small></button>
              <label><span>到</span><select data-exchange-to aria-label="選擇目標幣別"><option value="TWD">載入中…</option></select></label>
            </div>
            <div class="exchange-quick-values"><span>快速金額</span><button type="button" data-exchange-quick="100">100</button><button type="button" data-exchange-quick="500">500</button><button type="button" data-exchange-quick="1000">1,000</button><button type="button" data-exchange-quick="5000">5,000</button></div>
          </div>
          <div class="exchange-result-panel" aria-live="polite"><span class="exchange-result-label">換算結果</span><strong data-exchange-result>匯率載入中…</strong><p data-exchange-rate>正在取得最新參考匯率</p><small data-exchange-result-note>實際金額會依刷卡／提款／換匯費用不同。</small></div>
        </div>
        <aside class="exchange-travel-note"><span class="eyebrow">TRIP CURRENCY NOTE</span><p><strong>法國使用 EUR；丹麥與瑞典主要使用 DKK／SEK。</strong> 歐元不一定能直接在 Copenhagen 或 Malmö 當作當地貨幣使用。</p></aside>
        <div class="exchange-source-row"><span>資料來源 <a href="${esc((trip.tools?.exchange || {}).attributionUrl || "https://www.exchangerate-api.com/docs/free")}" target="_blank" rel="noreferrer">${esc((trip.tools?.exchange || {}).provider || "ExchangeRate-API")} ↗</a></span><button class="exchange-retry" type="button" data-exchange-retry hidden>重新整理匯率</button></div>
      </section>

      <section class="tools-block content-section translate-section" id="tools-translate">
        <div class="section-heading-row"><div>${sectionHeading("TRAVEL TRANSLATOR", "文字或照片，直接翻譯。", "有網路時使用你自己的 VLM 連線設定；Android App 可預先下載 OCR 與翻譯語言包，在完全無網路時自動接手。")}</div><span class="result-count" data-translate-status>請先設定線上翻譯</span></div>
        <section class="translate-connection-panel" aria-labelledby="translate-connection-title">
          <div class="translate-connection-heading">
            <div><span class="eyebrow">PRIVATE CONNECTION</span><strong id="translate-connection-title">設定自己的 API 連線</strong><p>Base URL／Endpoint、Model ID 與 API Key 只會儲存在這台裝置的網站／App 本機儲存空間，不會寫入網站檔案。點擊「驗證連線」確認可用後自動儲存。</p></div>
            <span class="translate-connection-state" data-translate-connection-state>尚未設定</span>
          </div>
          <div class="translate-connection-fields">
            <label><span>API Base URL / Endpoint</span><input type="url" inputmode="url" autocomplete="url" spellcheck="false" placeholder="例如 https://api.openai.com/v1" data-translate-endpoint /></label>
            <label><span>Model ID（留空使用預設，OpenAI 可填 gpt-4o-mini）</span><input type="text" autocomplete="off" spellcheck="false" placeholder="例如 gpt-4o-mini 或 ${esc((trip.tools?.translator || {}).model || "qwen3.6-35b-a3b-gmi-ray")}" data-translate-model-input /></label>
            <label><span>API Key</span><span class="translate-key-field"><input type="password" autocomplete="off" spellcheck="false" placeholder="貼上你的 API Key" data-translate-api-key /><button type="button" data-translate-key-toggle aria-label="顯示 API Key" title="顯示 API Key">顯示</button></span></label>
          </div>
          <div class="translate-connection-actions"><button class="button button-primary" type="button" data-translate-connection-verify>驗證連線</button><button class="button button-secondary" type="button" data-translate-connection-clear>清除設定</button><small data-translate-connection-help>支援 Base URL（如 https://api.openai.com/v1）或完整 endpoint；點擊「驗證連線」測試成功後自動儲存。</small></div>
        </section>
        <div class="offline-translate-panel" data-offline-translate-panel hidden>
          <div><span class="eyebrow">ANDROID OFFLINE BACKUP</span><strong>出發前準備離線翻譯</strong><p data-offline-translate-status>正在檢查離線語言包…</p><a class="offline-translate-provider" href="https://translate.google.com/" target="_blank" rel="noreferrer">離線翻譯由 Google Translate 提供技術支援 ↗</a></div>
          <button class="button button-primary" type="button" data-offline-translate-prepare>下載離線語言包</button>
        </div>
        <div class="translate-tool-card">
          <div class="translate-input-side">
            <label class="translate-text-field"><span>輸入文字</span><textarea data-translate-input rows="7" placeholder="貼上菜單、告示或交通資訊…" aria-label="輸入要翻譯的文字"></textarea></label>
            <div class="translate-input-meta"><span data-translate-count>0 字</span><span>自動偵測來源語言</span></div>
            <div class="translate-target-row"><label><span>翻成</span><select data-translate-target aria-label="選擇翻譯目標語言"><option value="zh-Hant">繁體中文</option></select></label><button class="button button-primary" type="button" data-translate-text disabled>翻譯文字</button></div>
            <div class="translate-or"><span>或</span></div>
            <div class="translate-image-picker">
              <span>選擇圖片來源</span>
              <div class="translate-image-actions" role="group" aria-label="選擇拍照或上傳圖片">
                <button class="button button-primary" type="button" data-translate-camera>開啟相機拍照</button>
                <label class="button button-secondary translate-upload-button">上傳圖片<input type="file" accept="image/*" data-translate-file aria-label="從手機相簿或裝置上傳圖片" /></label>
              </div>
              <small>手機可直接在頁面內開啟後鏡頭，也可從相簿選擇圖片。有網路時圖片會傳送至翻譯服務；Android 離線備援只在裝置內進行 OCR 與翻譯。</small>
            </div>
            <div class="translate-camera-panel" data-translate-camera-panel hidden>
              <video data-translate-camera-video autoplay muted playsinline aria-label="相機即時預覽"></video>
              <p data-translate-camera-status aria-live="polite">正在啟動後鏡頭…</p>
              <div class="translate-camera-actions"><button class="button button-primary" type="button" data-translate-camera-shoot disabled>拍攝並翻譯</button><button class="button button-secondary" type="button" data-translate-camera-close>關閉相機</button></div>
            </div>
            <button class="button button-secondary translate-image-button" type="button" data-translate-image disabled>重新翻譯圖片</button>
            <div class="translate-preview" data-translate-preview-wrap hidden><img data-translate-preview alt="待翻譯圖片預覽" /><span data-translate-file-name></span></div>
          </div>
          <div class="translate-result-panel" aria-live="polite"><div class="translate-result-heading"><span>翻譯結果</span><small data-translate-model>尚未翻譯</small></div><pre data-translate-result>結果會顯示在這裡。</pre><a class="google-translate-attribution" data-google-translate-attribution href="https://translate.google.com/" target="_blank" rel="noreferrer" hidden><img src="${assetPath("assets/powered-by-google-translate.png")}" alt="Powered by Google Translate" /></a></div>
        </div>
        <div class="translate-note"><span>翻譯順序與限制</span><p>有網路時先使用主要／備援 VLM；Android App 在斷網或線上服務失敗時自動改用裝置端 ML Kit。離線照片辨識適合英文、法文與北歐語言的拉丁字母印刷文字，手寫、特殊字型或模糊照片可能辨識不完整。</p></div>
        <details class="translate-disclaimer" data-offline-translate-disclaimer hidden><summary>Android 離線翻譯聲明</summary><p>THIS SERVICE MAY CONTAIN TRANSLATIONS POWERED BY GOOGLE. GOOGLE DISCLAIMS ALL WARRANTIES RELATED TO THE TRANSLATIONS, EXPRESS OR IMPLIED, INCLUDING ANY WARRANTIES OF ACCURACY, RELIABILITY, AND ANY IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.</p></details>
      </section>

      <section class="tools-block content-section tools-apps-section" id="tools-apps">
        <div class="section-heading-row">
          <div>${sectionHeading("RECOMMENDED APPS", "旅行必備 App 推薦", "依照瑞典、丹麥、航班至巴黎旅程順序整理，提供雙系統官方載點，出發前建議預先安裝並完成設定。")}</div>
          <span class="result-count">4 款必備</span>
        </div>
        <div class="tools-app-grid">${appCards}</div>
      </section>

      <section class="tools-block content-section tools-biometric-section" id="tools-security" hidden>
        <div class="section-heading-row">
          <div>${sectionHeading("BIOMETRIC ACCESS", "Samsung S23 指紋出示管理", "由 Android Knox 硬體安全晶片（TEE）加密保護；票券出示時可透過螢幕指紋秒速驗證，無須反覆手動輸入密碼。")}</div>
          <span class="result-count" data-tools-bio-pill>檢查中…</span>
        </div>
        <div class="tools-biometric-panel">
          <div class="tools-biometric-header">
            <div>
              <strong data-tools-bio-title>Samsung S23 指紋快速出示</strong>
              <p data-tools-bio-desc>正在偵測裝置硬體生物辨識狀態…</p>
            </div>
            <span class="tools-biometric-status-pill is-idle" data-tools-bio-badge>偵測中</span>
          </div>
          <div class="tools-biometric-actions" data-tools-bio-actions hidden>
            <button type="button" class="button button-secondary" data-tools-bio-clear>清除指紋綁定</button>
          </div>
        </div>
      </section>

      <section class="tools-block content-section tools-update-section" id="tools-update">
        <div class="section-heading-row">
          <div>${sectionHeading(isNative ? "APP MAINTENANCE" : "PWA MAINTENANCE", isNative ? "Android 獨立 App 版本與維護" : "PWA 網頁版更新與離線維護", isNative ? "App 頁面內建於安裝檔中；若有最新修改可在此更新或清除舊快取。" : "支援 Service Worker 離線快取；若 GitHub 有發布更新可在此檢查或重整。")}</div>
          <span class="result-count">${isNative ? "Android APK · v20260905-20" : "PWA 網頁版 · v20260905-20"}</span>
        </div>
        <div class="tools-update-card">
          <div class="tools-update-copy">
            <strong>${isNative ? "Android 獨立 APK 離線維護說明" : "PWA 漸進式網頁版本與離線快取說明"}</strong>
            <p>${isNative ? "本 Android App 採用離線獨立打包架構，所有網頁與離線資源已完整編譯封裝於安裝檔中，無網路環境亦可隨時查閱。本機安裝檔不會自動透過 PWA 下載遠端網頁更新。您可以：" : "您目前正在使用 PWA 網頁版。本站支援離線快取技術，已將全站行程、離線地圖與工具快取於本機裝置，即使無網路也能順暢瀏覽。您可以："}</p>
            <ul>
              ${isNative ? `
                <li><strong>安裝新版 APK 後快取異常</strong>：點擊「清除快取並重啟 App」，徹底清除 WebView 暫存並重啟（保留您的行李勾選與設定）。</li>
                <li><strong>想立即獲得最新功能</strong>：點擊「下載最新 APK 安裝檔」直接覆蓋升級，或點擊「開啟線上最新版」在瀏覽器體驗最新版。</li>
              ` : `
                <li><strong>檢查遠端是否有新發布</strong>：點擊「檢查更新並重新整理」，系統會連線 GitHub Pages 檢查是否有新版本發布，若有新資源將自動套用。</li>
                <li><strong>網頁快取異常或需強制刷新</strong>：點擊「清除快取並強制重整」，會徹底清理過期離線快取並重新載入最新頁面（保留您的行李清單與個人設定）。</li>
                <li><strong>安裝 Android 獨立 App</strong>：若需要在 Android 手機獲得最佳離線體驗與 Knox 指紋出示，可下載專屬 APK 安裝檔。</li>
              `}
            </ul>
          </div>
          <div class="tools-update-actions">
            ${isNative ? `
              <button type="button" class="button button-secondary tools-cache-exit-btn" data-app-cache-exit>
                <span aria-hidden="true">🔄</span> 清除快取並重啟 App
              </button>
              <a class="button button-primary tools-apk-download-btn" href="https://github.com/kevin77688/eccv_trip_guide/releases/latest/download/ECCV-2026-Guide.apk" target="_blank" rel="noreferrer">
                <span aria-hidden="true">📥</span> 下載最新 APK 安裝檔
              </a>
              <a class="button button-ghost tools-web-link-btn" href="https://kevin77688.github.io/eccv_trip_guide/" target="_blank" rel="noreferrer">
                <span aria-hidden="true">🌐</span> 開啟線上最新網頁版 ↗
              </a>
            ` : `
              <button type="button" class="button button-primary tools-pwa-check-btn" data-pwa-check-update>
                <span aria-hidden="true">🔄</span> 檢查更新並重新整理
              </button>
              <button type="button" class="button button-secondary tools-cache-exit-btn" data-app-cache-exit>
                <span aria-hidden="true">🧹</span> 清除快取並強制重整
              </button>
              <a class="button button-ghost tools-apk-download-btn" href="https://github.com/kevin77688/eccv_trip_guide/releases/latest/download/ECCV-2026-Guide.apk" target="_blank" rel="noreferrer">
                <span aria-hidden="true">📥</span> 下載 Android APK 安裝檔
              </a>
            `}
          </div>
        </div>
      </section>
    `);

    setupTools();
    setupExchange();
    setupTranslator();
    setupBiometricTools();
    setupUpdateTools();
  }

  window.ECCV_PAGES = window.ECCV_PAGES || {};
  window.ECCV_PAGES.tools = {
    locations: toolsLocations,
    dateKeyInTimezone: dateKeyInTimezone,
    formatClockTime: formatClockTime,
    formatClockDate: formatClockDate,
    formatTimezoneOffset: formatTimezoneOffset,
    formatScheduleDate: formatScheduleDate,
    scheduleTimezone: scheduleTimezone,
    automaticToolsDay: automaticToolsDay,
    toolsFocusForDay: toolsFocusForDay,
    weatherSvg: weatherSvg,
    weatherCodeInfo: weatherCodeInfo,
    temperature: temperature,
    precipitationProbability: precipitationProbability,
    weatherDateLabel: weatherDateLabel,
    fetchLocationWeather: fetchLocationWeather,
    render: renderTools,
    setup: setupTools,
    setupExchange: setupExchange,
    setupTranslator: setupTranslator,
    setupBiometrics: setupBiometricTools
  };
})();
