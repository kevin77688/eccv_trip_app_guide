(function () {
  "use strict";

  function getCore() {
    return window.ECCV_CORE;
  }

  function placeCard(id, compact) {
    const trip = window.TRIP || {};
    const core = getCore();
    const esc = core.esc;
    const bilingualText = core.bilingualText;
    const dayLink = core.dayLink;
    const assetPath = core.assetPath;
    const googleMapsLink = core.googleMapsLink;
    const placeLocation = core.placeLocation;

    const place = trip.places?.[id];
    if (!place) return "";
    const visual = trip.placeVisuals?.[id] || {};
    const details = trip.placeDetails?.[id] || {};
    const location = placeLocation(id, place);
    const scheduledDays = Object.entries(trip.days || {}).filter(([, day]) => day.places.includes(id));
    const dateKeys = scheduledDays.length ? scheduledDays.map(([key]) => key) : ["unscheduled"];
    const dateMarkup = !compact
      ? `<div class="place-date-row">${scheduledDays.length ? scheduledDays.map(([key, day]) => `<a href="${dayLink(key)}">${esc(day.date.slice(5))} · ${esc(bilingualText(day.city))}</a>`).join("") : `<span>未排入每日行程</span>`}</div>`
      : "";
    const recommendationMarkup = !compact && details.why
      ? `<div class="place-reason"><span>為什麼推薦</span><p>${esc(details.why)}</p></div>`
      : "";
    const booking = details.booking;
    const bookingMarkup = !compact && booking
      ? `<div class="place-booking booking-${esc(booking.state || "free")}"><div><span>票務</span><strong>${esc(booking.label)}</strong></div><p>${esc(booking.note)}</p></div>`
      : "";
    const ticketButton = !compact && booking?.url
      ? `<a class="ticket-button" href="${esc(booking.url)}" target="_blank" rel="noreferrer"><svg class="btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/></svg><span>${esc(booking.cta || "官方線上購票")}</span><b aria-hidden="true">↗</b></a>`
      : "";
    const locationMarkup = !compact
      ? `<div class="place-location"><div class="place-location-copy"><span aria-hidden="true">⌖</span><div><span>位置</span><strong>${esc(location)}</strong><small>Google Maps 無法開啟時，可貼到其他地圖 App</small></div></div><button class="copy-location-button" type="button" data-copy-address="${esc(location)}" data-copy-label="複製位置" aria-label="複製 ${esc(location)}"><span>複製位置</span><b aria-hidden="true">⧉</b></button></div>`
      : "";
    const image = visual.image
      ? `<figure class="place-image"><img src="${esc(assetPath(visual.image))}" alt="${esc(place.title)}" loading="lazy" /><span class="image-fallback" aria-hidden="true">${esc(place.region)}</span><figcaption><a href="${esc(visual.credit || visual.image)}" target="_blank" rel="noreferrer">${esc(visual.creditLabel || "圖片來源")}</a></figcaption></figure>`
      : `<figure class="place-image is-missing"><span class="image-fallback" aria-hidden="true">${esc(place.region)}</span></figure>`;

    if (compact) {
      return `
        <article class="place-card place-card-compact accent-${esc(place.accent)}" id="place-${esc(id)}">
          ${image}
          <div class="place-card-content"><div class="place-card-meta"><span>${esc(place.region)}</span><strong>${esc(place.stay)}</strong></div><span class="place-kicker">${esc(place.kicker)}</span><h3>${esc(place.title)}</h3><p class="place-local">${esc(place.local)}</p><p class="place-intro">${esc(place.intro)}</p><div class="place-actions"><a class="map-button" href="${esc(googleMapsLink(id, place))}" target="_blank" rel="noreferrer"><svg class="btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg><span>Google Maps 導航</span><b aria-hidden="true">↗</b></a></div></div>
        </article>`;
    }

    const firstScheduledDate = scheduledDays.length ? scheduledDays[0][1].date.slice(5) : "";
    const compactThumb = visual.image
      ? `<img src="${esc(assetPath(visual.image))}" alt="${esc(place.title)}" loading="lazy" />`
      : `<span class="thumb-fallback" aria-hidden="true">${esc(place.region.slice(0, 2))}</span>`;

    return `
      <article class="place-card accent-${esc(place.accent)}" id="place-${esc(id)}" data-dates="${esc(dateKeys.join(" "))}" data-region="${esc(place.region)}">
        <div class="place-compact-row" data-place-toggle="${esc(id)}">
          <div class="place-compact-thumb">${compactThumb}</div>
          <div class="place-compact-info">
            <div class="place-compact-title-row">
              <strong class="place-compact-title">${esc(place.local || place.title)}</strong>
              <span class="place-compact-stay">${esc(place.stay)}</span>
            </div>
            <div class="place-compact-sub">
              <span class="place-compact-region">${esc(place.region)}</span>
              <span class="place-compact-local">${esc(place.title)}</span>
              ${firstScheduledDate ? `<span class="place-compact-date">${esc(firstScheduledDate)}</span>` : ""}
            </div>
          </div>
          <div class="place-compact-actions">
            <a class="place-compact-map-btn" href="${esc(googleMapsLink(id, place))}" target="_blank" rel="noreferrer" title="Google Maps 導航" aria-label="導航至 ${esc(place.title)}">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            </a>
            <button class="place-compact-expand-btn" type="button" aria-expanded="false" aria-controls="place-details-${esc(id)}" aria-label="展開 ${esc(place.local || place.title)}" title="展開詳細資訊">
              <span class="expand-icon" aria-hidden="true">▾</span>
            </button>
          </div>
        </div>
        <div class="place-detail-section" id="place-details-${esc(id)}">
          ${image}
          <div class="place-card-content"><div class="place-card-meta"><span>${esc(place.region)}</span><strong>${esc(place.stay)}</strong></div>${dateMarkup}${locationMarkup}<span class="place-kicker">${esc(place.kicker)}</span><h3>${esc(place.title)}</h3><p class="place-local">${esc(place.local)}</p><p class="place-intro">${esc(place.intro)}</p>${recommendationMarkup}${bookingMarkup}<div class="place-actions">${ticketButton}<a class="map-button" href="${esc(googleMapsLink(id, place))}" target="_blank" rel="noreferrer"><svg class="btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg><span>Google Maps 導航</span><b aria-hidden="true">↗</b></a></div></div>
        </div>
      </article>`;
  }

  function renderPlaces() {
    const trip = window.TRIP || {};
    const core = getCore();
    const layout = core.layout;

    const itineraryDates = Object.entries(trip.days || {}).filter(([, day]) => day.places.length);
    const dateRank = new Map(itineraryDates.map(([key], index) => [key, index]));
    const sortedPlaceIds = Object.keys(trip.places || {}).sort((left, right) => {
      const leftDates = Object.entries(trip.days || {}).filter(([, day]) => day.places.includes(left)).map(([key]) => key);
      const rightDates = Object.entries(trip.days || {}).filter(([, day]) => day.places.includes(right)).map(([key]) => key);
      const leftRank = leftDates.length ? dateRank.get(leftDates[0]) : Number.MAX_SAFE_INTEGER;
      const rightRank = rightDates.length ? dateRank.get(rightDates[0]) : Number.MAX_SAFE_INTEGER;
      return leftRank - rightRank || trip.places[left].region.localeCompare(trip.places[right].region) || trip.places[left].title.localeCompare(trip.places[right].title);
    });

    const totalPlaces = sortedPlaceIds.length;
    const malmoCount = sortedPlaceIds.filter((id) => trip.places[id].region === "Malmö").length;
    const cphCount = sortedPlaceIds.filter((id) => trip.places[id].region === "Copenhagen").length;
    const parisCount = sortedPlaceIds.filter((id) => /Paris/.test(trip.places[id].region)).length;
    const scheduledCount = sortedPlaceIds.filter((id) => Object.values(trip.days || {}).some((d) => d.places.includes(id))).length;

    const cards = sortedPlaceIds.map((id) => placeCard(id, false)).join("");

    layout(`
      <section class="places-top-dashboard">
        <div class="places-top-bar">
          <div class="places-title-group">
            <span class="eyebrow">ECCV 2026 · PLACE DIRECTORY</span>
            <h1>景點快速查找</h1>
            <p>搜尋地名，展開看介紹；按地圖圖示直接導航。</p>
          </div>
          <span class="result-count" data-place-count>共 ${totalPlaces} 個地點</span>
        </div>

        <div class="places-search-toolbar">
          <div class="places-search-box">
            <span class="places-search-icon" aria-hidden="true">⌕</span>
            <input type="search" class="places-search-input" placeholder="搜尋景點名稱、英文、城市、關鍵字..." data-place-search aria-label="搜尋景點" />
            <button type="button" class="places-search-clear" data-place-search-clear aria-label="清空搜尋" hidden>✕</button>
          </div>
          <div class="places-view-switch" role="group" aria-label="檢視模式切換">
            <button type="button" class="places-view-btn" data-place-view="detailed" title="圖文卡片">
              <span aria-hidden="true">🗂️</span> 圖文卡片
            </button>
            <button type="button" class="places-view-btn" data-place-view="compact" title="精簡清單">
              <span aria-hidden="true">☰</span> 精簡清單
            </button>
          </div>
        </div>

        <div class="places-filter-toolbar" role="group" aria-label="依地點與國家篩選景點">
          <button class="places-filter-pill is-active" type="button" data-place-filter="all">全部 (${totalPlaces})</button>
          <button class="places-filter-pill" type="button" data-place-filter="malmo">瑞典 · Malmö (${malmoCount})</button>
          <button class="places-filter-pill" type="button" data-place-filter="copenhagen">丹麥 · 哥本哈根 (${cphCount})</button>
          <button class="places-filter-pill" type="button" data-place-filter="paris">法國 · 巴黎 (${parisCount})</button>
          <button class="places-filter-pill" type="button" data-place-filter="scheduled">已排入行程 (${scheduledCount})</button>
          <button class="places-filter-pill" type="button" data-place-filter="unscheduled">未排入備選 (${totalPlaces - scheduledCount})</button>
        </div>
      </section>

      <section class="place-browser" id="all-places">
        <div class="place-grid">${cards}</div>
        <div class="places-empty-state" data-places-empty hidden>
          <span class="places-empty-icon" aria-hidden="true">🧭</span>
          <strong>找不到符合的景點</strong>
          <p>請嘗試不同關鍵字，或重設篩選條件。</p>
          <button type="button" class="places-filter-pill" data-places-reset-btn>重設所有條件</button>
        </div>
      </section>
    `);

    const browserSection = document.getElementById("all-places");
    const searchInput = document.querySelector("[data-place-search]");
    const searchClear = document.querySelector("[data-place-search-clear]");
    const countLabel = document.querySelector("[data-place-count]");
    const emptyState = document.querySelector("[data-places-empty]");
    const viewButtons = document.querySelectorAll("[data-place-view]");

    const savedState = core.readViewState('places');
    let activeFilter = ['all', 'malmo', 'copenhagen', 'paris', 'scheduled', 'unscheduled'].includes(savedState.filter) ? savedState.filter : 'all';
    let activeQuery = typeof savedState.query === 'string' ? savedState.query : '';
    if (searchInput) searchInput.value = activeQuery;

    let savedView;
    try { savedView = localStorage.getItem('eccv-places-view'); } catch (_) {}
    let currentView = ['compact', 'detailed'].includes(savedView) ? savedView : (window.innerWidth <= 768 ? 'compact' : 'detailed');

    const setViewMode = (mode) => {
      currentView = mode;
      try {
        localStorage.setItem("eccv-places-view", mode);
      } catch (_) {}
      if (browserSection) {
        browserSection.classList.toggle("is-compact-mode", mode === "compact");
      }
      viewButtons.forEach((btn) => {
        btn.classList.toggle("is-active", btn.dataset.placeView === mode);
        btn.setAttribute('aria-pressed', String(btn.dataset.placeView === mode));
      });
    };

    setViewMode(currentView);

    viewButtons.forEach((btn) => {
      btn.addEventListener("click", () => setViewMode(btn.dataset.placeView));
    });

    const applyCombinedFilters = () => {
      core.saveViewState('places', { filter: activeFilter, query: activeQuery });
      document.querySelectorAll('[data-place-filter]').forEach(button => {
        button.classList.toggle('is-active', button.dataset.placeFilter === activeFilter);
        button.setAttribute('aria-pressed', String(button.dataset.placeFilter === activeFilter));
      });
      const q = activeQuery.trim().toLowerCase();
      let visible = 0;

      document.querySelectorAll(".place-card").forEach((card) => {
        const id = card.id.replace("place-", "");
        const place = trip.places[id];
        if (!place) return;

        const isScheduled = Object.values(trip.days || {}).some((d) => d.places.includes(id));
        let categoryMatch = false;
        if (activeFilter === "all") categoryMatch = true;
        else if (activeFilter === "malmo") categoryMatch = place.region === "Malmö";
        else if (activeFilter === "copenhagen") categoryMatch = place.region === "Copenhagen";
        else if (activeFilter === "paris") categoryMatch = /Paris/.test(place.region);
        else if (activeFilter === "scheduled") categoryMatch = isScheduled;
        else if (activeFilter === "unscheduled") categoryMatch = !isScheduled;

        let queryMatch = true;
        if (q) {
          const details = trip.placeDetails?.[id] || {};
          const textToSearch = [
            place.title,
            place.local,
            place.region,
            place.kicker,
            place.intro,
            details.why,
            details.booking?.label,
            details.booking?.note
          ].filter(Boolean).join(" ").toLowerCase();

          queryMatch = textToSearch.includes(q);
        }

        const show = categoryMatch && queryMatch;
        card.hidden = !show;
        if (show) visible += 1;
      });

      if (countLabel) {
        if (activeFilter === "all" && !q) {
          countLabel.textContent = `共 ${totalPlaces} 個地點`;
        } else {
          countLabel.textContent = `顯示 ${visible} / ${totalPlaces} 個地點`;
        }
      }

      if (emptyState) {
        emptyState.hidden = visible > 0;
      }
      if (searchClear) {
        searchClear.hidden = !q;
      }
    };

    document.querySelectorAll("[data-place-filter]").forEach((button) => {
      button.addEventListener("click", () => {
        activeFilter = button.dataset.placeFilter;
        document.querySelectorAll("[data-place-filter]").forEach((btn) => {
          btn.classList.toggle("is-active", btn === button);
        });
        applyCombinedFilters();
      });
    });

    if (searchInput) {
      searchInput.addEventListener("input", () => {
        activeQuery = searchInput.value;
        applyCombinedFilters();
      });
    }

    if (searchClear) {
      searchClear.addEventListener("click", () => {
        if (searchInput) searchInput.value = "";
        activeQuery = "";
        applyCombinedFilters();
        if (searchInput) searchInput.focus();
      });
    }

    const resetBtn = document.querySelector("[data-places-reset-btn]");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        activeFilter = "all";
        activeQuery = "";
        if (searchInput) searchInput.value = "";
        document.querySelectorAll("[data-place-filter]").forEach((btn) => {
          btn.classList.toggle("is-active", btn.dataset.placeFilter === "all");
        });
        applyCombinedFilters();
      });
    }

    // Toggle card expansion in compact mode
    document.querySelectorAll(".place-card").forEach((card) => {
      const toggleHeader = card.querySelector(".place-compact-row");
      if (toggleHeader) {
        toggleHeader.addEventListener("click", (e) => {
          if (e.target.closest(".place-compact-map-btn")) return;
          if (!browserSection?.classList.contains("is-compact-mode")) return;
          const expanded = card.classList.toggle("is-expanded");
          const button = card.querySelector('.place-compact-expand-btn');
          button.setAttribute('aria-expanded', String(expanded));
          button.setAttribute('aria-label', `${expanded ? '收合' : '展開'} ${trip.places[card.id.replace('place-', '')]?.local || ''}`);
        });
      }
    });
    applyCombinedFilters();
    const revealPlace = () => {
      if (!location.hash.startsWith('#place-')) return;
      const target = document.getElementById(location.hash.slice(1));
      if (target?.classList.contains('place-card')) {
        activeFilter = 'all'; activeQuery = ''; searchInput.value = ''; applyCombinedFilters();
        target.classList.add('is-expanded'); target.querySelector('.place-compact-expand-btn')?.setAttribute('aria-expanded', 'true');
      }
    };
    window.addEventListener('hashchange', revealPlace);
    revealPlace();
  }

  window.ECCV_PAGES = window.ECCV_PAGES || {};
  window.ECCV_PAGES.places = {
    render: renderPlaces,
    card: placeCard
  };
})();
