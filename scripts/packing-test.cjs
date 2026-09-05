const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
(async () => {
  const output = fs.mkdtempSync('/tmp/eccv-packing-');
  const browser = await chromium.launch();
  try {
    for (const width of [390, 1280]) {
      const context = await browser.newContext({ viewport: { width, height: 844 }, reducedMotion: 'reduce', serviceWorkers: 'block' });
      const page = await context.newPage();
      const errors = []; page.on('pageerror', e => errors.push(e.message));
      await page.goto('http://localhost:8080/packing.html');
      assert.equal(await page.locator('[data-packing-filter="todo"]').getAttribute('aria-pressed'), 'true');
      await page.locator('[data-bag-filter="tiny"]').click();
      await page.locator('#bag-tiny [data-packing-item]:visible input').first().check();
      assert.match(await page.locator('[data-bag-filter-count="tiny"]').textContent(), /^1\//);
      await page.screenshot({ path: `${output}/${width}-packing.png`, animations: 'disabled' });
      await page.goto('http://localhost:8080/index.html');
      await page.goto('http://localhost:8080/packing.html');
      assert.equal(await page.locator('[data-bag-filter="tiny"]').getAttribute('aria-selected'), 'true');
      assert.match(await page.locator('[data-bag-filter-count="tiny"]').textContent(), /^1\//);
      await page.locator('.packing-options > summary').click();
      await page.locator('[data-packing-reset]').click();
      await page.locator('#eccv-confirm-modal').waitFor();
      await page.keyboard.press('Escape');
      await page.waitForFunction(() => !document.getElementById('eccv-confirm-modal') && history.state?.eccvModal !== 'confirm');
      assert.match(await page.locator('[data-bag-filter-count="tiny"]').textContent(), /^1\//);
      await page.locator('[data-packing-sync-open]').click();
      await page.locator('#packing-sync-modal').waitFor();
      assert.equal(await page.locator('[data-sync-qr-container] svg').count(), 1);
      await page.goBack();
      await page.locator('#packing-sync-modal').waitFor({ state: 'hidden' });
      assert.match(page.url(), /packing.html$/);
      const heading = page.locator('[data-packing-bag-toggle="tiny"]');
      await heading.focus(); await page.keyboard.press('Enter');
      assert.equal(await heading.getAttribute('aria-expanded'), 'false');
      await page.keyboard.press('Enter');
      assert.equal(await heading.getAttribute('aria-expanded'), 'true');
      assert.deepEqual(errors, []);
      await context.close();
    }
    console.log(JSON.stringify({ result: 'passed', screenshots: output, checks: 'remaining items, bag and progress persistence, cancel reset, QR rendering, back navigation and keyboard accordion' }));
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
