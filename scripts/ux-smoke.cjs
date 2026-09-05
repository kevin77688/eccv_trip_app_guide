const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

(async () => {
  const output = fs.mkdtempSync('/tmp/eccv-ux-');
  const browser = await chromium.launch({ headless: true });
  const pages = ['index.html', 'places.html', 'logistics.html', 'packing.html', 'tools.html', ...fs.readdirSync(path.join(__dirname, '../site/days')).filter(x => x.endsWith('.html')).map(x => `days/${x}`)];
  let checked = 0;
  try {
    for (const [name, width, height] of [['phone', 390, 844], ['desktop', 1280, 800]]) {
      const context = await browser.newContext({ viewport: { width, height }, isMobile: name === 'phone', hasTouch: name === 'phone', serviceWorkers: 'block', reducedMotion: 'reduce' });
      await context.route('**/*', route => new URL(route.request().url()).hostname === 'localhost' ? route.continue() : route.abort());
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      for (const file of pages) {
        const response = await page.goto(`http://localhost:8080/${file}`, { waitUntil: 'load' });
        assert.equal(response.status(), 200, file);
        await page.locator('.page-shell').waitFor();
        assert.ok(await page.locator('.page-shell').innerText(), `${file}: rendered content`);
        for (const theme of ['light', 'dark']) {
          await page.evaluate(theme => window.ECCV_CORE.applyTheme(theme, false), theme);
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${file}: ${name} ${theme} overflow`);
          if (['index.html', 'days/09-12.html', 'tools.html'].includes(file)) await page.screenshot({ path: `${output}/${name}-${file.replaceAll('/', '-')}-${theme}.png`, animations: 'disabled' });
          checked++;
        }
        if (name === 'phone') {
          assert.equal(await page.locator('.mobile-nav a').count(), 5, `${file}: navigation`);
          await page.locator('[data-search-toggle]').click();
          await page.locator('#trip-search').fill('巴黎');
          assert.ok(await page.locator('.search-results a').count(), `${file}: search`);
          await page.locator('#trip-search').press('Escape');
          assert.equal(await page.locator('[data-search-toggle]').getAttribute('aria-expanded'), 'false');
        }
      }
      assert.deepEqual(errors, [], name);
      await context.close();
    }
    console.log(JSON.stringify({ checked, screenshots: output, result: 'passed' }));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
