const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
(async () => {
  const output = fs.mkdtempSync('/tmp/eccv-places-');
  const browser = await chromium.launch();
  try {
    for (const width of [390, 1280]) {
      const context = await browser.newContext({ viewport: { width, height: 844 }, reducedMotion: 'reduce', serviceWorkers: 'block' });
      const page = await context.newPage();
      await page.goto('http://localhost:8080/places.html');
      await page.locator('[data-place-view="compact"]').click();
      await page.locator('[data-place-filter="paris"]').click();
      await page.locator('[data-place-search]').fill('羅浮宮');
      assert.ok(await page.locator('.place-card:visible').count() < 5);
      assert.equal(await page.locator('#place-louvre').isVisible(), true);
      const toggle = page.locator('#place-louvre .place-compact-expand-btn');
      await toggle.focus(); await page.keyboard.press('Enter');
      assert.equal(await toggle.getAttribute('aria-expanded'), 'true');
      await page.screenshot({ path: `${output}/${width}-places.png`, animations: 'disabled' });
      await page.goto('http://localhost:8080/index.html');
      await page.goto('http://localhost:8080/places.html');
      assert.equal(await page.locator('[data-place-search]').inputValue(), '羅浮宮');
      assert.equal(await page.locator('[data-place-filter="paris"]').getAttribute('aria-pressed'), 'true');
      await page.goto('http://localhost:8080/places.html#place-tivoli');
      await page.locator('#place-tivoli').waitFor();
      assert.equal(await page.locator('#place-tivoli').isVisible(), true);
      assert.equal(await page.locator('#place-tivoli .place-compact-expand-btn').getAttribute('aria-expanded'), 'true');
      await page.goto('http://localhost:8080/days/09-12.html');
      await page.locator('[data-route-details] > summary').click();
      await page.evaluate(() => window.scrollTo({ top: 600, behavior: 'instant' }));
      await page.goto('http://localhost:8080/index.html');
      await page.goto('http://localhost:8080/days/09-12.html');
      await page.waitForFunction(() => scrollY > 500);
      assert.equal(await page.locator('[data-route-details]').getAttribute('open'), '');
      await context.close();
    }
    console.log(JSON.stringify({ result: 'passed', screenshots: output, checks: 'Chinese search, keyboard expansion, filter restoration, direct-link priority, scroll and details restoration' }));
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
