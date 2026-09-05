(function () {
  "use strict";

  const PACKING_CUSTOM_STORAGE_KEY = "eccv-packing-custom-v1";
  const PACKING_CHECK_STORAGE_KEY = "eccv-packing-checklist-v1";

  function getCore() {
    return window.ECCV_CORE;
  }

  function getPackingBags() {
    const trip = window.TRIP || {};
    try {
      const saved = localStorage.getItem(PACKING_CUSTOM_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.bags)) {
          return trip.packing.bags.map((baseBag) => {
            const customBag = parsed.bags.find((b) => b.id === baseBag.id);
            if (customBag && Array.isArray(customBag.items)) {
              return {
                ...baseBag,
                items: customBag.items.map((item, idx) => ({
                  id: item.id || `item_${baseBag.id}_${idx}_${Date.now()}`,
                  name: String(item.name || "").trim() || "未命名物品",
                  group: item.group || undefined
                }))
              };
            }
            return {
              ...baseBag,
              items: baseBag.items.map((it) => ({ ...it }))
            };
          });
        }
      }
    } catch (_) {}
    return (trip.packing?.bags || []).map((bag) => ({
      ...bag,
      items: (bag.items || []).map((it) => ({ ...it }))
    }));
  }

  function savePackingBags(bags) {
    try {
      const dataToSave = {
        bags: bags.map((b) => ({
          id: b.id,
          items: b.items.map((it) => ({
            id: it.id,
            name: it.name,
            group: it.group
          }))
        }))
      };
      localStorage.setItem(PACKING_CUSTOM_STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (_) {}
  }

  function packToUrlSafeBase64(str) {
    const bytes = new TextEncoder().encode(str);
    let bin = "";
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      bin += String.fromCharCode(bytes[i]);
    }
    return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }

  function unpackFromUrlSafeBase64(input) {
    if (!input || typeof input !== "string") throw new Error("無效的同步資料");
    let raw = input.trim();
    const hashIdx = raw.indexOf("#sync=");
    if (hashIdx !== -1) {
      raw = raw.slice(hashIdx + 6);
    }
    raw = decodeURIComponent(raw).trim();
    if (raw.startsWith("{")) {
      return JSON.parse(raw);
    }
    let str = raw.replace(/-/g, "+").replace(/_/g, "/");
    while (str.length % 4) {
      str += "=";
    }
    const bin = atob(str);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) {
      bytes[i] = bin.charCodeAt(i);
    }
    return JSON.parse(new TextDecoder().decode(bytes));
  }

  function copyTextToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    const core = getCore();
    return core ? core.copyText(text) : Promise.resolve(false);
  }

  function packingItemMarkup(bag, item, isEditing) {
    const core = getCore();
    const esc = core.esc;
    const key = `${bag.id}:${item.id}`;
    if (isEditing) {
      return `
        <div class="packing-item is-editing" id="pack-${esc(item.id)}" data-packing-item data-bag="${esc(bag.id)}" data-item-id="${esc(item.id)}">
          <button class="packing-item-delete" type="button" data-packing-delete-item title="刪除此項目" aria-label="刪除 ${esc(item.name)}">✕</button>
          <div class="packing-item-copy">
            <input class="packing-item-input" type="text" value="${esc(item.name)}" data-packing-item-input data-bag="${esc(bag.id)}" data-item-id="${esc(item.id)}" aria-label="修改項目名稱" />
          </div>
        </div>`;
    }
    return `
      <label class="packing-item" id="pack-${esc(item.id)}" data-packing-item data-bag="${esc(bag.id)}">
        <input class="packing-checkbox" type="checkbox" value="${esc(key)}" data-packing-check />
        <span class="packing-check-ui" aria-hidden="true">✓</span>
        <span class="packing-item-copy"><strong>${esc(item.name)}</strong></span>
      </label>`;
  }

  function packingItemsMarkup(bag, isEditing) {
    const core = getCore();
    const esc = core.esc;
    if (!bag.items.some((item) => item.group)) {
      return `
        <div class="packing-items">
          ${bag.items.map((item) => packingItemMarkup(bag, item, isEditing)).join("")}
          ${isEditing ? `
            <form class="packing-add-row" data-packing-add-form data-bag="${esc(bag.id)}">
              <input class="packing-add-input" type="text" placeholder="+ 新增${esc(bag.shortLabel || bag.label)}物品..." data-packing-add-input />
              <button class="packing-add-btn" type="submit">新增</button>
            </form>` : ""}
        </div>`;
    }
    const groups = [];
    bag.items.forEach((item) => {
      const group = item.group || "其他";
      let bucket = groups.find((entry) => entry.name === group);
      if (!bucket) {
        bucket = { name: group, items: [] };
        groups.push(bucket);
      }
      bucket.items.push(item);
    });
    return `
      <div class="packing-groups">
        ${groups.map((group) => `
          <section class="packing-group">
            <h3>${esc(group.name)}</h3>
            <div class="packing-items">
              ${group.items.map((item) => packingItemMarkup(bag, item, isEditing)).join("")}
              ${isEditing ? `
                <form class="packing-add-row" data-packing-add-form data-bag="${esc(bag.id)}" data-group="${esc(group.name)}">
                  <input class="packing-add-input" type="text" placeholder="+ 新增${esc(group.name)}物品..." data-packing-add-input />
                  <button class="packing-add-btn" type="submit">新增</button>
                </form>` : ""}
            </div>
          </section>`).join("")}
        ${isEditing ? `
          <form class="packing-add-group-form" data-packing-add-group-form data-bag="${esc(bag.id)}">
            <input class="packing-add-input" type="text" placeholder="+ 新增自訂分類群組（例如：伴手禮／紀念品）..." data-packing-add-group-input />
            <button class="packing-add-btn" type="submit">新增分類</button>
          </form>` : ""}
      </div>`;
  }

  function souvenirCardMarkup(item, type, esc) {
    const isPremium = type === "premium";
    return `
      <article class="souvenir-card ${isPremium ? "is-premium" : "is-shared"}" id="souvenir-${esc(item.id)}">
        <div class="souvenir-media-frame">
          <img class="souvenir-img" src="${esc(item.image)}" alt="${esc(item.name)}" loading="eager" />
          <span class="souvenir-badge">${esc(item.theme || item.tag)}</span>
        </div>
        <div class="souvenir-content">
          <div class="souvenir-header">
            <span class="souvenir-origin">${esc(item.origin)}</span>
            <h3 class="souvenir-title">${esc(item.name)}</h3>
            <p class="souvenir-local-name">${esc(item.localName)}</p>
          </div>
          <div class="souvenir-meta-row">
            <div class="souvenir-price-chip">
              <span class="souvenir-meta-label">參考預算</span>
              <strong>${esc(item.budget)}</strong>
            </div>
            <div class="souvenir-place-chip">
              <span class="souvenir-meta-label">建議採購點</span>
              <p>${esc(item.place)}</p>
            </div>
          </div>
          <ul class="souvenir-features">
            ${(item.features || []).map((f) => `<li>${esc(f)}</li>`).join("")}
          </ul>
          <div class="souvenir-card-footer">
            <span class="souvenir-bag-tip"><span aria-hidden="true">🧳</span> ${esc(item.bagTip)}</span>
          </div>
        </div>
      </article>`;
  }

  function renderPacking() {
    const trip = window.TRIP || {};
    const core = getCore();
    const esc = core.esc;
    const layout = core.layout;

    let currentBags = getPackingBags();
    let isEditing = false;
    let filter = "all";

    const getSavedChecks = () => {
      try {
        const parsed = JSON.parse(localStorage.getItem(PACKING_CHECK_STORAGE_KEY) || "[]");
        if (Array.isArray(parsed)) return new Set(parsed);
      } catch (_) {}
      return new Set();
    };

    const saveChecks = (checkedValues) => {
      try {
        localStorage.setItem(PACKING_CHECK_STORAGE_KEY, JSON.stringify(Array.from(checkedValues)));
      } catch (_) {}
    };

    const packing = trip.packing || { bags: [], sources: [] };
    const sourceLinks = (packing.sources || []).map((source) => `<a href="${esc(source.url)}" target="_blank" rel="noreferrer">${esc(source.label)} <span aria-hidden="true">↗</span></a>`).join("");

    const souvenirsData = trip.souvenirs || { premium: [], shared: [] };
    const premiumCards = (souvenirsData.premium || []).map((item) => souvenirCardMarkup(item, "premium", esc)).join("");
    const sharedCards = (souvenirsData.shared || []).map((item) => souvenirCardMarkup(item, "shared", esc)).join("");

    const souvenirsPaneMarkup = `
      <section class="souvenirs-hero-banner">
        <div class="souvenirs-hero-copy">
          <span class="eyebrow light">SOUVENIRS & GIFTS GUIDE · 採買推薦</span>
          <h2>精選伴手禮採買指南</h2>
          <p>與個人行李打包徹底隔離分流。精選北歐與法國代表性選品，分為一人一份的「精選主題風格禮包」與公用桌分享的「團隊零食分享包」，均附實物相片、預算估計與採買建議。</p>
        </div>
        <div class="souvenirs-hero-chips">
          <span class="souvenir-stat-chip">🎁 4 款精選主題禮包</span>
          <span class="souvenir-stat-chip">🍬 4 款團隊分享零食</span>
          <span class="souvenir-stat-chip">⚖️ 留意 20kg 託運限額</span>
        </div>
      </section>

      <section class="souvenir-alert-box" role="note">
        <div class="souvenir-alert-icon" aria-hidden="true">⚠️</div>
        <div class="souvenir-alert-text">
          <strong>重要提醒：瑞典魚卵牙膏抹醬（Kalles Kaviar）不建議帶回台灣</strong>
          <p>官方保存條件載明需全程 2～8°C 冷藏。9/12 離開瑞典後還需在巴黎待至 9/18，常溫攜帶極易發酵變質爆管；且膏狀物 190g 超過 100ml 須託運，在貨艙與常溫下難以保鮮。若想體驗，建議在瑞典 First Camp 小木屋廚房配白煮蛋享用，或回台至台灣 IKEA 瑞典食品超市購買冷藏進口品。</p>
        </div>
      </section>

      <section class="souvenir-group-section">
        <div class="souvenir-group-heading">
          <div>
            <span class="eyebrow">THEME GIFT PACKS · 一人一份</span>
            <h2>精選主題風格禮包</h2>
            <p>單人預算約 NT$1,000～1,500（約 200～350 DKK / SEK），當地代表性強、包裝質感高，適合致贈摯友或職場 Mentor。</p>
          </div>
          <span class="souvenir-group-count">4 款選品</span>
        </div>
        <div class="souvenir-cards-grid">${premiumCards}</div>
      </section>

      <section class="souvenir-group-section">
        <div class="souvenir-group-heading">
          <div>
            <span class="eyebrow">OFFICE & TEAM PANTRY · 零食公用桌</span>
            <h2>團隊零食分享包</h2>
            <p>總預算約 NT$400～500（約 140 SEK），直接放辦公室公用桌供多人享用。80% 瑞典國民安全牌美味 ＋ 20% 文化衝擊冒險體驗。</p>
          </div>
          <span class="souvenir-group-count">4 款選品</span>
        </div>
        <div class="souvenir-cards-grid">${sharedCards}</div>
      </section>

      <section class="souvenir-luggage-tips content-section">
        <div class="section-heading-row">
          <div>
            <span class="eyebrow light">LUGGAGE ALLOCATION</span>
            <h2>伴手禮行李配置建議</h2>
            <p>避免在哥本哈根飛巴黎段（Ryanair 託運上限 20 kg）超重。</p>
          </div>
        </div>
        <ul class="souvenir-tips-list">
          <li><strong>瑞典馬爾默段（09/07 - 09/12）</strong>：可在 ICA Maxi 超市一次購足車車軟糖、Marabou 巧克力、Ballerina 餅乾與鹹甘草糖，總重控制在 1.5 kg 內。</li>
          <li><strong>丹麥哥本哈根段（09/11 - 09/12）</strong>：在中央車站、Strøget 街或 CPH 機場免稅店採買精品甘草球、Læsø 海鹽、木偶或冠軍咖啡豆，體積小巧好收納。</li>
          <li><strong>巴黎段（09/12 - 09/18）</strong>：若北歐零食擔心超重，可保留部分額度在巴黎樂蓬馬歇美食館或 Monoprix 超市補齊法國經典點心。</li>
        </ul>
      </section>
    `;

    layout(`
      <section class="packing-nav-bar content-section">
        <div class="packing-view-tabs" role="tablist" aria-label="行李與伴手禮分頁切換">
          <button class="packing-view-tab is-active" type="button" role="tab" aria-selected="true" data-packing-view="checklist">
            <span aria-hidden="true">🎒</span> 行李打包清單
          </button>
          <button class="packing-view-tab" type="button" role="tab" aria-selected="false" data-packing-view="souvenirs">
            <span aria-hidden="true">🎁</span> 伴手禮推薦指南
          </button>
        </div>
      </section>

      <div class="packing-view-pane" data-packing-pane="checklist">
        <section class="packing-header-dashboard">
          <div class="packing-dashboard-top">
            <div class="packing-dashboard-title">
              <span class="eyebrow">PACK BY WHERE IT LIVES · 09/06 - 09/19</span>
              <h1>三個包準備清單</h1>
              <p>小包永遠貼身、後背包負責工作與登機、行李箱收托運物。支援自訂編輯並自動儲存於本機快取。</p>
            </div>
            <div class="packing-progress-pill-card">
              <div class="progress-pill-header">
                <span class="eyebrow">整體進度</span>
                <strong><span data-packing-completed>0</span> / <span data-packing-total>0</span> 項 (<span data-packing-percent>0%</span>)</strong>
              </div>
              <div class="packing-progress-track">
                <div class="packing-progress-fill" data-packing-progress-fill style="width: 0%"></div>
              </div>
            </div>
          </div>

          <div class="packing-bags-nav">
            ${currentBags.map((bag) => `
              <a class="packing-bag-nav-card bag-nav-${esc(bag.id)}" href="#bag-${esc(bag.id)}">
                <span class="bag-nav-number">${esc(bag.number)}</span>
                <div class="bag-nav-info">
                  <strong>${esc(bag.label)}</strong>
                  <small>${esc(bag.shortLabel || bag.label)} · ${esc(bag.headline)}</small>
                </div>
                <span class="bag-nav-count" data-bag-count="${esc(bag.id)}">0 / ${bag.items.length}</span>
              </a>`).join("")}
          </div>
        </section>

        <section class="boarding-rule" id="boarding-rule" aria-label="Ryanair 登機行李規則">
          <div class="boarding-rule-copy"><span class="eyebrow light">FR9267 · GATE MODE</span><h2>登機時只能看見一件隨身包。</h2><p>日常是「小包＋後背包」，但到 Ryanair 登機口前，<strong>小包要整個塞進後背包</strong>；後背包再放前座下方。</p></div>
          <div class="boarding-flow" aria-label="小包放進後背包再放到前座下"><span>貼身小包</span><b aria-hidden="true">→</b><span>收進後背包</span><b aria-hidden="true">→</b><span>前座下方</span></div>
          <div class="boarding-limits"><div><small>唯一免費隨身件</small><strong>40 × 30 × 20</strong><span>cm</span></div><div><small>托運上限／封箱目標</small><strong>20 / 18</strong><span>kg</span></div></div>
        </section>

        <section class="packing-workspace content-section">
          <div class="packing-toolbar">
            <div class="packing-toolbar-top">
              <div class="packing-toolbar-copy">
                <span class="eyebrow">LIVE CHECKLIST</span>
                <strong><span data-packing-completed>0</span> / <span data-packing-total>0</span> 已完成</strong>
                <small data-packing-visible>顯示 0 項</small>
              </div>
              <div class="packing-filters" role="group" aria-label="篩選行李狀態">
                <button class="is-active" type="button" data-packing-filter="all">全部</button>
                <button type="button" data-packing-filter="todo">還沒收</button>
              </div>
            </div>

            <div class="packing-bag-pills" role="tablist" aria-label="按包篩選行李清單">
              <button class="packing-bag-pill is-active" type="button" data-bag-filter="all">全部 (<span data-bag-filter-count="all">0</span>)</button>
              <button class="packing-bag-pill" type="button" data-bag-filter="tiny">① 小包 (<span data-bag-filter-count="tiny">0/0</span>)</button>
              <button class="packing-bag-pill" type="button" data-bag-filter="backpack">② 後背包 (<span data-bag-filter-count="backpack">0/0</span>)</button>
              <button class="packing-bag-pill" type="button" data-bag-filter="suitcase">③ 行李箱 (<span data-bag-filter-count="suitcase">0/0</span>)</button>
            </div>

            <div class="packing-toolbar-actions">
              <button class="packing-collapse-toggle" type="button" data-packing-collapse-toggle title="收合或展開所有包包">全部收合</button>
              <button class="packing-sync-btn" type="button" data-packing-sync-open title="跨裝置同步與備份">⇄ 同步／匯出</button>
              <button class="packing-edit-toggle" type="button" data-packing-edit-toggle>✎ 編輯清單</button>
              <button class="packing-reset" type="button" data-packing-reset>重設勾選</button>
              <button class="packing-revert-btn" type="button" data-packing-revert hidden>恢復預設</button>
            </div>
          </div>
          <div class="packing-bags" id="packing-bags-container"></div>
        </section>

        <section class="flight-wear content-section">
          <div><span class="eyebrow light">WEAR, DON'T PACK</span><h2>出發當天直接穿上。</h2><p>把最佔體積、又能應付冷氣與北歐晚風的組合穿在身上。</p></div>
          <ol><li><span>01</span><strong>主力走路鞋</strong></li><li><span>02</span><strong>長褲＋短袖</strong></li><li><span>03</span><strong>薄帽 T／中層</strong></li><li><span>04</span><strong>防水外套放手邊</strong></li></ol>
        </section>

        <section class="packing-safety content-section">
          <div><span class="eyebrow">CABIN ONLY</span><h2>這些絕對不要托運。</h2><p>護照、現金、信用卡、藥品、MacBook、iPad、XM6 與行動電源都留在身上或後背包。</p></div>
          <div class="packing-source-links"><small>航空規則最後確認：${esc(packing.lastChecked)}</small>${sourceLinks}</div>
        </section>
      </div>

      <div class="packing-view-pane" data-packing-pane="souvenirs" hidden>
        ${souvenirsPaneMarkup}
      </div>

      <div class="packing-sync-overlay" id="packing-sync-modal" hidden>
        <div class="packing-sync-container" role="dialog" aria-modal="true" aria-labelledby="sync-modal-heading">
          <div class="packing-sync-header">
            <div class="packing-sync-title-group">
              <span class="eyebrow">DEVICE SYNC · 跨裝置同步</span>
              <h2 id="sync-modal-heading">行李清單同步與還原</h2>
              <small>支援 iPhone、MacBook 與 Android 互通，包含自訂項目與進度</small>
            </div>
            <button class="packing-sync-close" type="button" data-sync-close aria-label="關閉彈窗">✕</button>
          </div>
          <div class="packing-sync-tabs" role="tablist">
            <button class="packing-sync-tab is-active" type="button" role="tab" aria-selected="true" data-sync-tab="export">匯出與分享</button>
            <button class="packing-sync-tab" type="button" role="tab" aria-selected="false" data-sync-tab="import">掃描與匯入</button>
          </div>
          <div class="packing-sync-body">
            <div class="packing-sync-pane" data-sync-pane="export">
              <div class="packing-sync-summary" data-sync-summary>
                <span>已收進度：<strong data-sync-summary-text>0 / 0 項 (0%)</strong></span>
                <span data-sync-summary-time>剛剛</span>
              </div>
              <div class="packing-sync-qr-card">
                <div class="packing-sync-qr-frame" data-sync-qr-container></div>
                <p class="packing-sync-qr-tip">用手機相機直接對準 QR Code，或在另一台裝置點擊「掃描與匯入」。</p>
              </div>
              <div class="packing-sync-actions">
                <button class="button button-secondary" type="button" data-sync-copy-url>🔗 複製同步連結</button>
                <button class="button button-primary" type="button" data-sync-share>📤 分享 (AirDrop)</button>
              </div>
              <div class="packing-sync-hint">
                <span>💡 <strong>快速互通</strong>：透過手機鏡頭掃描上方 QR Code 可直接打開同步連結；或點擊「分享」以 AirDrop 傳送至 iPhone／MacBook。</span>
              </div>
            </div>

            <div class="packing-sync-pane" data-sync-pane="import" hidden>
              <div class="packing-scanner-box">
                <div class="packing-scanner-viewport" data-sync-scanner-viewport>
                  <video class="packing-scanner-video" playsinline muted autoplay data-sync-scanner-video></video>
                  <div class="packing-scanner-overlay" data-sync-scanner-guide hidden>
                    <div class="packing-scanner-reticle">
                      <div class="packing-scanner-laser"></div>
                    </div>
                  </div>
                  <div class="packing-scanner-placeholder" data-sync-scanner-placeholder>
                    <div class="packing-scanner-icon">📷</div>
                    <p>開啟相機對準另一台裝置上的 QR Code，即可秒級還原進度。</p>
                  </div>
                </div>
                <div class="packing-scanner-controls">
                  <button class="button button-primary" type="button" data-sync-camera-toggle>📷 啟動相機掃描</button>
                </div>
                <div class="packing-scanner-status" data-sync-scanner-status role="status" aria-live="polite"></div>
              </div>

              <details class="packing-sync-manual-toggle">
                <summary>手動輸入備案（無相機時使用）</summary>
                <div class="packing-sync-field" style="margin-top: 10px;">
                  <label for="sync-import-code">貼上同步代碼或連結</label>
                  <textarea id="sync-import-code" class="packing-sync-textarea" placeholder="在此貼上代碼，或包含 #sync= 的同步連結..." rows="3" data-sync-import-input></textarea>
                </div>
                <div class="packing-sync-actions" style="margin-top: 8px;">
                  <button class="button button-secondary" type="button" data-sync-apply disabled>📥 套用清單</button>
                </div>
                <div class="packing-sync-preview-box" data-sync-import-preview>
                  請在上方貼上代碼以進行解析。
                </div>
              </details>
            </div>
          </div>
        </div>
      </div>`);

    const bagsContainer = document.getElementById("packing-bags-container");
    const editToggleBtn = document.querySelector("[data-packing-edit-toggle]");
    const resetBtn = document.querySelector("[data-packing-reset]");
    const revertBtn = document.querySelector("[data-packing-revert]");
    const filterButtons = document.querySelectorAll("[data-packing-filter]");
    const bagFilterButtons = document.querySelectorAll("[data-bag-filter]");
    const collapseToggleBtn = document.querySelector("[data-packing-collapse-toggle]");

    let selectedBag = "all";
    const collapsedBags = { tiny: false, backpack: false, suitcase: false };

    function updateCollapseToggleBtn() {
      if (!collapseToggleBtn) return;
      const allCollapsed = Object.values(collapsedBags).every(Boolean);
      collapseToggleBtn.textContent = allCollapsed ? "全部展開" : "全部收合";
    }

    function updateCounters() {
      const savedChecks = getSavedChecks();
      const allItemKeys = [];
      currentBags.forEach((bag) => {
        bag.items.forEach((item) => allItemKeys.push(`${bag.id}:${item.id}`));
      });
      const validChecks = new Set([...savedChecks].filter((key) => allItemKeys.includes(key)));
      if (validChecks.size !== savedChecks.size) {
        saveChecks(validChecks);
      }

      const total = allItemKeys.length;
      const completed = validChecks.size;
      const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

      document.querySelectorAll("[data-packing-completed]").forEach((node) => { node.textContent = completed; });
      document.querySelectorAll("[data-packing-total]").forEach((node) => { node.textContent = total; });
      document.querySelectorAll("[data-packing-percent]").forEach((node) => { node.textContent = `${percent}%`; });

      const progressFill = document.querySelector("[data-packing-progress-fill]");
      if (progressFill) progressFill.style.width = `${percent}%`;

      const allFilterCountNode = document.querySelector('[data-bag-filter-count="all"]');
      if (allFilterCountNode) allFilterCountNode.textContent = total;

      currentBags.forEach((bag) => {
        const bagTotal = bag.items.length;
        const bagCompleted = bag.items.filter((item) => validChecks.has(`${bag.id}:${item.id}`)).length;
        document.querySelectorAll(`[data-bag-count="${bag.id}"]`).forEach((node) => {
          node.textContent = `${bagCompleted} / ${bagTotal}`;
        });
        const bagPillCount = document.querySelector(`[data-bag-filter-count="${bag.id}"]`);
        if (bagPillCount) {
          bagPillCount.textContent = `${bagCompleted}/${bagTotal}`;
        }
      });

      // Filter bag sections
      document.querySelectorAll(".packing-bag-section").forEach((section) => {
        const bagId = section.dataset.bagId;
        const bagMatch = selectedBag === "all" || selectedBag === bagId;
        section.hidden = !bagMatch;
      });

      if (!isEditing) {
        let visible = 0;
        document.querySelectorAll(".packing-bag-section").forEach((section) => {
          if (section.hidden) return;
          section.querySelectorAll("[data-packing-item]").forEach((itemNode) => {
            const isChecked = itemNode.querySelector("input")?.checked;
            const statusMatch = filter === "all" || (filter === "todo" && !isChecked);
            itemNode.hidden = !statusMatch;
            if (statusMatch) visible += 1;
          });
        });

        const visibleNode = document.querySelector("[data-packing-visible]");
        if (visibleNode) {
          if (selectedBag === "all") {
            visibleNode.textContent = `顯示 ${visible} / ${total} 項${filter === "todo" ? " (未收)" : ""}`;
          } else {
            const curBag = currentBags.find((b) => b.id === selectedBag);
            const bagTotal = curBag?.items.length || 0;
            visibleNode.textContent = `顯示 ${visible} / ${bagTotal} 項 (${curBag?.shortLabel || curBag?.label || ""})`;
          }
        }
      } else {
        const visibleNode = document.querySelector("[data-packing-visible]");
        if (visibleNode) visibleNode.textContent = `編輯中 · 共 ${total} 項`;
      }
    }

    function renderBags() {
      const savedChecks = getSavedChecks();
      const bagSections = currentBags.map((bag) => `
        <section class="packing-bag-section ${collapsedBags[bag.id] && !isEditing ? "is-collapsed" : ""}" id="bag-${esc(bag.id)}" data-bag-id="${esc(bag.id)}">
          <div class="packing-bag-heading" data-packing-bag-toggle="${esc(bag.id)}" role="button" tabindex="0" aria-expanded="${collapsedBags[bag.id] ? "false" : "true"}">
            <span class="packing-bag-number">${esc(bag.number)}</span>
            <div class="packing-bag-heading-text">
              <span class="eyebrow">${esc(bag.capacity)}</span>
              <h2>${esc(bag.label)}</h2>
              <p class="packing-bag-headline">${esc(bag.headline)}</p>
              <p>${esc(bag.rule)}</p>
            </div>
            <div class="packing-bag-heading-meta">
              <strong class="packing-bag-count" data-bag-count="${esc(bag.id)}">0 / ${bag.items.length}</strong>
              <span class="packing-bag-caret" aria-hidden="true">${collapsedBags[bag.id] ? "▾" : "▴"}</span>
            </div>
          </div>
          <div class="packing-bag-body">
            ${packingItemsMarkup(bag, isEditing)}
          </div>
        </section>`).join("");

      bagsContainer.innerHTML = (isEditing ? `
        <div class="packing-edit-banner" role="status">
          <span><strong>✎ 行李編輯模式中</strong>：可修改名稱、點擊 ✕ 刪除，或在下方欄位新增物品。</span>
          <small>變更即時儲存至本機快取</small>
        </div>` : "") + bagSections;

      // Accordion bag header click
      bagsContainer.querySelectorAll("[data-packing-bag-toggle]").forEach((heading) => {
        heading.addEventListener("click", () => {
          if (isEditing) return;
          const bagId = heading.dataset.packingBagToggle;
          collapsedBags[bagId] = !collapsedBags[bagId];
          const section = document.getElementById(`bag-${bagId}`);
          if (section) {
            section.classList.toggle("is-collapsed", collapsedBags[bagId]);
            const caret = section.querySelector(".packing-bag-caret");
            if (caret) caret.textContent = collapsedBags[bagId] ? "▾" : "▴";
            heading.setAttribute("aria-expanded", collapsedBags[bagId] ? "false" : "true");
          }
          updateCollapseToggleBtn();
        });
      });

      if (isEditing) {
        bagsContainer.querySelectorAll("[data-packing-item-input]").forEach((input) => {
          const bagId = input.dataset.bag;
          const itemId = input.dataset.itemId;
          const onUpdate = () => {
            const val = input.value.trim();
            const bag = currentBags.find((b) => b.id === bagId);
            if (!bag) return;
            const it = bag.items.find((i) => i.id === itemId);
            if (it && val) {
              it.name = val;
              savePackingBags(currentBags);
            }
          };
          input.addEventListener("input", onUpdate);
          input.addEventListener("change", onUpdate);
          input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              input.blur();
            }
          });
        });

        bagsContainer.querySelectorAll("[data-packing-delete-item]").forEach((btn) => {
          btn.addEventListener("click", () => {
            const parent = btn.closest("[data-packing-item]");
            const bagId = parent.dataset.bag;
            const itemId = parent.dataset.itemId;
            const bag = currentBags.find((b) => b.id === bagId);
            if (!bag) return;
            bag.items = bag.items.filter((i) => i.id !== itemId);
            savePackingBags(currentBags);
            renderBags();
          });
        });

        bagsContainer.querySelectorAll("[data-packing-add-form]").forEach((form) => {
          form.addEventListener("submit", (e) => {
            e.preventDefault();
            const input = form.querySelector("[data-packing-add-input]");
            const val = input.value.trim();
            if (!val) return;
            const bagId = form.dataset.bag;
            const groupName = form.dataset.group;
            const bag = currentBags.find((b) => b.id === bagId);
            if (!bag) return;
            const newItem = {
              id: `item_${bagId}_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
              name: val,
              group: groupName || undefined
            };
            bag.items.push(newItem);
            savePackingBags(currentBags);
            input.value = "";
            renderBags();
            const nextForm = groupName
              ? bagsContainer.querySelector(`[data-packing-add-form][data-bag="${bagId}"][data-group="${groupName}"]`)
              : bagsContainer.querySelector(`[data-packing-add-form][data-bag="${bagId}"]:not([data-group])`);
            nextForm?.querySelector("[data-packing-add-input]")?.focus();
          });
        });

        bagsContainer.querySelectorAll("[data-packing-add-group-form]").forEach((form) => {
          form.addEventListener("submit", (e) => {
            e.preventDefault();
            const input = form.querySelector("[data-packing-add-group-input]");
            const val = input.value.trim();
            if (!val) return;
            const bagId = form.dataset.bag;
            const bag = currentBags.find((b) => b.id === bagId);
            if (!bag) return;
            const newItem = {
              id: `item_${bagId}_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
              name: "新物品",
              group: val
            };
            bag.items.push(newItem);
            savePackingBags(currentBags);
            input.value = "";
            renderBags();
          });
        });
      } else {
        bagsContainer.querySelectorAll("[data-packing-check]").forEach((check) => {
          check.checked = savedChecks.has(check.value);
          check.addEventListener("change", () => {
            const checks = getSavedChecks();
            if (check.checked) {
              checks.add(check.value);
            } else {
              checks.delete(check.value);
            }
            saveChecks(checks);
            updateCounters();
          });
        });
      }

      updateCounters();
    }

    editToggleBtn?.addEventListener("click", () => {
      isEditing = !isEditing;
      editToggleBtn.classList.toggle("is-active", isEditing);
      editToggleBtn.textContent = isEditing ? "✓ 完成編輯" : "✎ 編輯清單";
      if (resetBtn) resetBtn.hidden = isEditing;
      if (revertBtn) revertBtn.hidden = !isEditing;
      filterButtons.forEach((btn) => {
        btn.disabled = isEditing;
        btn.style.opacity = isEditing ? "0.4" : "1";
        btn.style.pointerEvents = isEditing ? "none" : "auto";
      });
      renderBags();
    });

    resetBtn?.addEventListener("click", () => {
      if (!window.confirm("要清除這台裝置上的所有行李勾選紀錄嗎？")) return;
      saveChecks(new Set());
      renderBags();
    });

    revertBtn?.addEventListener("click", () => {
      if (!window.confirm("確定要將行李清單恢復為系統預設值嗎？所有自訂修改與新增項目將會被重設。")) return;
      try {
        localStorage.removeItem(PACKING_CUSTOM_STORAGE_KEY);
      } catch (_) {}
      currentBags = getPackingBags();
      renderBags();
    });

    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        filter = btn.dataset.packingFilter;
        filterButtons.forEach((b) => b.classList.toggle("is-active", b === btn));
        updateCounters();
      });
    });

    bagFilterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        selectedBag = btn.dataset.bagFilter;
        bagFilterButtons.forEach((b) => b.classList.toggle("is-active", b === btn));
        if (selectedBag !== "all") {
          collapsedBags[selectedBag] = false;
          const section = document.getElementById(`bag-${selectedBag}`);
          if (section) {
            section.classList.remove("is-collapsed");
            const caret = section.querySelector(".packing-bag-caret");
            if (caret) caret.textContent = "▴";
          }
        }
        updateCollapseToggleBtn();
        updateCounters();
      });
    });

    document.querySelectorAll(".packing-bag-nav-card").forEach((card) => {
      card.addEventListener("click", (e) => {
        const href = card.getAttribute("href") || "";
        const bagId = href.replace("#bag-", "");
        if (bagId && currentBags.some((b) => b.id === bagId)) {
          e.preventDefault();
          selectedBag = bagId;
          collapsedBags[bagId] = false;
          bagFilterButtons.forEach((b) => b.classList.toggle("is-active", b.dataset.bagFilter === bagId));
          const section = document.getElementById(`bag-${bagId}`);
          if (section) {
            section.classList.remove("is-collapsed");
            const caret = section.querySelector(".packing-bag-caret");
            if (caret) caret.textContent = "▴";
          }
          updateCollapseToggleBtn();
          updateCounters();
          section?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });

    collapseToggleBtn?.addEventListener("click", () => {
      if (isEditing) return;
      const allCollapsed = Object.values(collapsedBags).every(Boolean);
      const shouldCollapse = !allCollapsed;
      currentBags.forEach((bag) => {
        collapsedBags[bag.id] = shouldCollapse;
        const section = document.getElementById(`bag-${bag.id}`);
        if (section) {
          section.classList.toggle("is-collapsed", shouldCollapse);
          const caret = section.querySelector(".packing-bag-caret");
          if (caret) caret.textContent = shouldCollapse ? "▾" : "▴";
          const heading = section.querySelector("[data-packing-bag-toggle]");
          if (heading) heading.setAttribute("aria-expanded", shouldCollapse ? "false" : "true");
        }
      });
      updateCollapseToggleBtn();
    });

    function applyPackingSyncPayload(payload) {
      if (!payload || !Array.isArray(payload.checks)) {
        throw new Error("無效的同步資料格式");
      }
      if (payload.custom && Array.isArray(payload.custom.bags)) {
        localStorage.setItem(PACKING_CUSTOM_STORAGE_KEY, JSON.stringify(payload.custom));
      }
      localStorage.setItem(PACKING_CHECK_STORAGE_KEY, JSON.stringify(payload.checks));
      currentBags = getPackingBags();
      renderBags();
    }

    function getPackingSyncPayload() {
      const savedChecks = getSavedChecks();
      const hasCustom = Boolean(localStorage.getItem(PACKING_CUSTOM_STORAGE_KEY));
      const payload = {
        v: 1,
        updatedAt: new Date().toISOString(),
        checks: Array.from(savedChecks)
      };
      if (hasCustom) {
        payload.custom = {
          bags: currentBags.map((b) => ({
            id: b.id,
            items: b.items.map((it) => ({
              id: it.id,
              name: it.name,
              group: it.group
            }))
          }))
        };
      }
      return payload;
    }

    function renderQrCode(container, data) {
      if (!container) return;
      container.innerHTML = "";
      if (typeof window.qrcode === "function") {
        try {
          const qr = window.qrcode(0, "M");
          qr.addData(data);
          qr.make();
          container.innerHTML = qr.createSvgTag({ cellSize: 5, margin: 2, scalable: true });
          return;
        } catch (err) {
          try {
            const qr = window.qrcode(0, "L");
            qr.addData(data);
            qr.make();
            container.innerHTML = qr.createSvgTag({ cellSize: 4, margin: 2, scalable: true });
            return;
          } catch (e2) {
            console.warn("QR code render failed", e2);
          }
        }
      }
      container.innerHTML = `<p style="padding:16px;text-align:center;color:var(--muted);font-size:12px;">無法產生 QR 碼，請使用下方按鈕複製連結分享。</p>`;
    }

    const syncModal = document.getElementById("packing-sync-modal");
    if (syncModal && syncModal.parentElement !== document.body) {
      document.body.appendChild(syncModal);
    }
    const syncOpenBtn = document.querySelector("[data-packing-sync-open]");
    const syncCloseBtn = syncModal?.querySelector("[data-sync-close]");
    const syncTabs = syncModal?.querySelectorAll("[data-sync-tab]");
    const syncPanes = syncModal?.querySelectorAll("[data-sync-pane]");
    const qrContainer = syncModal?.querySelector("[data-sync-qr-container]");
    const copyUrlBtn = syncModal?.querySelector("[data-sync-copy-url]");
    const shareBtn = syncModal?.querySelector("[data-sync-share]");
    const summaryText = syncModal?.querySelector("[data-sync-summary-text]");
    const summaryTime = syncModal?.querySelector("[data-sync-summary-time]");

    // Scanner elements
    const scannerVideo = syncModal?.querySelector("[data-sync-scanner-video]");
    const scannerGuide = syncModal?.querySelector("[data-sync-scanner-guide]");
    const scannerPlaceholder = syncModal?.querySelector("[data-sync-scanner-placeholder]");
    const scannerToggleBtn = syncModal?.querySelector("[data-sync-camera-toggle]");
    const scannerStatus = syncModal?.querySelector("[data-sync-scanner-status]");

    // Manual fallback elements
    const importInput = syncModal?.querySelector("[data-sync-import-input]");
    const importPreview = syncModal?.querySelector("[data-sync-import-preview]");
    const applyBtn = syncModal?.querySelector("[data-sync-apply]");

    let currentExportCode = "";
    let parsedImportPayload = null;
    let scannerStream = null;
    let scannerTimer = null;
    let isScanning = false;
    let barcodeDetector = null;

    if ("BarcodeDetector" in window) {
      try {
        barcodeDetector = new window.BarcodeDetector({ formats: ["qr_code"] });
      } catch (_) {}
    }

    function openSyncModal(initialTab = "export") {
      if (!syncModal) return;
      if (syncModal.parentElement !== document.body) {
        document.body.appendChild(syncModal);
      }
      const payload = getPackingSyncPayload();
      currentExportCode = packToUrlSafeBase64(JSON.stringify(payload));
      const syncUrl = `${window.location.origin}${window.location.pathname}#sync=${currentExportCode}`;
      renderQrCode(qrContainer, syncUrl);

      const totalItems = payload.custom?.bags
        ? payload.custom.bags.reduce((acc, b) => acc + b.items.length, 0)
        : currentBags.reduce((acc, b) => acc + b.items.length, 0);
      const checkedCount = payload.checks.length;
      const pct = totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0;
      if (summaryText) summaryText.textContent = `${checkedCount} / ${totalItems} 項 (${pct}%)`;
      if (summaryTime) summaryTime.textContent = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      switchSyncTab(initialTab);
      syncModal.hidden = false;
      document.body.style.overflow = "hidden";
    }

    function closeSyncModal() {
      if (!syncModal) return;
      stopScanner();
      syncModal.hidden = true;
      document.body.style.overflow = "";
    }

    function switchSyncTab(tabName) {
      if (tabName !== "import") {
        stopScanner();
      }
      syncTabs?.forEach((tab) => {
        const active = tab.dataset.syncTab === tabName;
        tab.classList.toggle("is-active", active);
        tab.setAttribute("aria-selected", active ? "true" : "false");
      });
      syncPanes?.forEach((pane) => {
        pane.hidden = pane.dataset.syncPane !== tabName;
      });
    }

    async function startScanner() {
      if (isScanning || !scannerVideo) return;
      if (!navigator.mediaDevices?.getUserMedia) {
        if (scannerStatus) scannerStatus.textContent = "此裝置或瀏覽器不支援相機 API，請使用下方手動備案。";
        return;
      }
      try {
        if (scannerStatus) scannerStatus.textContent = "正在啟動相機...";
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } }
        });
        scannerStream = stream;
        scannerVideo.srcObject = stream;
        await scannerVideo.play();
        isScanning = true;
        if (scannerPlaceholder) scannerPlaceholder.hidden = true;
        if (scannerGuide) scannerGuide.hidden = false;
        if (scannerToggleBtn) scannerToggleBtn.textContent = "⏹ 停止相機掃描";
        if (scannerStatus) scannerStatus.textContent = "相機已啟動，請將鏡頭對準 QR Code";
        scanLoop();
      } catch (err) {
        console.warn("Camera start failed", err);
        stopScanner();
        if (scannerStatus) scannerStatus.textContent = "無法啟動相機，請允許相機權限，或使用下方手動備案。";
      }
    }

    function stopScanner() {
      isScanning = false;
      if (scannerTimer) {
        cancelAnimationFrame(scannerTimer);
        scannerTimer = null;
      }
      if (scannerStream) {
        scannerStream.getTracks().forEach((track) => track.stop());
        scannerStream = null;
      }
      if (scannerVideo) {
        scannerVideo.srcObject = null;
      }
      if (scannerPlaceholder) scannerPlaceholder.hidden = false;
      if (scannerGuide) scannerGuide.hidden = true;
      if (scannerToggleBtn) scannerToggleBtn.textContent = "📷 啟動相機掃描";
    }

    async function scanLoop() {
      if (!isScanning || !scannerVideo) return;
      if (scannerVideo.readyState >= 2 && scannerVideo.videoWidth > 0) {
        let detectedText = null;

        if (barcodeDetector) {
          try {
            const codes = await barcodeDetector.detect(scannerVideo);
            if (codes && codes.length > 0 && codes[0].rawValue) {
              detectedText = codes[0].rawValue;
            }
          } catch (_) {}
        }

        if (!detectedText && typeof window.jsQR === "function") {
          try {
            const canvas = document.createElement("canvas");
            canvas.width = scannerVideo.videoWidth;
            canvas.height = scannerVideo.videoHeight;
            const ctx = canvas.getContext("2d", { willReadFrequently: true });
            ctx.drawImage(scannerVideo, 0, 0, canvas.width, canvas.height);
            const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const qrResult = window.jsQR(imgData.data, imgData.width, imgData.height, {
              inversionAttempts: "dontInvert"
            });
            if (qrResult && qrResult.data) {
              detectedText = qrResult.data;
            }
          } catch (_) {}
        }

        if (detectedText) {
          handleDetectedQr(detectedText);
          return;
        }
      }
      scannerTimer = requestAnimationFrame(scanLoop);
    }

    function handleDetectedQr(text) {
      stopScanner();
      if (scannerStatus) scannerStatus.textContent = "✓ 已偵測到 QR Code！正在解析...";
      try {
        const payload = unpackFromUrlSafeBase64(text);
        if (payload && Array.isArray(payload.checks)) {
          const total = payload.custom?.bags
            ? payload.custom.bags.reduce((acc, b) => acc + (b.items?.length || 0), 0)
            : currentBags.reduce((acc, b) => acc + b.items.length, 0);
          const chk = payload.checks.length;
          const msg = `【行李清單同步】掃描成功！\n\n• 總物品數：${total} 項\n• 已勾選進度：${chk} 項\n\n確定要將此進度覆蓋至本裝置嗎？`;
          if (window.confirm(msg)) {
            applyPackingSyncPayload(payload);
            closeSyncModal();
            alert("✓ 行李清單已成功同步至本裝置！");
          } else {
            if (scannerStatus) scannerStatus.textContent = "已取消同步。可再次點擊按鈕重新掃描。";
          }
        } else {
          throw new Error("無法識別的資料結構");
        }
      } catch (err) {
        if (scannerStatus) scannerStatus.textContent = "⚠️ 無法解析此 QR Code 內容，請確認為本系統的行李清單碼。";
      }
    }

    if (scannerToggleBtn) {
      scannerToggleBtn.addEventListener("click", () => {
        if (isScanning) {
          stopScanner();
          if (scannerStatus) scannerStatus.textContent = "相機已停止。";
        } else {
          startScanner();
        }
      });
    }

    if (syncOpenBtn) syncOpenBtn.addEventListener("click", () => openSyncModal("export"));
    if (syncCloseBtn) syncCloseBtn.addEventListener("click", closeSyncModal);
    if (syncModal) {
      syncModal.addEventListener("click", (e) => {
        if (e.target === syncModal) closeSyncModal();
      });
    }
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && syncModal && !syncModal.hidden) {
        closeSyncModal();
      }
    });

    syncTabs?.forEach((tab) => {
      tab.addEventListener("click", () => switchSyncTab(tab.dataset.syncTab));
    });

    if (copyUrlBtn) {
      copyUrlBtn.addEventListener("click", () => {
        const syncUrl = `${window.location.origin}${window.location.pathname}#sync=${currentExportCode}`;
        copyTextToClipboard(syncUrl).then(() => {
          const original = copyUrlBtn.textContent;
          copyUrlBtn.textContent = "✓ 已複製連結！";
          setTimeout(() => { copyUrlBtn.textContent = original; }, 2000);
        });
      });
    }

    if (shareBtn) {
      shareBtn.addEventListener("click", () => {
        const syncUrl = `${window.location.origin}${window.location.pathname}#sync=${currentExportCode}`;
        if (navigator.share) {
          navigator.share({
            title: "ECCV 2026 行李準備清單同步",
            text: "ECCV 2026 行李清單最新進度同步",
            url: syncUrl
          }).catch((err) => {
            if (err.name !== "AbortError") {
              copyTextToClipboard(syncUrl).then(() => {
                alert("已複製同步連結至剪貼簿！可直接傳送至另一台裝置。");
              });
            }
          });
        } else {
          copyTextToClipboard(syncUrl).then(() => {
            alert("此裝置未支援原生分享面板，已為您複製同步連結至剪貼簿！可直接透過 AirDrop 或備忘錄開啟。");
          });
        }
      });
    }

    if (importInput) {
      importInput.addEventListener("input", () => {
        const val = importInput.value.trim();
        if (!val) {
          if (importPreview) {
            importPreview.className = "packing-sync-preview-box";
            importPreview.textContent = "請在上方貼上代碼以進行解析。";
          }
          if (applyBtn) applyBtn.disabled = true;
          parsedImportPayload = null;
          return;
        }
        try {
          const parsed = unpackFromUrlSafeBase64(val);
          if (parsed && Array.isArray(parsed.checks)) {
            const total = parsed.custom?.bags
              ? parsed.custom.bags.reduce((acc, b) => acc + (b.items?.length || 0), 0)
              : currentBags.reduce((acc, b) => acc + b.items.length, 0);
            const chk = parsed.checks.length;
            if (importPreview) {
              importPreview.className = "packing-sync-preview-box";
              importPreview.textContent = `✓ 格式正確：包含 ${total} 項物品（${chk} 項已勾選）。點擊下方按鈕套用。`;
            }
            if (applyBtn) applyBtn.disabled = false;
            parsedImportPayload = parsed;
          } else {
            throw new Error();
          }
        } catch (_) {
          if (importPreview) {
            importPreview.className = "packing-sync-preview-box is-error";
            importPreview.textContent = "⚠️ 無法解析此內容，請確認為完整的 Base64 同步碼或包含 #sync= 的網址。";
          }
          if (applyBtn) applyBtn.disabled = true;
          parsedImportPayload = null;
        }
      });
    }

    if (applyBtn) {
      applyBtn.addEventListener("click", () => {
        if (!parsedImportPayload) return;
        if (!window.confirm("確定要將這份同步資料覆蓋到本機嗎？目前的勾選與自訂項目將會被替換。")) return;
        try {
          applyPackingSyncPayload(parsedImportPayload);
          closeSyncModal();
          if (importInput) importInput.value = "";
          applyBtn.disabled = true;
          alert("✓ 行李清單已成功同步至本裝置！");
        } catch (err) {
          alert("套用失敗：" + (err.message || "未知錯誤"));
        }
      });
    }

    function handleUrlHashSync() {
      const hash = window.location.hash;
      if (!hash || !hash.includes("sync=")) return;
      const match = hash.match(/sync=([^&]+)/);
      if (!match) return;
      try {
        const payload = unpackFromUrlSafeBase64(match[1]);
        if (payload && Array.isArray(payload.checks)) {
          const total = payload.custom?.bags
            ? payload.custom.bags.reduce((s, b) => s + (b.items?.length || 0), 0)
            : currentBags.reduce((s, b) => s + b.items.length, 0);
          const chk = payload.checks.length;
          const msg = `【行李清單同步】偵測到來自另一台裝置的同步資料：\n\n• 總物品數：${total} 項\n• 已勾選：${chk} 項\n\n是否立即套用此進度並覆蓋本機？`;
          if (window.confirm(msg)) {
            applyPackingSyncPayload(payload);
            alert("✓ 行李清單已成功同步！");
          }
        }
      } catch (err) {
        console.warn("無法解析網址同步資料", err);
      } finally {
        history.replaceState(null, document.title, window.location.pathname + window.location.search);
      }
    }

    handleUrlHashSync();
    window.addEventListener("hashchange", handleUrlHashSync);

    const viewTabs = document.querySelectorAll("[data-packing-view]");
    const viewPanes = document.querySelectorAll("[data-packing-pane]");

    function switchPackingView(viewName) {
      viewTabs.forEach((tab) => {
        const active = tab.dataset.packingView === viewName;
        tab.classList.toggle("is-active", active);
        tab.setAttribute("aria-selected", active ? "true" : "false");
      });
      viewPanes.forEach((pane) => {
        pane.hidden = pane.dataset.packingPane !== viewName;
      });
      if (viewName === "souvenirs") {
        if (!window.location.hash.includes("sync=")) {
          history.replaceState(null, document.title, window.location.pathname + "#souvenirs");
        }
      } else {
        if (window.location.hash === "#souvenirs") {
          history.replaceState(null, document.title, window.location.pathname);
        }
      }
    }

    viewTabs.forEach((tab) => {
      tab.addEventListener("click", () => switchPackingView(tab.dataset.packingView));
    });

    if (window.location.hash === "#souvenirs") {
      switchPackingView("souvenirs");
    }

    renderBags();
  }

  window.ECCV_PAGES = window.ECCV_PAGES || {};
  window.ECCV_PAGES.packing = {
    getBags: getPackingBags,
    saveBags: savePackingBags,
    render: renderPacking
  };
})();
