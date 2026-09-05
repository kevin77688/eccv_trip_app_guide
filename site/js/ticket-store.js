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
  async function get(name) {
    const saved = await read(name).catch(() => null);
    if (saved) return validate(name, saved);
    const url = window.ECCV_CORE.assetPath(`assets/tickets/${name}`);
    // Existing installations may already have a cached or bundled copy.
    const cached = 'caches' in window ? await caches.match(url) : null;
    if (cached) return validate(name, await cached.arrayBuffer());
    if (window.ECCV_ANDROID?.isNative()) {
      const response = await fetch(url);
      if (response.ok) return validate(name, await response.arrayBuffer());
    }
    throw new Error('這台裝置尚未匯入此票券。請先選擇對應的 .enc 檔。');
  }
  async function availability() {
    return Promise.all((trip.tickets || []).filter(t => !t.hidden).map(async ticket => {
      try { await get(ticket.encFile); return { ticket, ready: true }; }
      catch (_) { return { ticket, ready: false }; }
    }));
  }
  window.ECCV_TICKET_STORE = { read, save, get, availability, validate };
})();
