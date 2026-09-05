const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
(async () => {
  const output = fs.mkdtempSync('/tmp/eccv-offline-');
  const browser = await chromium.launch();
  try {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto('http://localhost:8080/tools.html');
    await page.waitForFunction(() => window.ECCV_OFFLINE && window.ECCV_CORE);
    assert.equal(await page.locator('.tools-block:visible').count(), 1);
    assert.equal(await page.locator('.tools-block:visible').getAttribute('id'), 'tools-translate');
    await page.locator('.tools-quick-links a[href="#tools-exchange"]').click();
    assert.equal(await page.locator('.tools-block:visible').getAttribute('id'), 'tools-exchange');
    await page.locator('[data-exchange-amount]').fill('250');
    await page.locator('.tools-quick-links a[href="#tools-translate"]').click();
    await page.locator('.tools-quick-links a[href="#tools-exchange"]').click();
    assert.equal(await page.locator('[data-exchange-amount]').inputValue(), '250');
    await page.evaluate(async () => { await navigator.serviceWorker.ready; });
    await page.locator('.tools-quick-links a[href="#tools-update"]').click();
    await page.waitForFunction(() => document.querySelector('[data-offline-itinerary]')?.textContent.includes('已儲存'));
    assert.match(await page.locator('[data-offline-tickets]').textContent(), /0 \/ 10/);
    assert.match(await page.locator('[data-offline-languages]').textContent(), /Android App/);
    await page.screenshot({ path: `${output}/phone-readiness.png`, animations: 'disabled' });
    await context.setOffline(true);
    for (const file of ['index.html', 'days/09-07.html', 'days/09-12.html', 'tools.html#tools-update']) {
      await page.goto(`http://localhost:8080/${file}`);
      await page.locator('.page-shell').waitFor();
      assert.ok(await page.locator('.page-shell').innerText());
    }
    await page.waitForFunction(() => document.querySelector('[data-offline-itinerary]')?.textContent.includes('已儲存'));
    const result = await page.evaluate(() => window.ECCV_CORE.checkPwaUpdate());
    assert.match(result.message, /無法確認/);
    await page.locator('.tools-quick-links a[href="#tools-translate"]').click();
    assert.equal(await page.locator('.tools-block:visible').count(), 1);
    assert.deepEqual(errors, []);
    await context.close();
    console.log(JSON.stringify({ result: 'passed', screenshots: output, checks: 'tool selection, input preservation, complete precache, offline navigation and honest update failure' }));
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
