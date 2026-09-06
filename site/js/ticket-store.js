(function () {
  'use strict';
  const trip = window.TRIP;
  let database;
  function open() {
    if (database) return database;
    database = new Promise((resolve, reject) => {
      const request = indexedDB.open('eccv-private-tickets', 1);
      request.onupgradeneeded = () => request.result.createObjectStore('files');
      request.onerror = () => { database = null; reject(new Error('無法開啟票券儲存空間，請確認未使用私密瀏覽。')); };
      request.onblocked = () => { database = null; reject(new Error('請關閉其他旅程分頁後重試。')); };
      request.onsuccess = () => {
        const db = request.result;
        db.onversionchange = () => { db.close(); database = null; };
        resolve(db);
      };
    });
    return database;
  }
  async function read(name) {
    const db = await open();
    return new Promise((resolve, reject) => {
      const request = db.transaction('files').objectStore('files').get(name);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  async function validate(name, buffer) {
    if (!(buffer instanceof ArrayBuffer) || buffer.byteLength < 44 || buffer.byteLength > 25 * 1024 * 1024) throw new Error('票券檔案不完整或超過 25 MB。');
    const expected = trip.ticketDigests?.[name];
    if (!expected) throw new Error('這份檔案不在旅程票券清單中，請選擇原始 .enc 檔。');
    const digest = await crypto.subtle.digest('SHA-256', buffer);
    const actual = [...new Uint8Array(digest)].map(n => n.toString(16).padStart(2, '0')).join('');
    if (actual !== expected) throw new Error('票券檔案不符或已損毀，請重新選擇原始 .enc 檔。');
    return buffer;
  }
  async function save(files) {
    const verified = [];
    for (const file of files) verified.push([file.name, await validate(file.name, await file.arrayBuffer())]);
    const db = await open();
    await new Promise((resolve, reject) => {
      const transaction = db.transaction('files', 'readwrite');
      for (const [name, buffer] of verified) transaction.objectStore('files').put(buffer, name);
      transaction.oncomplete = resolve;
      transaction.onerror = () => reject(new Error('儲存失敗，請確認裝置還有可用空間。'));
      transaction.onabort = () => reject(new Error('儲存已中止，請重試。'));
    });
    window.dispatchEvent(new Event('tickets-changed'));
    return verified.length;
  }
  async function get(name, { localOnly = false } = {}) {
    if (!trip.ticketDigests?.[name]) throw new Error('找不到這份票券。');
    const saved = await read(name).catch(() => null);
    if (saved) {
      try { return await validate(name, saved); } catch (_) { /* Try the current bundled file if an older import no longer matches. */ }
    }
    const url = window.ECCV_CORE.assetPath(`assets/tickets/${name}`);
    try {
      const cached = 'caches' in window ? await caches.match(url, { ignoreSearch: true }) : null;
      if (cached) return await validate(name, await cached.arrayBuffer());
    } catch (_) { /* A stale cache must not prevent reading the current bundle. */ }
    if (!localOnly || window.ECCV_ANDROID?.isNative()) {
      try {
        const response = await fetch(`${url}?v=${trip.ticketDigests[name]}`);
        if (response.ok) {
          const buffer = await validate(name, await response.arrayBuffer());
          // Keep website tickets available on later offline visits, even before PWA installation finishes.
          try { await save([{ name, arrayBuffer: async () => buffer }]); } catch (_) { /* The bundled file can still be shown when storage is unavailable. */ }
          return buffer;
        }
      } catch (_) { /* Show the recoverable error below. */ }
    }
    throw new Error('票券暫時無法載入。網頁版請連線後重試；App 請確認已安裝最新版。');
  }
  async function availability() {
    return Promise.all((trip.tickets || []).filter(t => !t.hidden).map(async ticket => {
      try { await get(ticket.encFile, { localOnly: true }); return { ticket, ready: true }; }
      catch (_) { return { ticket, ready: false }; }
    }));
  }
  window.ECCV_TICKET_STORE = { read, save, get, availability, validate };
})();
