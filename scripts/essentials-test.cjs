const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const crypto = require('node:crypto');
(async () => {
  const output = fs.mkdtempSync('/tmp/eccv-essentials-');
  const browser = await chromium.launch();
  const fixture = crypto.randomBytes(128);
  const digest = crypto.createHash('sha256').update(fixture).digest('hex');
  try {
    for (const [name, width, height] of [['phone', 390, 844], ['desktop', 1280, 800]]) {
      const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce', serviceWorkers: 'block' });
      const page = await context.newPage();
      await page.goto('http://localhost:8080/days/09-12.html');
      await page.evaluate(digest => { window.TRIP.ticketDigests['stromma-canal-tour.enc'] = digest; }, digest);
      await page.locator('.essentials-toggle').click();
      await page.locator('#essentials-dialog').waitFor();
      assert.match(await page.locator('#essentials-dialog').innerText(), /Hostellerie Saint Vincent/);
      await page.screenshot({ path: `${output}/${name}-essentials.png`, animations: 'disabled' });
      await page.locator('#essentials-date').selectOption('09-13');
      assert.match(await page.locator('#essentials-dialog').innerText(), /Sure Hotel/);
      await page.locator('#essentials-date').selectOption('09-12');
      await page.locator('[data-essential-ticket="stromma-canal-tour"]').click();
      await page.locator('#ticket-modal-root').waitFor();
      await page.waitForFunction(() => document.querySelector('[data-ticket-availability]')?.textContent.includes('尚未匯入'));
      await page.locator('[data-ticket-import]').setInputFiles({ name: 'wrong.enc', mimeType: 'application/octet-stream', buffer: Buffer.alloc(100) });
      await page.waitForFunction(() => document.querySelector('[data-ticket-import-status]')?.textContent.includes('請選擇 stromma-canal-tour.enc'));
      await page.locator('[data-ticket-import]').setInputFiles({ name: 'stromma-canal-tour.enc', mimeType: 'application/octet-stream', buffer: Buffer.alloc(128) });
      await page.waitForFunction(() => document.querySelector('[data-ticket-import-status]')?.textContent.includes('票券檔案不符'));
      await page.locator('[data-ticket-import]').setInputFiles({ name: 'stromma-canal-tour.enc', mimeType: 'application/octet-stream', buffer: fixture });
      await page.waitForFunction(() => document.querySelector('[data-ticket-import-status]')?.textContent.includes('已匯入 1'));
      await page.screenshot({ path: `${output}/${name}-ticket.png`, animations: 'disabled' });
      await page.goBack();
      await page.locator('#ticket-modal-root').waitFor({ state: 'detached' });
      assert.match(page.url(), /09-12.html$/);
      await context.setOffline(true);
      assert.equal(await page.evaluate(async () => (await window.ECCV_TICKET_STORE.availability()).find(x => x.ticket.id === 'stromma-canal-tour').ready), true);
      assert.equal(await page.evaluate(async () => (await window.ECCV_TICKET_STORE.availability()).find(x => x.ticket.id === 'louvre').ready), false);
      await context.setOffline(false);
      await page.reload();
      await page.evaluate(digest => { window.TRIP.ticketDigests['stromma-canal-tour.enc'] = digest; }, digest);
      assert.equal(await page.evaluate(async () => (await window.ECCV_TICKET_STORE.availability()).find(x => x.ticket.id === 'stromma-canal-tour').ready), true);
      await context.close();
    }
    console.log(JSON.stringify({ result: 'passed', screenshots: output, checks: 'stay dates, modal back navigation, wrong-file rejection, verified import, reload persistence and offline availability' }));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
