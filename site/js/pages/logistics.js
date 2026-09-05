(function () {
  "use strict";

  function getCore() {
    return window.ECCV_CORE;
  }

  function renderLogistics() {
    const trip = window.TRIP || {};
    const core = getCore();
    const esc = core.esc;
    const layout = core.layout;
    const sectionHeading = core.sectionHeading;

    const flightRows = (trip.flights || []).map((flight, index) => {
      const passengers = Array.isArray(flight.passengers) ? flight.passengers : [];
      const hasSeat = flight.seat && flight.seat !== "未列於行程單" && flight.seat !== "未分配";
      const seat = passengers.length ? `${passengers.length} 位旅客` : hasSeat ? flight.seat : "待確認";
      const seatNote = passengers.length ? "座位已分列如下" : hasSeat ? "以登機證為準" : "報到時確認";
      const passengerManifest = passengers.length ? `<section class="passenger-manifest" aria-label="FR9267 同行旅客座位與行李"><div class="passenger-manifest-heading"><div><span class="eyebrow">PASSENGER MANIFEST</span><h4>同行旅客、座位與行李</h4></div><strong>${passengers.length} 位</strong></div><div class="passenger-grid">${passengers.map((passenger) => `<article class="passenger-card"><strong class="passenger-name">${esc(passenger.name)}</strong><div class="passenger-card-bottom"><span class="passenger-seat">${esc(passenger.seat)}</span><small class="passenger-bag">${esc(passenger.bag)}</small></div></article>`).join("")}</div></section>` : "";
      return `<article class="flight-card"><div class="flight-card-top"><div><span class="date-chip">${esc(flight.date)}</span><small>第 ${index + 1} 段</small></div><div class="flight-code"><strong>${esc(flight.code)}</strong><small>${esc(flight.aircraft)}</small></div></div><h3 class="flight-route">${esc(flight.route)}</h3><div class="flight-detail-grid"><div class="flight-seat"><span>座位</span><strong>${esc(seat)}</strong><small>${esc(seatNote)}</small></div><div class="flight-time"><span>航點當地時間</span><small>${esc(flight.localTimeZones)}</small><strong>${esc(flight.localTime)}</strong></div><div class="flight-time flight-time-taiwan"><span>換算台灣時間</span><small>同一航班</small><strong>${esc(flight.taiwanTime)}</strong></div></div>${passengerManifest}<div class="flight-card-bottom"><span>${esc(flight.note)}</span><strong>${esc(flight.duration)}</strong></div></article>`;
    }).join("");

    const stayRows = (trip.stays || []).map((stay) => `<article class="stay-card"><div class="stay-card-top"><span class="eyebrow">${esc(stay.city)} · ${esc(stay.date)}</span><span aria-hidden="true">⌂</span></div><h3>${esc(stay.name)}</h3><p>${esc(stay.address)}</p><small>${esc(stay.note)}</small></article>`).join("");
    const appCards = (trip.transportApps || []).map((app) => `<article class="app-card"><span class="app-badge">${esc(app.name.slice(0, 1))}</span><div><span class="eyebrow">${esc(app.region)}</span><h3>${esc(app.name)}</h3><p>${esc(app.text)}</p></div></article>`).join("");
    const timeZoneCards = (trip.timeZones || []).map((zone) => `<article class="time-zone-card"><div><span>${esc(zone.label)}</span><strong>${esc(zone.offset)}</strong></div><h3>${esc(zone.cities)}</h3><p>${esc(zone.code)} · ${esc(zone.note)}</p></article>`).join("");
    const ticketCards = (trip.tickets || []).map((t) => `
      <article class="ticket-card" id="ticket-${esc(t.id)}">
        <div class="ticket-card-top">
          <div class="ticket-card-title-group">
            <span class="eyebrow">${esc(t.dateLabel)}</span>
            <h3>${esc(t.title)}</h3>
            <small>${esc(t.subtitle)}</small>
          </div>
          <span class="ticket-badge">${esc(t.badge)}</span>
        </div>
        ${t.qrHint ? `<div class="ticket-hint-text"><span aria-hidden="true">💡</span> ${esc(t.qrHint)}</div>` : ""}
        <dl class="ticket-card-details">
          ${(t.details || []).map((d) => `<div><dt>${esc(d.label)}</dt><dd>${esc(d.value)}</dd></div>`).join("")}
        </dl>
        <div class="ticket-card-actions">
          <button type="button" class="button button-primary ticket-unlock-btn" data-ticket-action="open" data-ticket-id="${esc(t.id)}">
            <span aria-hidden="true">🎫</span> 出示票券 QR
          </button>
        </div>
      </article>
    `).join("");

    const registration = trip.registration || {};
    const registrationPanel = `
      <section class="registration-panel" id="registration" data-logistics-section="registration">
        <div class="registration-panel-copy">
          <span class="eyebrow light">ECCV 2026 REGISTRATION</span>
          <h2>註冊已確認 · 現場領 Badge</h2>
          <p>My Stuff 頁面已顯示付款完成，帳號已連結 Author Registration 與 Poster 發表。</p>
          <div class="registration-status">
            <span class="registration-status-mark" aria-hidden="true">✓</span>
            <div>
              <span class="eyebrow">STATUS</span>
              <strong>${esc(registration.status)}</strong>
              <small>${esc(registration.type)}</small>
            </div>
          </div>
        </div>
        <div class="registration-panel-details">
          <dl class="registration-facts">
            <div><dt>會議地點</dt><dd>${esc(registration.location)}</dd></div>
            <div><dt>Full Passport</dt><dd>${esc(registration.conferenceDates)}</dd></div>
            <div><dt>進場票證</dt><dd>${esc(registration.badge)}</dd></div>
            <div><dt>作者發表</dt><dd>${esc(registration.presentation)}</dd></div>
          </dl>
          <p class="registration-note">${esc(registration.mainConference)}</p>
        </div>
      </section>`;
    const em = trip.emergency || {};
    const emergencyCards = (em.localServices || []).map((country) => `
      <article class="emergency-country-card">
        <div class="emergency-country-header">
          <span class="emergency-flag" aria-hidden="true">${esc(country.flag)}</span>
          <h3>${esc(country.country)}</h3>
        </div>
        <ul class="emergency-phone-list">
          ${(country.items || []).map((item) => `
            <li>
              <div class="emergency-service-info">
                <strong>${esc(item.name)}</strong>
                <small>${esc(item.note)}</small>
              </div>
              <a class="emergency-call-btn" href="tel:${esc(item.phone.replace(/[^0-9+]/g, ''))}">
                <span aria-hidden="true">📞</span> ${esc(item.phone)}
              </a>
            </li>
          `).join("")}
        </ul>
      </article>
    `).join("");

    const diplomaticCards = (em.diplomatic || []).map((dip) => `
      <article class="diplomatic-card">
        <div class="diplomatic-card-top">
          <span class="emergency-flag" aria-hidden="true">${esc(dip.flag)}</span>
          <div>
            <h3>${esc(dip.mission)}</h3>
            <span class="eyebrow">${esc(dip.city)}</span>
          </div>
        </div>
        <p class="diplomatic-address">${esc(dip.address)}${dip.metro ? ` · ${esc(dip.metro)}` : ""}</p>
        <div class="diplomatic-actions">
          <a class="button button-primary diplomatic-tel-btn" href="tel:${esc(dip.emergencyTel.replace(/[^0-9+]/g, ''))}">
            <span aria-hidden="true">🚨</span> 24H 急難：${esc(dip.emergencyTel)}
          </a>
          <a class="button button-outline diplomatic-sub-btn" href="tel:${esc(dip.tel.replace(/[^0-9+]/g, ''))}">
            總機 ${esc(dip.tel)}
          </a>
        </div>
        <small class="diplomatic-note">${esc(dip.note)}</small>
      </article>
    `).join("");

    const sopCards = (em.passportLossSop || []).map((sop) => `
      <li class="sop-step-item">
        <span class="sop-step-num">${esc(sop.step)}</span>
        <div>
          <strong>${esc(sop.title)}</strong>
          <p>${esc(sop.desc)}</p>
        </div>
      </li>
    `).join("");

    const financialCards = (em.financial || []).map((fin) => `
      <article class="financial-card">
        <div class="financial-card-top">
          <span class="emergency-flag" aria-hidden="true">${esc(fin.flag)}</span>
          <div>
            <h3>${esc(fin.bank)}</h3>
            <span class="eyebrow">${esc(fin.role)}</span>
          </div>
        </div>
        <ul class="financial-hotline-list">
          ${(fin.hotlines || []).map((h) => `
            <li>
              <div class="financial-hotline-info">
                <strong>${esc(h.label)}</strong>
                <small>${esc(h.desc)}</small>
              </div>
              <a class="emergency-call-btn" href="tel:${esc(h.tel.replace(/[^0-9+]/g, ''))}">
                <span aria-hidden="true">📞</span> ${esc(h.tel)}
              </a>
            </li>
          `).join("")}
        </ul>
        <p class="financial-tips">${esc(fin.tips)}</p>
      </article>
    `).join("");

    const emergencySection = `
      <section class="logistics-block emergency-section" id="emergency" data-logistics-section="emergency">
        <div class="section-heading-row">${sectionHeading("EMERGENCY & DIPLOMATIC", "歐洲急難救助與駐外代表處", "遇竊、遺失護照或重大急症時可立即離線取用；點擊電話可直接撥出。")}</div>
        <div class="universal-112-banner">
          <div class="universal-112-copy">
            <span class="eyebrow light">UNIVERSAL EMERGENCY NUMBER</span>
            <h2>${esc(em.universal?.label || "歐盟通用緊急專線 112")}</h2>
            <p>${esc(em.universal?.desc || "")}</p>
          </div>
          <a class="universal-112-btn" href="tel:112" aria-label="撥打 112">
            <span aria-hidden="true">🚨</span> 一鍵撥打 112
          </a>
        </div>
        <div class="emergency-country-grid">
          ${emergencyCards}
        </div>
        <div class="diplomatic-block">
          <div class="diplomatic-heading">
            <span class="eyebrow">TAIWAN MISSIONS IN EUROPE</span>
            <h3>駐外代表處 24 小時急難專線</h3>
          </div>
          <div class="diplomatic-grid">
            ${diplomaticCards}
          </div>
        </div>
        <div class="financial-block">
          <div class="diplomatic-heading">
            <span class="eyebrow">CREDIT CARD & BANK HOTLINES</span>
            <h3>信用卡客服與額度緊急救援（國泰世華）</h3>
          </div>
          <div class="financial-grid">
            ${financialCards}
          </div>
        </div>
        <div class="sop-card">
          <div class="sop-card-header">
            <span class="eyebrow">LOST PASSPORT PROTOCOL</span>
            <h3>護照遺失與重要證件備援 SOP</h3>
            <p>托運行李箱內已打包備援「2 吋照片 2 張、身分證影本、護照影本」，遇緊急狀況依下列順序處理：</p>
          </div>
          <ol class="sop-step-list">
            ${sopCards}
          </ol>
        </div>
      </section>`;

    layout(`
      <section class="logistics-nav-bar content-section">
        <div class="logistics-nav-header">
          <div class="logistics-title-group">
            <span class="eyebrow">TRAVEL LOGISTICS</span>
            <h1>交通與旅程資訊</h1>
          </div>
          <div class="logistics-summary-chips" aria-label="重點摘要">
            <span class="logistics-chip is-confirmed">🎫 ${(trip.tickets || []).length} 張票券憑證</span>
            <span class="logistics-chip is-confirmed">🚨 急難專線</span>
            <span class="logistics-chip">✈ 5 段航班</span>
            <span class="logistics-chip">⌂ 3 處住宿</span>
            <span class="logistics-chip is-confirmed">✓ ECCV Paid</span>
          </div>
        </div>
        <div class="logistics-tabs-scroll" role="tablist" aria-label="分類切換">
          <button class="logistics-tab is-active" type="button" data-logistics-filter="all">全部</button>
          <button class="logistics-tab" type="button" data-logistics-filter="tickets">🎫 票券憑證 (${(trip.tickets || []).length})</button>
          <button class="logistics-tab" type="button" data-logistics-filter="emergency">🚨 急難救助 (3國)</button>
          <button class="logistics-tab" type="button" data-logistics-filter="flights">✈ 航班 (5)</button>
          <button class="logistics-tab" type="button" data-logistics-filter="stays">⌂ 住宿 (3)</button>
          <button class="logistics-tab" type="button" data-logistics-filter="registration">✓ ECCV 註冊</button>
          <button class="logistics-tab" type="button" data-logistics-filter="apps">📱 交通 App (3)</button>
          <button class="logistics-tab" type="button" data-logistics-filter="timezones">🕒 時區對照</button>
        </div>
      </section>

      <div class="logistics-page">
        <section class="logistics-block tickets-section" id="tickets" data-logistics-section="tickets">
          <div class="section-heading-row">${sectionHeading("TICKETS & PASSES", "票券與入場憑證", "包含航班登機證、景點預約、運河遊船與博物館通行證；點擊即可快速出示。")}</div>
          <div class="ticket-card-grid">${ticketCards}</div>
        </section>
        ${registrationPanel}
        ${emergencySection}
        <section class="logistics-block" id="flights" data-logistics-section="flights">
          <div class="section-heading-row">${sectionHeading("FLIGHT BOARD", "航班時間軸", "每一段都列出座位、航點當地時間與台灣時間。")}</div>
          <div class="flight-list">${flightRows}</div>
        </section>
        <section class="logistics-block" id="timezones" data-logistics-section="timezones">
          <div class="section-heading-row">${sectionHeading("TIME KEY", "時區對照", "杜拜為 GST（UTC+4）；北歐與法國為 CEST（UTC+2）。")}</div>
          <div class="time-zone-panel">
            <div class="time-zone-panel-copy"><span class="eyebrow light">TIME KEY</span><h2>三個時區，清楚對照</h2><p>手機抵達當地自動切換時間，此處供跨國聯絡與班次對照。</p></div>
            <div class="time-zone-grid">${timeZoneCards}</div>
          </div>
        </section>
        <section class="logistics-block" id="stays" data-logistics-section="stays">
          <div class="section-heading-row">${sectionHeading("STAY NOTES", "三段住宿", "地址、日期與每一段最重要的交通提醒。")}</div>
          <div class="stay-grid">${stayRows}</div>
        </section>
        <section class="logistics-block" id="apps" data-logistics-section="apps">
          <div class="section-heading-row">${sectionHeading("THE THREE APPS", "旅途三個關鍵 App", "瑞典／丹麥、法國城際與巴黎市區各一個。")}</div>
          <div class="app-grid">${appCards}</div>
        </section>
        <section class="reminder-panel" data-logistics-section="reminders">
          <div><span class="eyebrow light">BEFORE YOU GO</span><h2>出發前，再確認一次。</h2></div>
          <ul>
            <li>9/11 Malmö 到 Copenhagen 跨海列車可能受工程影響。</li>
            <li>9/12 先在 København H 寄存行李，再輕裝看景點。</li>
            <li>9/18 去 CDG 要使用機場專用票。</li>
            <li>所有航班、營業時間與入口以官方最新資訊為準。</li>
          </ul>
        </section>
      </div>
    `);

    setupLogistics();
  }

  function setupLogistics() {
    const tabs = document.querySelectorAll("[data-logistics-filter]");
    const sections = document.querySelectorAll("[data-logistics-section]");
    if (!tabs.length) return;

    const applyFilter = (filterKey) => {
      tabs.forEach((tab) => tab.classList.toggle("is-active", tab.dataset.logisticsFilter === filterKey));
      if (filterKey === "all") {
        sections.forEach((sec) => (sec.hidden = false));
      } else {
        sections.forEach((sec) => {
          sec.hidden = sec.dataset.logisticsSection !== filterKey && (filterKey !== "apps" || sec.dataset.logisticsSection !== "reminders");
        });
      }
    };

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        applyFilter(tab.dataset.logisticsFilter);
      });
    });

    if (window.location.hash) {
      const hash = window.location.hash.replace("#", "");
      if (["flights", "stays", "registration", "apps", "timezones", "tickets", "emergency"].includes(hash)) {
        applyFilter(hash);
      }
    }
  }

  window.ECCV_PAGES = window.ECCV_PAGES || {};
  window.ECCV_PAGES.logistics = {
    render: renderLogistics,
    setup: setupLogistics
  };
})();
