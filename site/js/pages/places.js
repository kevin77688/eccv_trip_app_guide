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
    return `
      <article class="place-card ${compact ? "place-card-compact" : ""} accent-${esc(place.accent)}" id="place-${esc(id)}"${compact ? "" : ` data-dates="${esc(dateKeys.join(" "))}"`}>
        ${image}
        <div class="place-card-content"><div class="place-card-meta"><span>${esc(place.region)}</span><strong>${esc(place.stay)}</strong></div>${dateMarkup}${locationMarkup}<span class="place-kicker">${esc(place.kicker)}</span><h3>${esc(place.title)}</h3><p class="place-local">${esc(place.local)}</p><p class="place-intro">${esc(place.intro)}</p>${recommendationMarkup}${bookingMarkup}<div class="place-actions">${ticketButton}<a class="map-button" href="${esc(googleMapsLink(id, place))}" target="_blank" rel="noreferrer"><svg class="btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg><span>Google Maps 導航</span><b aria-hidden="true">↗</b></a></div></div>
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
            <p>依國家與城市快速篩選景點；點擊景點卡片上的日期可前往當日行程，或直接開啟 Google Maps 導航。</p>
          </div>
          <span class="result-count" data-place-count>共 ${totalPlaces} 個地點</span>
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
      </section>
    `);

    const applyPlaceFilter = (filter) => {
      document.querySelectorAll("[data-place-filter]").forEach((button) => button.classList.toggle("is-active", button.dataset.placeFilter === filter));
      document.querySelectorAll(".place-card").forEach((card) => {
        const id = card.id.replace("place-", "");
        const place = trip.places[id];
        if (!place) return;
        const isScheduled = Object.values(trip.days || {}).some((d) => d.places.includes(id));
        let match = false;
        if (filter === "all") match = true;
        else if (filter === "malmo") match = place.region === "Malmö";
        else if (filter === "copenhagen") match = place.region === "Copenhagen";
        else if (filter === "paris") match = /Paris/.test(place.region);
        else if (filter === "scheduled") match = isScheduled;
        else if (filter === "unscheduled") match = !isScheduled;
        card.hidden = !match;
      });
      const visible = document.querySelectorAll(".place-card:not([hidden])").length;
      const countLabel = document.querySelector("[data-place-count]");
      if (countLabel) countLabel.textContent = `顯示 ${visible} 個地點`;
    };

    document.querySelectorAll("[data-place-filter]").forEach((button) => {
      button.addEventListener("click", () => applyPlaceFilter(button.dataset.placeFilter));
    });
  }

  window.ECCV_PAGES = window.ECCV_PAGES || {};
  window.ECCV_PAGES.places = {
    render: renderPlaces,
    card: placeCard
  };
})();
