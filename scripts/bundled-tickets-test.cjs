const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');

(async () => {
  const output = fs.mkdtempSync('/tmp/eccv-bundled-tickets-');
  const browser = await chromium.launch();
  try {
    for (const [name, width, native] of [['phone', 390, false], ['desktop', 1280, false], ['android-bridge', 390, true]]) {
      const context = await browser.newContext({ viewport: { width, height: 844 }, serviceWorkers: 'block', reducedMotion: 'reduce' });
      if (native) await context.addInitScript(() => { window.Capacitor = { isNativePlatform: () => true, getPlatform: () => 'android', isPluginAvailable: () => false }; });
      const page = await context.newPage();
      const errors = []; page.on('pageerror', error => errors.push(error.message));
      await page.goto('http://localhost:8080/days/09-12.html');
      assert.equal(await page.evaluate(() => window.ECCV_TICKET_STORE.read('stromma-canal-tour.enc')), undefined);
      await page.locator('[data-ticket-id="stromma-canal-tour"]').first().click();
      await page.waitForFunction(() => document.querySelector('[data-ticket-availability]')?.textContent.includes('票券已載入'));
      assert.equal(await page.locator('[data-ticket-import-options]').isVisible(), false);
      await page.screenshot({ path: `${output}/${name}.png`, animations: 'disabled' });
      const loaded = await page.evaluate(async () => {
        const names = Object.keys(window.TRIP.ticketDigests);
        const files = await Promise.all(names.map(name => window.ECCV_TICKET_STORE.get(name)));
        return { count: files.length, allPresent: files.every(file => file.byteLength > 44) };
      });
      assert.deepEqual(loaded, { count: 13, allPresent: true });
      await context.setOffline(true);
      assert.equal(await page.evaluate(async () => (await window.ECCV_TICKET_STORE.availability()).every(file => file.ready)), true);
      assert.deepEqual(errors, []);
      await context.close();
    }

    // Verify decryption using a synthetic image, without exposing any real ticket or password.
    const password = crypto.randomBytes(20).toString('hex');
    const salt = crypto.randomBytes(16), iv = crypto.randomBytes(12);
    const mime = Buffer.from('image/png');
    const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aY9sAAAAASUVORK5CYII=', 'base64');
    const payload = Buffer.concat([Buffer.from([mime.length]), mime, png]);
    const cipher = crypto.createCipheriv('aes-256-gcm', crypto.pbkdf2Sync(password, salt, 600000, 32, 'sha256'), iv);
    const fixture = Buffer.concat([salt, iv, cipher.update(payload), cipher.final(), cipher.getAuthTag()]);
    const digest = crypto.createHash('sha256').update(fixture).digest('hex');
    const context = await browser.newContext({ serviceWorkers: 'block' });
    const page = await context.newPage();
    await page.route('**/assets/tickets/stromma-canal-tour.enc*', route => route.fulfill({ body: fixture, contentType: 'application/octet-stream' }));
    await page.goto('http://localhost:8080/days/09-12.html');
    await page.evaluate(digest => { window.TRIP.ticketDigests['stromma-canal-tour.enc'] = digest; }, digest);
    const result = await page.evaluate(async password => {
      const ticket = await window.ECCV_TICKETS.decrypt('../assets/tickets/stromma-canal-tour.enc', password);
      URL.revokeObjectURL(ticket.objectUrl);
      return { mime: ticket.mimeType, length: ticket.fileBytes.length };
    }, password);
    assert.deepEqual(result, { mime: 'image/png', length: png.length });
    await context.close();
    console.log(JSON.stringify({ result: 'passed', screenshots: output, checks: 'all 13 bundled files, direct opening without import, offline persistence and authenticated decryption' }));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
