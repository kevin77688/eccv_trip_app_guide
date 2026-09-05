(function () {
  "use strict";

  function getCore() {
    return window.ECCV_CORE;
  }

  function getTools() {
    return window.ECCV_PAGES?.tools || {};
  }

  function dayCard(key, day) {
    const core = getCore();
    const esc = core.esc;
    const dayLink = core.dayLink;
    const bilingualText = core.bilingualText;
    const dateParts = day.date.slice(5).split("/");
    return `
      <article class="day-card" data-city="${esc(day.cityKey)}">
        <a class="day-card-link" href="${dayLink(key)}">
          <div class="day-date-block"><span>${esc(dateParts[0])} 月</span><strong>${esc(dateParts[1])}</strong><small>${esc(day.weekday)}</small></div>
          <div class="day-card-copy">
            <div class="day-card-meta"><span class="city-pill">${esc(bilingualText(day.city))}</span></div>
            <h3>${esc(bilingualText(day.title))}</h3>
            <div class="day-card-next"><span>查看當日路線</span><b aria-hidden="true">→</b></div>
          </div>
        </a>
      </article>`;
  }

  function homeWeatherMarkup(forecast, location) {
    const core = getCore();
    const tools = getTools();
    const esc = core.esc;
    const weatherCodeInfo = tools.weatherCodeInfo || (() => ({ icon: "◌", label: "天氣" }));
    const weatherDateLabel = tools.weatherDateLabel || ((d) => d);
    const temperature = tools.temperature || ((t) => `${t}°C`);
    const precipitationProbability = tools.precipitationProbability || ((p) => `${p}%`);

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
      return `<li><span>${esc(weatherDateLabel(date))}</span><strong aria-label="${esc(info.label)}">${info.icon}</strong><small>${esc(temperature(max[index]))} / ${esc(temperature(min[index]))}</small><em>雨 ${esc(precipitationProbability(rain[index]))}</em></li>`;
    }).join("");
    const updateTime = current.time ? String(current.time).replace("T", " ") : "目前";
    return `
      <div class="home-weather-display">
        <div class="tool-weather-now">
          <span class="tool-weather-icon" aria-hidden="true">${currentInfo.icon}</span>
          <div><span class="tool-weather-label">目前 ${esc(currentInfo.label)}</span><strong>${esc(temperature(current.temperature_2m))}</strong><small>體感 ${esc(temperature(current.apparent_temperature))} · 更新 ${esc(updateTime)}</small></div>
          <div class="tool-rain-chance"><span>今日降雨機率</span><strong>${esc(precipitationProbability(rain[0]))}</strong><small>日最高預報</small></div>
        </div>
        ${forecastRows ? `<ol class="tool-weather-forecast" aria-label="未來五天天氣預報">${forecastRows}</ol>` : ""}
        <div class="home-weather-footer">
          <span class="weather-updated">當地更新：${esc(updateTime)}</span>
          <button class="weather-refresh-link" type="button" data-home-weather-refresh>↻ 重新整理</button>
        </div>
      </div>`;
  }

  function setupHomeDashboard() {
    const trip = window.TRIP || {};
    const core = getCore();
    const tools = getTools();
    const esc = core.esc;
    const bilingualText = core.bilingualText;
    const dayLink = core.dayLink;
    const toolsFocusForDay = tools.toolsFocusForDay;
    const automaticToolsDay = tools.automaticToolsDay;
    const formatScheduleDate = tools.formatScheduleDate || ((d) => d);
    const toolsLocations = tools.locations || (() => []);
    const fetchLocationWeather = tools.fetchLocationWeather;
    const compactPlace = value => String(value).replace(/Malmö|Copenhagen|Beauvais|Paris/g, name => trip.bilingualNames?.[name] || name);

    if (!toolsFocusForDay || !automaticToolsDay) return;

    const dateSelect = document.querySelector("[data-home-focus-date]");
    const autoButton = document.querySelector("[data-home-focus-auto]");
    const modeNode = document.querySelector("[data-home-focus-label]");
    const placeNode = document.querySelector("[data-home-focus-place]");
    const metaNode = document.querySelector("[data-home-focus-meta]");
    const scheduleNode = document.querySelector("[data-home-focus-schedule]");
    const dayLinkNode = document.querySelector("[data-home-focus-day-link]");

    let automaticFocusEnabled = true;
    let currentFocusKey = "";

    const updateScheduleFocus = (key, mode = "manual") => {
      const focus = toolsFocusForDay(key);
      if (!focus) return;
      currentFocusKey = key;
      const modeText = mode === "today" ? "今天" : mode === "default" ? "旅程第一天" : mode === "next" ? "下一個行程日" : mode === "past" ? "最近行程日" : "選擇的日期";
      if (dateSelect) dateSelect.value = mode === "manual" ? key : "auto";
      if (autoButton) autoButton.hidden = mode !== "manual";
      if (modeNode) modeNode.textContent = modeText;
      if (placeNode) placeNode.textContent = `${focus.day.date.slice(5).replace("/", ".")} · ${compactPlace(focus.placeLabel)}`;
      if (metaNode) metaNode.textContent = `${formatScheduleDate(focus.day.date)} · ${bilingualText(focus.day.title)}`;
      if (dayLinkNode) {
        dayLinkNode.href = dayLink(key);
        dayLinkNode.setAttribute("aria-label", `查看 ${focus.day.date.slice(5)} ${bilingualText(focus.day.title)} 的完整行程`);
      }
      if (scheduleNode) {
        scheduleNode.innerHTML = `<section class="now-next" data-now-next="${esc(key)}" aria-label="現在與下一步"></section>`;
        window.ECCV_JOURNEY?.refresh();
      }
    };

    const updateAutomaticSchedule = () => {
      const automatic = automaticToolsDay(new Date());
      updateScheduleFocus(automatic.key, automatic.mode);
    };

    const firstDay = Object.entries(trip.days || {})[0];
    if (dateSelect && firstDay) {
      dateSelect.innerHTML = `<option value="auto">依今天日期自動選擇</option>${Object.entries(trip.days || {}).map(([key, day]) => `<option value="${esc(key)}">${esc(day.date.slice(5))} · ${esc(compactPlace(day.city))}</option>`).join("")}`;
    }
    updateAutomaticSchedule();

    dateSelect?.addEventListener("change", () => {
      if (dateSelect.value === "auto") {
        automaticFocusEnabled = true;
        updateAutomaticSchedule();
        return;
      }
      automaticFocusEnabled = false;
      updateScheduleFocus(dateSelect.value, "manual");
    });

    autoButton?.addEventListener("click", () => {
      automaticFocusEnabled = true;
      updateAutomaticSchedule();
    });

    window.setInterval(() => {
      if (!automaticFocusEnabled) return;
      const automatic = automaticToolsDay(new Date());
      if (automatic.key !== currentFocusKey) {
        updateScheduleFocus(automatic.key, automatic.mode);
      }
    }, 60000);

    const weatherBody = document.querySelector("[data-home-weather-body]");
    if (!weatherBody || !fetchLocationWeather) return;
    const weatherSource = document.querySelector("[data-home-weather-source]");
    const weatherCity = document.querySelector("[data-home-weather-city]");
    const gpsBtn = document.querySelector("[data-home-weather-gps]");
    const cityPills = document.querySelectorAll("[data-weather-city]");

    let activeWeatherMode = "auto";

    const findClosestTripCity = (lat, lon) => {
      const known = [
        { id: "taipei", label: "台北", english: "Taipei", lat: 25.033, lon: 121.5654, timezone: "Asia/Taipei" },
        { id: "malmo", label: "Malmö", english: "Malmö", lat: 55.605, lon: 13.0038, timezone: "Europe/Stockholm" },
        { id: "copenhagen", label: "哥本哈根", english: "Copenhagen", lat: 55.6761, lon: 12.5683, timezone: "Europe/Copenhagen" },
        { id: "paris", label: "巴黎", english: "Paris", lat: 48.8566, lon: 2.3522, timezone: "Europe/Paris" },
        { id: "beauvais", label: "Beauvais", english: "Beauvais", lat: 49.43, lon: 2.08, timezone: "Europe/Paris" },
        { id: "dubai", label: "杜拜", english: "Dubai", lat: 25.2048, lon: 55.2708, timezone: "Asia/Dubai" }
      ];
      let closest = null;
      let minDistance = Infinity;
      for (const city of known) {
        const dLat = (lat - city.lat);
        const dLon = (lon - city.lon);
        const dist = Math.sqrt(dLat * dLat + dLon * dLon);
        if (dist < minDistance) {
          minDistance = dist;
          closest = city;
        }
      }
      return minDistance < 0.7 ? closest : null;
    };

    const loadWeatherForLocation = async (location, sourceLabel) => {
      if (!weatherBody) return;
      weatherBody.innerHTML = `
        <div class="tool-weather-loading">
          <span class="tool-weather-loading-icon" aria-hidden="true">◌</span>
          <span>正在取得即時天氣…</span>
        </div>`;
      if (weatherSource) weatherSource.textContent = sourceLabel || "即時天氣";
      if (weatherCity) weatherCity.textContent = location.label || "當地天氣";

      try {
        const forecast = await fetchLocationWeather(location);
        weatherBody.innerHTML = homeWeatherMarkup(forecast, location);
        weatherBody.querySelector("[data-home-weather-refresh]")?.addEventListener("click", () => {
          loadWeatherForLocation(location, sourceLabel);
        }, { once: true });
      } catch (err) {
        weatherBody.innerHTML = `
          <div class="tool-weather-error">
            <strong>暫時無法取得天氣</strong>
            <span>請檢查網路連線或稍後再試。</span>
            <button type="button" class="tool-retry-button" data-home-weather-retry>重新整理</button>
          </div>`;
        weatherBody.querySelector("[data-home-weather-retry]")?.addEventListener("click", () => {
          loadWeatherForLocation(location, sourceLabel);
        }, { once: true });
      }
    };

    const getItineraryLocation = () => {
      const automatic = automaticToolsDay(new Date());
      const focus = toolsFocusForDay(automatic.key);
      const locations = toolsLocations();
      const matched = locations.find((item) => item.id === focus?.clockId);
      return matched || locations[0] || { id: "taipei", label: "台北", latitude: 25.033, longitude: 121.5654, timezone: "Asia/Taipei" };
    };

    const loadAutoOrNetworkWeather = async () => {
      const fallbackLoc = getItineraryLocation();
      const automatic = automaticToolsDay(new Date());
      const isTripDay = automatic.mode === "today";
      const initialLabel = isTripDay ? `依今日行程 (${fallbackLoc.label})` : `行程預設 (${fallbackLoc.label})`;

      await loadWeatherForLocation(fallbackLoc, initialLabel);

      try {
        const ipRes = await fetch("https://ipwho.is/", { headers: { Accept: "application/json" } });
        if (ipRes.ok) {
          const ipData = await ipRes.json();
          if (ipData.success && activeWeatherMode === "auto") {
            const lat = Number(ipData.latitude);
            const lon = Number(ipData.longitude);
            if (Number.isFinite(lat) && Number.isFinite(lon)) {
              const matchedCity = findClosestTripCity(lat, lon);
              const label = matchedCity ? matchedCity.label : (ipData.city || "目前位置");
              const networkLocation = {
                id: "network",
                label,
                latitude: lat,
                longitude: lon,
                timezone: ipData.timezone?.id || "auto"
              };
              await loadWeatherForLocation(networkLocation, `網路定位 (${label})`);
            }
          }
        }
      } catch (_) {}
    };

    const requestGpsWeather = () => {
      if (!navigator.geolocation) {
        alert("此裝置或瀏覽器不支援 GPS 定位");
        return;
      }
      if (gpsBtn) {
        gpsBtn.classList.add("is-locating");
        const textNode = gpsBtn.querySelector(".gps-text");
        if (textNode) textNode.textContent = "定位中…";
      }
      if (weatherSource) weatherSource.textContent = "正在透過 GPS 定位…";

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          if (gpsBtn) {
            gpsBtn.classList.remove("is-locating");
            const textNode = gpsBtn.querySelector(".gps-text");
            if (textNode) textNode.textContent = "GPS 定位";
          }
          activeWeatherMode = "gps";
          cityPills.forEach((p) => p.classList.toggle("is-active", p.dataset.weatherCity === "auto"));
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const matched = findClosestTripCity(lat, lon);
          const label = matched ? matched.label : "目前 GPS 位置";
          const gpsLocation = {
            id: "gps",
            label,
            latitude: lat,
            longitude: lon,
            timezone: "auto"
          };
          await loadWeatherForLocation(gpsLocation, `GPS 定位 (${label})`);
        },
        (error) => {
          if (gpsBtn) {
            gpsBtn.classList.remove("is-locating");
            const textNode = gpsBtn.querySelector(".gps-text");
            if (textNode) textNode.textContent = "GPS 定位";
          }
          console.warn("GPS Geolocation error:", error.message);
          loadAutoOrNetworkWeather();
        },
        { timeout: 10000, enableHighAccuracy: true, maximumAge: 60000 }
      );
    };

    gpsBtn?.addEventListener("click", requestGpsWeather);

    cityPills.forEach((pill) => {
      pill.addEventListener("click", () => {
        const cityKey = pill.dataset.weatherCity;
        cityPills.forEach((p) => p.classList.toggle("is-active", p === pill));
        activeWeatherMode = cityKey;
        if (cityKey === "auto") {
          loadAutoOrNetworkWeather();
        } else {
          const locations = toolsLocations();
          const targetLoc = locations.find((item) => item.id === cityKey);
          if (targetLoc) {
            loadWeatherForLocation(targetLoc, `城市天氣 (${targetLoc.label})`);
          }
        }
      });
    });

    loadAutoOrNetworkWeather();
  }

  function renderHome() {
    const trip = window.TRIP || {};
    const core = getCore();
    const esc = core.esc;
    const toolsLink = core.toolsLink;
    const packingLink = core.packingLink;
    const layout = core.layout;
    const sectionHeading = core.sectionHeading;

    const dayCards = Object.entries(trip.days || {}).map(([key, day]) => dayCard(key, day)).join("");
    const hackmdLink = trip.links?.hackmd || trip.links?.denmarkHackmd;

    layout(`
      <section class="home-journey-hero" aria-label="今日旅程">
        <div class="home-journey-heading">
          <div>
            <span class="eyebrow">ECCV 2026 · 09/06 - 09/19</span>
            <h1>今天的旅程</h1>
            <p>選擇日期，直接查看當天要去哪裡。</p>
          </div>
          <nav class="home-utility-links" aria-label="旅程相關工具">
            ${hackmdLink?.url ? `<a href="${esc(hackmdLink.url)}" target="_blank" rel="noreferrer">ECCV 筆記 <span aria-hidden="true">↗</span></a>` : ""}
            <a href="${packingLink}#souvenirs" title="查看精選伴手禮推薦與採買指南">🎁 推薦伴手禮</a>
            <a href="${toolsLink}#weather-gps" title="透過 GPS 查看所在地即時天氣">📍 GPS 定位天氣</a>
            <a href="${toolsLink}">小工具 <span aria-hidden="true">→</span></a>
          </nav>
        </div>

        <article class="home-today-card" data-home-focus-card>
          <div class="home-today-header">
            <div class="home-today-copy">
              <span class="card-kicker" data-home-focus-label>今天</span>
              <h2 data-home-focus-place>載入中…</h2>
              <p data-home-focus-meta>正在讀取行程日期…</p>
            </div>
            <a class="home-today-action" data-home-focus-day-link href="#" title="查看此日完整行程">開啟當日行程 <span aria-hidden="true">→</span></a>
          </div>

          <div data-home-focus-schedule></div>

          <div class="home-focus-toolbar">
            <label for="home-focus-date">
              <span>日期</span>
              <select id="home-focus-date" data-home-focus-date>
                <option value="auto">依今天日期自動選擇</option>
              </select>
            </label>
            <button class="button button-secondary button-sm" type="button" data-home-focus-auto hidden>回到今天</button>
          </div>
        </article>
      </section>

      <section class="content-section itinerary-section" id="itinerary">
        <div class="section-heading-row"><div>${sectionHeading("14 DAYS", "全部日期", "點選一天，進入完整的當日路線。")}</div><span class="result-count">09/06 - 09/19</span></div>
        <div class="day-grid">${dayCards}</div>
      </section>`);

    setupHomeDashboard();
  }

  window.ECCV_PAGES = window.ECCV_PAGES || {};
  window.ECCV_PAGES.home = {
    card: dayCard,
    render: renderHome,
    setup: setupHomeDashboard
  };
})();
