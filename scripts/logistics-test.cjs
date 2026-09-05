const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
(async () => {
  const output = fs.mkdtempSync('/tmp/eccv-logistics-');
  const browser = await chromium.launch();
  try {
    for (const width of [390, 1280]) {
      const context = await browser.newContext({ viewport: { width, height: 844 }, reducedMotion: 'reduce', serviceWorkers: 'block' });
      const page = await context.newPage();
      const errors = []; page.on('pageerror', e => errors.push(e.message));
      await page.goto('http://localhost:8080/logistics.html');
      assert.equal(await page.locator('[data-logistics-filter="today"]').getAttribute('aria-selected'), 'true');
      await page.locator('[data-logistics-date]').selectOption('09-12');
      const text = await page.locator('[data-logistics-today]').innerText();
      assert.match(text, /Hostellerie Saint Vincent/);
      assert.match(text, /FR9267/);
      await page.screenshot({ path: `${output}/${width}-logistics.png`, animations: 'disabled' });
      await page.locator('[data-logistics-today] a[href="#tickets"]').click();
      await page.locator('#tickets').waitFor();
      assert.equal(await page.locator('[data-logistics-section="today"]').isVisible(), false);
      if (width < 681) await page.locator('[data-logistics-category]').selectOption('stays');
      else await page.locator('[data-logistics-filter="stays"]').click();
      await page.goto('http://localhost:8080/index.html');
      await page.goto('http://localhost:8080/logistics.html');
      assert.equal(await page.locator('#stays').isVisible(), true);
      if (width < 681) await page.locator('[data-logistics-category]').selectOption('today');
      else await page.locator('[data-logistics-filter="today"]').click();
      assert.equal(await page.locator('[data-logistics-date]').inputValue(), '09-12');
      await page.goto('http://localhost:8080/logistics.html#emergency');
      await page.locator('#emergency').waitFor();
      assert.equal(await page.locator('[data-logistics-section="today"]').isVisible(), false);
      assert.deepEqual(errors, []);
      await context.close();
    }
    console.log(JSON.stringify({ result: 'passed', screenshots: output, checks: 'day-specific bookings, accommodation, flight, category switching, state recovery and emergency direct link' }));
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
