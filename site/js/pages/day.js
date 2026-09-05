(function () {
  "use strict";

  function getCore() {
    return window.ECCV_CORE;
  }

  function getPlaces() {
    return window.ECCV_PAGES?.places || {};
  }

  const routeModeMeta = {
    walk: { label: "步行", color: "#d85d43", dash: "6 7" },
    bus: { label: "公車", color: "#b47b16", dash: "4 7" },
    metro: { label: "Metro", color: "#705c78", dash: "2 7" },
    train: { label: "火車／RER", color: "#176f65", dash: "" },
    transit: { label: "大眾運輸", color: "#176f65", dash: "7 6" },
    taxi: { label: "Taxi", color: "#a84978", dash: "3 7" },
    boat: { label: "船", color: "#237ba0", dash: "" },
    flight: { label: "飛行", color: "#6556c2", dash: "10 8" }
  };

  const routeStatusLabels = {
    fixed: "硬時間",
    ticket: "需購票",
    optional: "彈性選項",
    transfer: "轉乘",
    stay: "住宿",
    start: "起點",
    planned: "主行程"
  };

  function routeGoogleMapsUrl(group) {
    const allStops = (group?.stops || []).filter((stop) => Number.isFinite(stop.lat) && Number.isFinite(stop.lng));
    const legs = group?.legs || [];
    let stops = allStops;

    if (legs.some((leg) => leg.mode === "flight")) {
      const groundRuns = [];
      let runStart = null;
      legs.forEach((leg, index) => {
        if (leg.mode !== "flight" && runStart === null) runStart = index;
        const runEndsHere = leg.mode === "flight" || index === legs.length - 1;
        if (runStart !== null && runEndsHere) {
          const runEnd = leg.mode === "flight" ? index - 1 : index;
          groundRuns.push(allStops.slice(runStart, runEnd + 2));
          runStart = null;
        }
      });
      stops = groundRuns.sort((left, right) => right.length - left.length)[0] || allStops.slice(-1);
    }

    if (!stops.length) return "https://www.google.com/maps";
    if (stops.length === 1) return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${stops[0].lat},${stops[0].lng}`)}`;

    const first = stops[0];
    const last = stops[stops.length - 1];
    const middle = stops.slice(1, -1).map((stop) => `${stop.lat},${stop.lng}`).join("|");
    const params = new URLSearchParams({
      api: "1",
      origin: `${first.lat},${first.lng}`,
      destination: `${last.lat},${last.lng}`
    });
    if (middle) params.set("waypoints", middle);
    return `https://www.google.com/maps/dir/?${params.toString()}`;
  }

  function routeStopListMarkup(group) {
    const core = getCore();
    const esc = core.esc;
    const bilingualText = core.bilingualText;
    return (group?.stops || []).map((stop, index) => {
      const status = routeStatusLabels[stop.status] || "站點";
      return `<li><span class="route-map-stop-number route-map-stop-${esc(stop.status || "planned")}">${index + 1}</span><div><small>${esc(stop.time)} · ${esc(status)}</small><strong>${esc(bilingualText(stop.label))}</strong>${stop.detail ? `<p>${esc(bilingualText(stop.detail))}</p>` : ""}</div></li>`;
    }).join("");
  }

  function routeLegendMarkup(group) {
    const core = getCore();
    const esc = core.esc;
    const modes = [...new Set((group?.legs || []).map((leg) => leg.mode || "walk"))];
    return modes.map((mode) => {
      const meta = routeModeMeta[mode] || routeModeMeta.walk;
      return `<span><i style="--route-mode:${esc(meta.color)};--route-dash:${meta.dash ? "1" : "0"}"></i>${esc(meta.label)}</span>`;
    }).join("");
  }

  function routeMapMarkup(key) {
    const trip = window.TRIP || {};
    const core = getCore();
    const esc = core.esc;
    const bilingualText = core.bilingualText;
    const sectionHeading = core.sectionHeading;

    const route = trip.routeMaps?.[key];
    if (!route?.groups?.length) return "";
    const initial = route.groups.find((group) => group.id === route.defaultGroup) || route.groups[0];
    const tabs = route.groups.length > 1
      ? `<div class="route-map-tabs" role="tablist" aria-label="切換今日路線">${route.groups.map((group) => `<button type="button" role="tab" aria-selected="${group.id === initial.id ? "true" : "false"}" class="${group.id === initial.id ? "is-active" : ""}" data-route-group="${esc(group.id)}">${esc(bilingualText(group.label))}</button>`).join("")}</div>`
      : `<span class="route-map-single-label">${esc(bilingualText(initial.label))}</span>`;

    return `<section class="day-section route-map-section" data-route-map-section data-route-key="${esc(key)}">
      <div class="section-heading-row"><div>${sectionHeading("ORDERED MAP", "今天按順序怎麼走？", "編號依時間軸由第一站排到最後一站；不同顏色表示交通方式。")}</div>${tabs}</div>
      <div class="route-map-card">
        <div class="route-map-canvas" data-route-map aria-label="${esc(bilingualText(initial.label))}互動路線地圖"><div class="route-map-loading"><span aria-hidden="true">⌖</span><strong>正在載入路線底圖</strong><small>離線時仍可看右側站點順序</small></div></div>
        <aside class="route-map-panel">
          <div class="route-map-panel-heading"><span class="eyebrow">FIRST → LAST</span><strong data-route-group-title>${esc(bilingualText(initial.label))}</strong></div>
          <ol class="route-map-stops" data-route-stop-list>${routeStopListMarkup(initial)}</ol>
          <div class="route-map-meta">
            <div class="route-map-legend" data-route-legend>${routeLegendMarkup(initial)}</div>
            <p data-route-note>${esc(bilingualText(initial.note))}</p>
            <a class="button button-primary route-map-google" data-route-google href="${esc(routeGoogleMapsUrl(initial))}" target="_blank" rel="noreferrer">Google Maps 開啟多站路線 <span aria-hidden="true">↗</span></a>
          </div>
        </aside>
      </div>
      <p class="route-map-disclaimer">地圖線表示造訪順序與交通類型，不是即時道路／軌道幾何；月台、施工、路況與臨時改道請以當下導航為準。OpenStreetMap 底圖需網路，站點清單可離線閱讀。</p>
    </section>`;
  }

  function setupRouteMap(key) {
    const trip = window.TRIP || {};
    const core = getCore();
    const esc = core.esc;
    const bilingualText = core.bilingualText;
    const loadLeaflet = core.loadLeaflet;

    const section = document.querySelector("[data-route-map-section]");
    const route = trip.routeMaps?.[key];
    if (!section || !route?.groups?.length) return;

    const canvas = section.querySelector("[data-route-map]");
    const stopList = section.querySelector("[data-route-stop-list]");
    const groupTitle = section.querySelector("[data-route-group-title]");
    const note = section.querySelector("[data-route-note]");
    const legend = section.querySelector("[data-route-legend]");
    const googleLink = section.querySelector("[data-route-google]");
    const buttons = [...section.querySelectorAll("[data-route-group]")];
    let map = null;
    let mapLayer = null;
    let userLocationLayer = null;
    let currentActiveGroup = null;

    function groupById(id) {
      return route.groups.find((group) => group.id === id) || route.groups[0];
    }

    function updateText(group) {
      if (stopList) stopList.innerHTML = routeStopListMarkup(group);
      if (groupTitle) groupTitle.textContent = bilingualText(group.label);
      if (note) note.textContent = bilingualText(group.note);
      if (legend) legend.innerHTML = routeLegendMarkup(group);
      if (googleLink) googleLink.href = routeGoogleMapsUrl(group);
      if (canvas) canvas.setAttribute("aria-label", `${bilingualText(group.label)}互動路線地圖`);
      buttons.forEach((button) => {
        const active = button.dataset.routeGroup === group.id;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-selected", String(active));
      });
    }

    function fitRouteBounds(targetGroup) {
      if (!map || !window.L) return;
      const group = targetGroup || currentActiveGroup || initial;
      const points = (group?.stops || [])
        .filter((stop) => Number.isFinite(stop.lat) && Number.isFinite(stop.lng))
        .map((stop) => [stop.lat, stop.lng]);
      if (points.length === 1) map.setView(points[0], 14);
      if (points.length > 1) map.fitBounds(window.L.latLngBounds(points), { padding: [34, 34], maxZoom: 14 });
    }

    function drawGroup(group) {
      currentActiveGroup = group;
      updateText(group);
      if (!map || !mapLayer || !window.L) return;
      mapLayer.clearLayers();

      const points = [];
      group.stops.forEach((stop, index) => {
        if (!Number.isFinite(stop.lat) || !Number.isFinite(stop.lng)) return;
        const point = [stop.lat, stop.lng];
        points.push(point);
        const markerIcon = window.L.divIcon({
          className: "route-leaflet-marker-shell",
          html: `<span class="route-leaflet-marker route-leaflet-${esc(stop.status || "planned")}">${index + 1}</span>`,
          iconSize: [34, 34],
          iconAnchor: [17, 17],
          popupAnchor: [0, -17]
        });
        window.L.marker(point, { icon: markerIcon, keyboard: true })
          .bindPopup(`<div class="route-map-popup"><small>${esc(stop.time)}</small><strong>${esc(bilingualText(stop.label))}</strong>${stop.detail ? `<span>${esc(bilingualText(stop.detail))}</span>` : ""}</div>`)
          .addTo(mapLayer);
      });

      (group.legs || []).forEach((leg, index) => {
        const from = group.stops[index];
        const to = group.stops[index + 1];
        if (!from || !to) return;
        const meta = routeModeMeta[leg.mode] || routeModeMeta.walk;
        const path = Array.isArray(leg.path) && leg.path.length > 1 ? leg.path : [[from.lat, from.lng], [to.lat, to.lng]];
        const line = window.L.polyline(path, {
          color: meta.color,
          weight: leg.mode === "flight" ? 3 : 4,
          opacity: .88,
          dashArray: meta.dash || undefined,
          lineCap: "round",
          lineJoin: "round"
        }).addTo(mapLayer);
        if (leg.label) line.bindTooltip(esc(bilingualText(leg.label)), { sticky: true, direction: "top", opacity: .95 });
      });

      fitRouteBounds(group);
      window.setTimeout(() => map.invalidateSize(), 60);
    }

    const initial = groupById(route.defaultGroup);
    currentActiveGroup = initial;
    updateText(initial);
    buttons.forEach((button) => button.addEventListener("click", () => drawGroup(groupById(button.dataset.routeGroup))));

    if (loadLeaflet) {
      loadLeaflet().then((L) => {
        canvas.innerHTML = "";
        map = L.map(canvas, { scrollWheelZoom: false, zoomControl: true, attributionControl: true });
        mapLayer = L.layerGroup().addTo(map);
        userLocationLayer = L.layerGroup().addTo(map);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution: "&copy; OpenStreetMap contributors"
        }).addTo(map);
        drawGroup(initial);

        let currentUserLatLng = null;
        let statusPill = null;
        let pillTimer = null;

        function showStatusPill(message, actionLabel, actionCallback) {
          if (pillTimer) {
            window.clearTimeout(pillTimer);
            pillTimer = null;
          }
          if (!statusPill) {
            statusPill = document.createElement("div");
            statusPill.className = "route-map-status-pill";
            canvas.appendChild(statusPill);
          }
          statusPill.innerHTML = `<span>${esc(message)}</span>${actionLabel ? `<button type="button">${esc(actionLabel)}</button>` : ""}`;
          if (actionLabel && actionCallback) {
            const pillBtn = statusPill.querySelector("button");
            pillBtn?.addEventListener("click", (e) => {
              e.stopPropagation();
              actionCallback();
            });
          }
          if (!actionLabel) {
            pillTimer = window.setTimeout(() => {
              statusPill?.remove();
              statusPill = null;
            }, 4500);
          }
        }

        const locateControl = L.control({ position: "topright" });
        locateControl.onAdd = function () {
          const btn = L.DomUtil.create("button", "route-map-locate-btn");
          btn.type = "button";
          btn.setAttribute("aria-label", "顯示我的即時 GPS 位置");
          btn.title = "顯示我的即時 GPS 位置";
          btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="3" fill="currentColor"/><line x1="12" y1="1" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="23"/><line x1="1" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="23" y2="12"/></svg>`;
          L.DomEvent.disableClickPropagation(btn);
          L.DomEvent.disableScrollPropagation(btn);

          btn.addEventListener("click", () => {
            if (!navigator.geolocation) {
              showStatusPill("此裝置或瀏覽器不支援 GPS 定位");
              return;
            }

            if (currentUserLatLng && !map.getBounds().contains(currentUserLatLng)) {
              map.flyTo(currentUserLatLng, Math.max(map.getZoom(), 15), { duration: 0.8 });
            }

            btn.classList.add("is-locating");
            navigator.geolocation.getCurrentPosition(
              (pos) => {
                btn.classList.remove("is-locating");
                btn.classList.add("is-active");
                const userLat = pos.coords.latitude;
                const userLng = pos.coords.longitude;
                const accuracy = pos.coords.accuracy || 15;
                currentUserLatLng = [userLat, userLng];

                userLocationLayer.clearLayers();

                const userMarkerIcon = L.divIcon({
                  className: "route-user-marker-shell",
                  html: `<div class="route-user-marker" aria-label="目前 GPS 位置"><span class="route-user-pulse"></span><span class="route-user-dot"></span></div>`,
                  iconSize: [24, 24],
                  iconAnchor: [12, 12],
                  popupAnchor: [0, -12]
                });

                const userMarker = L.marker([userLat, userLng], {
                  icon: userMarkerIcon,
                  keyboard: true,
                  zIndexOffset: 1000
                }).addTo(userLocationLayer);

                L.circle([userLat, userLng], {
                  radius: Math.max(accuracy, 10),
                  color: "#1a73e8",
                  weight: 1,
                  opacity: 0.5,
                  fillColor: "#1a73e8",
                  fillOpacity: 0.12
                }).addTo(userLocationLayer);

                userMarker.bindPopup(`<div class="route-map-popup"><small>GPS 即時位置</small><strong>我的目前所在位置</strong><span>定位精確度約 ±${Math.round(accuracy)} 公尺</span></div>`);

                const group = currentActiveGroup || initial;
                const validStops = (group?.stops || []).filter((s) => Number.isFinite(s.lat) && Number.isFinite(s.lng));
                let minDistanceMeters = Infinity;
                validStops.forEach((s) => {
                  const dist = L.latLng(userLat, userLng).distanceTo(L.latLng(s.lat, s.lng));
                  if (dist < minDistanceMeters) minDistanceMeters = dist;
                });

                map.flyTo([userLat, userLng], Math.max(map.getZoom(), 15), { duration: 1.2 });

                if (minDistanceMeters > 50000 && Number.isFinite(minDistanceMeters)) {
                  const distKm = Math.round(minDistanceMeters / 1000);
                  showStatusPill(`📍 已定位（距離今日行程約 ${distKm.toLocaleString()} 公里）`, "回到今日行程", () => {
                    fitRouteBounds();
                    statusPill?.remove();
                    statusPill = null;
                  });
                } else {
                  showStatusPill(`📍 已取得即時 GPS 定位（精確度 ±${Math.round(accuracy)}m）`);
                }
              },
              (err) => {
                btn.classList.remove("is-locating");
                console.warn("GPS Geolocation error:", err.message);
                showStatusPill("⚠️ 無法取得 GPS 定位：請檢查裝置定位與授權");
              },
              { timeout: 10000, enableHighAccuracy: true, maximumAge: 30000 }
            );
          });

          return btn;
        };
        locateControl.addTo(map);
      }).catch(() => {
        canvas.classList.add("is-unavailable");
        canvas.innerHTML = `<div class="route-map-loading"><span aria-hidden="true">⌖</span><strong>互動底圖暫時無法載入</strong><small>請使用站點順序或 Google Maps 按鈕</small></div>`;
      });
    }
  }

  const schedulePlaceAliases = [
    ["malmohus", /Malmöhus|城堡區|Slottsträdgården/i],
    ["tekniken", /Teknikens/i],
    ["experimentarium", /Experimentarium|屋頂／商店／最喜歡的展項/i],
    ["turning", /Turning Torso|Västra Hamnen/i],
    ["eccv", /Hyllie 會場|badge|Poster|Main Conference|Expo/i],
    ["dac", /DAC|丹麥建築中心|BLOX/i],
    ["rosenborg", /Rosenborg/i],
    ["torvehallerne", /Torvehallerne/i],
    ["roundtower", /Rundetaarn/i],
    ["stroget", /Strøget/i],
    ["christiansborg", /Christiansborg/i],
    ["tivoli", /Tivoli/i],
    ["marmorkirken", /Marmorkirken/i],
    ["amalienborg", /Amalienborg/i],
    ["nyhavn", /Nyhavn/i],
    ["kongensnytorv", /Kongens Nytorv/i],
    ["canal", /Canal Tour|候船/i],
    ["saviour", /Church of Our Saviour/i],
    ["opera", /Palais Garnier|Opéra/i],
    ["sacre", /Sacré-Cœur|Montmartre|Abbesses/i],
    ["latin", /Luxembourg|Panthéon|Latin Quarter|Sorbonne|Saint-Michel/i],
    ["sainte", /Sainte-Chapelle/i],
    ["notre", /Notre-Dame/i],
    ["army", /Musée de l’Armée|Les Invalides|Invalides/i],
    ["bonmarche", /Bon Marché|樂蓬馬歇/i],
    ["rodin", /Musée Rodin/i],
    ["francette", /Francette/i],
    ["eiffel", /Eiffel Tower|Champ de Mars|鐵塔周邊|鐵塔地面/i],
    ["trocadero", /Trocadéro|特羅卡德羅/i],
    ["birhakeim", /Bir-Hakeim|比爾哈凱姆/i],
    ["cygnes", /Cygnes|天鵝島|自由女神/i],
    ["beaugrenelle", /Beaugrenelle|博格內爾|Fnac/i],
    ["ballon", /Ballon|熱氣球|Citroën|雪鐵龍/i],
    ["arc", /Arc de Triomphe|Charles de Gaulle[-–]Étoile/i],
    ["champs", /Champs-Élysées|Place de la Concorde/i],
    ["tuileries", /Tuileries/i],
    ["louvre", /Louvre|Cour Napoléon|玻璃金字塔/i],
    ["versailles", /Versailles|Trianon/i]
  ];

  const scheduleGuideOverrides = [
    [/Malmöhus Castle/, "入口先買 Kombibiljett；13:15 離館去午餐，之後走到科技海事館。"],
    [/Teknikens/, "午餐後步行約 5 分鐘抵達；使用同一張 Kombibiljett，16:35 離館。"],
    [/Slottsträdgården/, "從科技海事館離開後直接走進花園；下雨就跳過，改回 Malmö C。"],
    [/抵達 Experimentarium/, "先寄放外套、補水；10:00 從主展區開始。"],
    [/Experimentarium Part 1/, "先走 The Port，再接 Labyrinth of Light 與 Puzzler；12:15 到 1F 吃午餐。"],
    [/Experimentarium Part 2/, "午餐後往 Under Your Skin、Future Human，再到 Bubblearium；15:20 收尾。"],
    [/Turning Torso/, "17:30 在塔外與朋友會合；不進塔，之後沿海邊走往 Västra Hamnen。"],
    [/Västra Hamnen/, "從 Turning Torso 沿濱水區往南走；19:00 左右就近吃晚餐。"],
    [/Poster Session 1/, "10:15 前到海報區；10:30 準時開始 Poster #137。"],
    [/DAC|丹麥建築中心|BLOX/, "憑 K7 免費入場，先體驗 4 層樓 BLOX Slide 溜滑梯，再看展與露台拍照；11:30 前往宮殿。"],
    [/克里斯蒂安堡宮|Christiansborg Palace/, "步行 5 分鐘過橋；出示 K7 免費參觀金碧輝煌的皇家接待廳與編織壁毯。"],
    [/老城區午餐/, "推薦克里斯蒂安堡對面 Slotskælderen 百年傳統三明治，或圓塔旁 Paludan 圖書館咖啡館。"],
    [/圓塔|Rundetaarn/, "出示 K7 通行證免費入場；走平緩螺旋斜坡登頂俯瞰老城紅瓦屋頂，15:30 前往 Strøget。"],
    [/Strøget/, "沿步行街逛 HAY House、Illums Bolighus、LEGO 旗艦店，一路向西南漫步走向市政廳廣場。"],
    [/市政廳廣場周邊晚餐/, "在廣場周邊用餐或咖啡小歇，儲備夜間體力；18:25 步行過馬路至 Tivoli。"],
    [/趣伏里公園|Tivoli Gardens/, "出示已購門票掃碼入園；欣賞 10 萬盞復古燈景與週五 Fredagsrock 露天音樂派對，21:45 前離園。"],
    [/^Rosenborg Castle$/, "10:15 到入口，依票面時段進場；12:15 離館走往 Torvehallerne。"],
    [/TorvehallerneKBH/, "從 Rosenborg 步行約 5 分鐘；13:30 準時離開往 Rundetaarn。"],
    [/Marmorkirken/, "M3／M4 到 Marmorkirken；11:35 離開，步行去 Amalienborg 站位。"],
    [/Amalienborg Palace/, "11:50 前到八角廣場站位，12:00 看衛兵交接；結束後走往 Nyhavn。"],
    [/Nyhavn ＋ Kongens Nytorv/, "在港區就近找可刷卡的午餐；14:15 離席，14:45 前到 Nyhavn 3。"],
    [/Stromma Classic Canal Tour/, "14:45 前到 Nyhavn 3 驗票排隊；15:00 開船、16:00 下船。"],
    [/Church of Our Saviour$/, "16:30 依時段登塔；最晚 17:15 離開，步行到 Christianshavn 搭 M2。"],
    [/Palais Garnier 自助參觀/, "Rue Scribe 入口報到；依實際票面入場，13:00 離開找午餐。"],
    [/Sacré-Cœur/, "免費入內參觀聖心堂與登階看全景；結束後漫步後山葡萄園，17:30 從 Anvers 搭 M2 回飯店。"],
    [/Jardin du Luxembourg/, "RER B 在 Luxembourg 下車；由公園往 Panthéon 方向單向前進。"],
    [/Latin Quarter：/, "從 Panthéon 經 Sorbonne 往 Saint-Michel；11:15 在拉丁區找午餐。"],
    [/Sainte-Chapelle$/, "14:30 已完成會合與安檢；依 15:00 票面入場，16:05 離開。"],
    [/Notre-Dame de Paris$/, "16:30 左右走官方免費預約通道；無預約就改排現場隊伍。"],
    [/Musée de l’Armée/, "09:45 前到 129 Rue de Grenelle 安檢；12:15 離館吃午餐。"],
    [/Musée Rodin/, "13:10 從 Invalides 步行過來；14:45 離館後往 Eiffel Tower。"],
    [/Eiffel Tower 指定時段/, "15:25 前到票面入口；預留安檢與排隊，17:45 回到地面。"],
    [/Francette 晚餐/, "18:40 前走到 1 Port de Suffren；19:00 已預約 4 位。"],
    [/Arc de Triomphe$/, "依 10:50 票面進場；12:00 離開，沿 Champs-Élysées 向東。"],
    [/Champs-Élysées$/, "沿大道向東單向走；13:00 前到午餐地點，不折返購物。"],
    [/Place de la Concorde/, "由西向東穿過廣場，接著從西側進 Jardin des Tuileries。"],
    [/Jardin des Tuileries/, "沿中央軸線往 Louvre 方向走；15:30 坐下補充體力。"],
    [/Musée du Louvre/, "依 17:00 票面入口進場；20:30 離館後到 Cour Napoléon 看夜景。"],
    [/Palace of Versailles/, "09:55 前到 10:00 指定時段隊伍；12:30 離開主宮先吃午餐。"],
    [/Gardens of Versailles/, "午餐後沿主軸往 Grand Canal；15:30 再前往 Trianon。"],
    [/Grand Trianon/, "花園距離長，累了就搭園區小火車；17:30 開始往車站回程。"]
  ];

  function schedulePlaceId(item, day) {
    const trip = window.TRIP || {};
    const core = getCore();
    const bilingualText = core.bilingualText;
    const title = bilingualText(item.title);
    const direct = (day.places || []).find((id) => {
      const place = trip.places?.[id];
      return place && [place.title, place.local].some((name) => name && title.toLocaleLowerCase().includes(name.toLocaleLowerCase()));
    });
    if (direct) return direct;
    const alias = schedulePlaceAliases.find(([id, pattern]) => (day.places || []).includes(id) && pattern.test(title));
    return alias?.[0] || "";
  }

  function scheduleGuideText(item) {
    const core = getCore();
    const bilingualText = core.bilingualText;
    const override = scheduleGuideOverrides.find(([pattern]) => pattern.test(item.title));
    return bilingualText(override?.[1] || item.detail);
  }

  function scheduleIcon(item) {
    const text = `${item.title} ${item.tag}`;
    if (/早餐|午餐|晚餐|吃|餐廳/.test(text)) return ["🍴", "用餐", "food"];
    if (/Tivoli/.test(text)) return ["🎡", "遊樂園", "sight"];
    if (/Eiffel|鐵塔/.test(text)) return ["🗼", "地標", "sight"];
    if (/花園|Gardens|Tuileries|Slottsträdgården/.test(text)) return ["🌳", "花園", "nature"];
    if (/Taxi|叫車/.test(text)) return ["🚕", "計程車", "transit"];
    if (/Bus|公車/.test(text)) return ["🚌", "公車", "transit"];
    if (/FR\d|EK \d|機場|起飛|飛行|轉機|CPH 取行李/.test(text)) return ["✈️", "航班或機場", "transit"];
    if (/Canal Tour|候船|運河/.test(text)) return ["🚤", "船", "transit"];
    if (/RER|TER|Metro|M\d|S-tog|Øresund|火車|列車|車站|Station|København H|Malmö C/.test(text)) return ["🚆", "火車或捷運", "transit"];
    if (/票|驗票|安檢|安全檢查|證照查驗|報到|Check-in|寄放/.test(text)) return ["🎟️", "票券或報到", "ticket"];
    if (/飯店|住宿|First Camp|入住/.test(text)) return ["🏨", "住宿", "prep"];
    if (/自由女神|Cygnes/.test(text)) return ["🗽", "地標雕像", "sight"];
    if (/Ballon|熱氣球/.test(text)) return ["🎈", "熱氣球", "sight"];
    if (/商場|Fnac|百貨|Bon Marché/.test(text)) return ["🛍️", "商場百貨", "sight"];
    if (/步行|散步|街道|Strøget|Champs-Élysées|Västra Hamnen/.test(text)) return ["🚶", "步行", "transit"];
    if (/Church|Notre-Dame|Sacré-Cœur|聖心堂|Sainte-Chapelle|聖徒禮拜堂/.test(text)) return ["⛪", "教堂", "sight"];
    if (/Versailles|Rosenborg|城堡/.test(text)) return ["🏰", "城堡宮殿", "sight"];
    if (/Experimentarium|科技|科學/.test(text)) return ["🔬", "科學體驗", "prep"];
    if (/ECCV|Poster|Conference|Expo|badge/.test(text)) return ["🎓", "會議", "prep"];
    if (/咖啡|甜點/.test(text)) return ["☕", "休息", "food"];
    if (/起床|準備|收行李|退房/.test(text)) return ["🎒", "準備", "prep"];
    if (/休息|飛行中/.test(text)) return ["🌙", "休息", "prep"];
    if (/會合|分流/.test(text)) return ["🤝", "集合", "prep"];
    if (/Christiansborg|克里斯蒂安堡|DAC|BLOX|建築中心|Malmöhus|Palace|Musée|Museum|Rundetaarn|Arc de Triomphe|Louvre|Garnier|Trianon|Amalienborg|Marmorkirken|Concorde|廣場|庭院/.test(text)) return ["🏛️", "景點", "sight"];
    return ["🧭", "行程", "transit"];
  }

  function renderScheduleItem(item, day) {
    const core = getCore();
    const esc = core.esc;
    const bilingualText = core.bilingualText;
    const stateClass = /硬時間|固定|預約|目標班次/.test(item.tag) ? "is-fixed" : /優先購票|聯票/.test(item.tag) ? "is-ticket" : /optional|彈性/i.test(`${item.title} ${item.tag}`) ? "is-optional" : "";
    const placeId = schedulePlaceId(item, day);
    const [icon, iconLabel, tone] = scheduleIcon(item);
    const toneClass = tone ? `tone-${tone}` : "";
    const ticketAction = item.ticketId ? `<div class="schedule-ticket-row"><button type="button" class="schedule-ticket-btn" data-ticket-action="open" data-ticket-id="${esc(item.ticketId)}"><span aria-hidden="true">🎫</span> 出示票券憑證</button></div>` : "";
    const inner = `<span class="schedule-icon ${toneClass}" role="img" aria-label="${esc(iconLabel)}">${icon}</span><div class="schedule-copy"><div class="schedule-time"><span>時間</span><strong>${esc(item.time)}</strong>${placeId ? `<span class="schedule-jump" aria-hidden="true">↓</span>` : ""}</div><h3>${esc(bilingualText(item.title))}</h3><p>${esc(scheduleGuideText(item))}</p>${ticketAction}</div>`;
    return `<li class="schedule-item ${stateClass} ${placeId ? "is-linked" : ""}">${placeId ? `<a class="schedule-card" href="#place-${esc(placeId)}" aria-label="${esc(bilingualText(item.title))}，前往下方地點筆記">${inner}</a>` : `<div class="schedule-card">${inner}</div>`}</li>`;
  }

  function routeKind(step, index, lastIndex) {
    if (index === 0) return "起點";
    if (index === lastIndex) return "目的地";
    if (/A：.*B：/.test(step)) return "A／B 分流";
    if (/Sainte-Chapelle.*Notre-Dame/.test(step)) return "共同主線";
    if (/步行/.test(step)) return "步行";
    if (/叫車|Taxi|Bus|M\d|Metro|RER|火車|TER|Øresund|EK|FR|機場/.test(step)) return "搭乘／轉乘";
    return "轉乘節點";
  }

  function reservationReminderMarkup(reminder) {
    if (!reminder) return "";
    const core = getCore();
    const esc = core.esc;
    const bilingualText = core.bilingualText;
    return `
      <section class="day-reservation-reminder" aria-label="巴黎聖母院免費預約提醒">
        <span class="day-reminder-icon" aria-hidden="true">⏰</span>
        <div class="day-reminder-copy">
          <span class="eyebrow">${esc(reminder.countdown || "預約提醒")}</span>
          <h2>${esc(bilingualText(reminder.title))}</h2>
          <p>${esc(bilingualText(reminder.detail))}</p>
        </div>
        ${reminder.url ? `<a class="button button-primary day-reminder-action" href="${esc(reminder.url)}" target="_blank" rel="noreferrer">${esc(reminder.cta || "開啟官方預約")} <span aria-hidden="true">↗</span></a>` : ""}
      </section>`;
  }

  function splitPlanMarkup(splitPlan) {
    if (!splitPlan?.branches?.length) return "";
    const core = getCore();
    const esc = core.esc;
    const bilingualText = core.bilingualText;
    const sectionHeading = core.sectionHeading;

    const branches = splitPlan.branches.map((branch) => `
      <article class="split-route-card tone-${esc(branch.tone || "teal")}">
        <header class="split-route-header">
          <div><span>${esc(branch.label)}</span><h3>${esc(bilingualText(branch.title))}</h3></div>
          <strong>${esc(branch.badge || "分組")}</strong>
        </header>
        <ol class="split-route-steps">
          ${(branch.steps || []).map((step, index) => `
            <li>
              <span class="split-step-number">${index + 1}</span>
              <div><time>${esc(step.time)}</time><strong>${esc(bilingualText(step.title))}</strong><p>${esc(bilingualText(step.detail))}</p></div>
            </li>`).join("")}
        </ol>
        <p class="split-route-note">${esc(bilingualText(branch.note || ""))}</p>
        ${branch.url ? `<a class="button button-secondary split-route-action" href="${esc(branch.url)}" target="_blank" rel="noreferrer">${esc(branch.cta || "官方資訊")} <span aria-hidden="true">↗</span></a>` : ""}
      </article>`).join("");
    return `
      <section class="day-section split-plan-section" aria-label="下午 A／B 分組路線">
        <div class="split-plan-heading">
          <div>${sectionHeading("CHOOSE YOUR ROUTE", splitPlan.title, splitPlan.detail)}</div>
          <span class="split-plan-duration">13:00 → 14:30</span>
        </div>
        <div class="split-route-grid">${branches}</div>
        <div class="split-meeting-strip"><span aria-hidden="true">◎</span><div><small>兩組共同集合點</small><strong>${esc(bilingualText(splitPlan.meeting))}</strong></div></div>
      </section>`;
  }

  function renderDay(requestedKey) {
    const trip = window.TRIP || {};
    const core = getCore();
    const placesModule = getPlaces();
    const esc = core.esc;
    const bilingualText = core.bilingualText;
    const cityLabel = core.cityLabel;
    const homeLink = core.homeLink;
    const placesLink = core.placesLink;
    const logisticsLink = core.logisticsLink;
    const dayLink = core.dayLink;
    const layout = core.layout;
    const sectionHeading = core.sectionHeading;

    const key = trip.days?.[requestedKey] ? requestedKey : "09-08";
    const day = trip.days?.[key];
    if (!day) return;

    const keys = Object.keys(trip.days || {});
    const currentIndex = keys.indexOf(key);
    const previous = currentIndex > 0 ? keys[currentIndex - 1] : null;
    const next = currentIndex < keys.length - 1 ? keys[currentIndex + 1] : null;
    const placeCardFn = placesModule.card || (() => "");
    const places = (day.places || []).map((id) => placeCardFn(id, true)).join("");
    const orderedMap = routeMapMarkup(key);
    const reservationReminder = reservationReminderMarkup(day.reservationReminder);
    const splitPlan = splitPlanMarkup(day.splitPlan);
    const dayTickets = (trip.tickets || []).filter((t) => !t.hidden && t.targetDays?.includes(key));
    const dayTicketsBanner = dayTickets.length ? `
      <section class="day-tickets-strip" aria-label="當日適用票券憑證">
        <div class="day-tickets-strip-heading">
          <span class="day-tickets-icon" aria-hidden="true">🎫</span>
          <div>
            <strong>當日適用票券憑證</strong>
            <small>共 ${dayTickets.length} 張憑證，點擊即可快速出示</small>
          </div>
        </div>
        <div class="day-tickets-chips">
          ${dayTickets.map((t) => `<button type="button" class="day-ticket-chip" data-ticket-action="open" data-ticket-id="${esc(t.id)}"><span aria-hidden="true">🎫</span> ${esc(t.title)}${t.badge ? ` (${esc(t.badge)})` : ""}</button>`).join("")}
        </div>
      </section>` : "";
    const routeSteps = (day.transport?.steps || []).map((step, index) => `<li><span class="route-step-number">${String(index + 1).padStart(2, "0")}</span><div><small>${routeKind(step, index, day.transport.steps.length - 1)}</small><strong>${esc(bilingualText(step))}</strong></div>${index < day.transport.steps.length - 1 ? `<span class="route-step-arrow" aria-hidden="true">↓</span>` : ""}</li>`).join("");
    const dayStrip = keys.map((itemKey) => `<a class="${itemKey === key ? "is-current" : ""}" href="${dayLink(itemKey)}"><span>${esc(itemKey.replace("-", "/"))}</span><small>${esc(cityLabel(trip.days[itemKey].cityKey))}</small></a>`).join("");
    document.title = `${day.date.slice(5).replace("/", ".")}｜${bilingualText(day.title)}｜ECCV 2026`;

    layout(`
      <div class="day-breadcrumb"><a href="${homeLink}">旅程總覽</a><span>›</span><span>${esc(bilingualText(day.city))}</span><span>›</span><strong>${esc(day.date.slice(5).replace("/", "."))}</strong></div>
      <section class="day-hero tone-${esc(day.tone)}">
        <div class="day-hero-copy"><div class="day-kicker"><span>${esc(day.weekday)}</span><span>${esc(cityLabel(day.cityKey))}</span></div><h1>${esc(bilingualText(day.title))}</h1><p>${esc(bilingualText(day.summary))}</p></div>
        <div class="day-date-badge"><small>SEP</small><strong>${esc(day.date.slice(-2))}</strong><span>${esc(bilingualText(day.city))}</span></div>
      </section>
      <div class="day-facts"><div><span>住宿</span><strong>${esc(bilingualText(day.stay))}</strong></div><div><span>交通量</span><strong>${esc(day.transport.duration)}</strong></div><div><span>今日重點</span><strong>${day.places.length ? esc(day.places.map((id) => trip.places[id]?.local || id).join("・")) : "移動與休息"}</strong></div></div>
      <nav class="day-index-strip" aria-label="快速切換日期">${dayStrip}</nav>
      ${reservationReminder}
      ${dayTicketsBanner}
      <div class="day-layout">
        <main>
          <section class="day-section"><div class="section-heading-row">${sectionHeading("TODAY'S ROUTE", "今天照這個順序走", day.splitPlan ? "時間在上、地點與下一步在下；13:00 再選 A 或 B 路線。點有箭頭的卡片可看地點筆記。" : "時間在上、地點與下一步在下；點有箭頭的卡片可直接查看地點筆記。")}</div><ol class="schedule-list">${day.schedule.map((item) => renderScheduleItem(item, day)).join("")}</ol></section>
          ${splitPlan}
          ${orderedMap}
          <section class="day-section transport-section"><div><div>${sectionHeading("MOVE SMART", "交通路線", "共同主線與下午分流都列清楚；地圖可切換 A／B。")}</div><ol class="route-list">${routeSteps}</ol><p class="route-note">${esc(bilingualText(day.transport.note))}</p></div><aside class="transport-tip"><span class="eyebrow">TRAVEL TIP</span><strong>${esc(day.transport.duration)}</strong><p>少轉一次車，通常比多省十分鐘更值得。</p></aside></section>
          ${places ? `<section class="day-section place-notes-section"><div class="section-heading-row"><div>${sectionHeading("PLACE NOTES", "地點筆記", "上方有箭頭的行程卡會跳到這裡；需要時再看特色、停留時間與地圖。")}</div><a class="text-link" href="${placesLink}">完整景點頁 <span aria-hidden="true">→</span></a></div><div class="day-place-grid">${places}</div></section>` : ""}
          <section class="day-note"><span aria-hidden="true">✦</span><div><span class="eyebrow">DAY NOTE</span><p>${esc(bilingualText(day.note))}</p></div></section>
        </main>
        <aside class="day-aside"><div class="aside-card"><span class="eyebrow light">QUICK LOOK</span><h3>今天前三件事</h3><ul>${day.schedule.slice(0, 3).map((item) => `<li><span>${esc(item.time)}</span><strong>${esc(bilingualText(item.title))}</strong></li>`).join("")}</ul><a class="button button-on-dark" href="${logisticsLink}">完整交通資訊 <span aria-hidden="true">→</span></a></div><div class="aside-card aside-card-light"><span class="eyebrow">STAY TONIGHT</span><h3>${esc(bilingualText(day.stay))}</h3><p>${esc(bilingualText(day.transport.note))}</p></div></aside>
      </div>
      <nav class="day-pagination" aria-label="前後日期導覽">${previous ? `<a href="${dayLink(previous)}"><small>上一天</small><strong>← ${esc(trip.days[previous].date.slice(5).replace("/", "."))} ${esc(bilingualText(trip.days[previous].city))}</strong></a>` : "<span></span>"}${next ? `<a class="next-day" href="${dayLink(next)}"><small>下一天</small><strong>${esc(trip.days[next].date.slice(5).replace("/", "."))} ${esc(bilingualText(trip.days[next].city))} →</strong></a>` : "<span></span>"}</nav>`);
    setupRouteMap(key);
  }

  window.ECCV_PAGES = window.ECCV_PAGES || {};
  window.ECCV_PAGES.day = {
    render: renderDay,
    setupRouteMap: setupRouteMap
  };
})();
