(function () {
  'use strict';
  async function itineraryStatus() {
    if (window.ECCV_ANDROID?.isNative()) {
      const paths = ['js/data.js', 'js/core.js', 'js/journey.js', 'js/tickets.js', 'vendor/pdfjs/pdf.min.js', ...Object.keys(window.TRIP.days).map(key => `days/${key}.html`)];
      const results = await Promise.all(paths.map(async path => {
        try { const response = await fetch(window.ECCV_CORE.assetPath(path)); return response.ok; } catch (_) { return false; }
      }));
      return results.every(Boolean) ? '14 天行程與票券閱讀工具已內建' : '內建檔案不完整，請重新安裝最新 APK';
    }
    const registration = await navigator.serviceWorker?.getRegistration();
    if (!registration?.active) return '尚未完成離線儲存，請連線後重新檢查';
    return new Promise(resolve => {
      const channel = new MessageChannel();
      const timer = setTimeout(() => { channel.port1.close(); resolve('暫時無法確認，請重新整理後再檢查'); }, 5000);
      channel.port1.onmessage = event => {
        clearTimeout(timer); channel.port1.close();
        const data = event.data;
        resolve(data.ready ? '行程與閱讀工具已儲存，可離線開啟' : `還有 ${data.missing?.length || '部分'} 個檔案未儲存，請連線後重新整理`);
      };
      registration.active.postMessage({ type: 'OFFLINE_STATUS' }, [channel.port2]);
    });
  }
  function setup() {
    const section = document.querySelector('#tools-update');
    if (!section) return;
    const box = document.createElement('section');
    box.className = 'offline-readiness';
    box.innerHTML = `<div class="offline-readiness-heading"><h3>離線準備</h3><button type="button" class="button button-secondary" data-offline-check>重新檢查</button></div><p data-network-status></p><dl><div><dt>行程與閱讀工具</dt><dd data-offline-itinerary>尚未檢查</dd></div><div><dt>票券檔案</dt><dd data-offline-tickets>尚未檢查</dd></div><div><dt>翻譯語言包</dt><dd data-offline-languages>尚未檢查</dd></div></dl><p>地圖底圖與即時天氣需要網路；站點順序可離線閱讀。匯率使用上次成功取得的資料。</p><div class="journey-actions"><a class="button button-secondary" href="${window.ECCV_CORE.logisticsLink}#tickets">匯入票券</a><a class="button button-secondary" href="#tools-translate">準備離線翻譯</a></div>`;
    section.prepend(box);
    const network = () => { box.querySelector('[data-network-status]').textContent = navigator.onLine ? '裝置目前有網路連線；服務是否可用仍以實際回應為準。' : '裝置目前離線。'; };
    let running = false;
    const check = async () => {
      if (running) return;
      running = true;
      const button = box.querySelector('[data-offline-check]');
      button.disabled = true;
      network();
      const status = (selector, task) => Promise.resolve().then(task).then(text => { box.querySelector(selector).textContent = text; }).catch(() => { box.querySelector(selector).textContent = '無法確認，請重試'; });
      await Promise.all([
        status('[data-offline-itinerary]', itineraryStatus),
        status('[data-offline-tickets]', async () => {
          const files = await window.ECCV_TICKET_STORE.availability();
          const ready = files.filter(file => file.ready).length;
          return `${ready} / ${files.length} 份已在這台裝置${ready < files.length ? '，請匯入缺少的票券' : '，出示時仍需密碼'}`;
        }),
        status('[data-offline-languages]', async () => {
          const translator = window.ECCV_ANDROID?.getOfflineTranslator();
          if (!translator) return '離線翻譯需使用 Android App；網頁翻譯需要網路';
          const data = await translator.status();
          return data.ready ? '語言包已備妥，可離線翻譯' : `${data.downloadedLanguages?.length || 0} / ${data.requiredCount || 6} 個語言包，請到翻譯頁下載`;
        })
      ]);
      button.disabled = false;
      running = false;
    };
    box.querySelector('[data-offline-check]').addEventListener('click', check);
    document.addEventListener('toolchange', event => { if (event.detail === 'tools-update') check(); });
    window.addEventListener('online', network);
    window.addEventListener('offline', network);
    window.addEventListener('tickets-changed', () => { if (!section.hidden) check(); });
    network();
    if (!section.hidden) check();
  }
  window.ECCV_OFFLINE = { setup, itineraryStatus };
})();
