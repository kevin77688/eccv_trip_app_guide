const { chromium } = require('playwright');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({ args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream'] });
  try {
    const context = await browser.newContext({ serviceWorkers: 'block', reducedMotion: 'reduce' });
    const page = await context.newPage();
    await context.route('**/*', route => new URL(route.request().url()).hostname === 'localhost' ? route.continue() : route.abort());
    for (const width of [320, 680, 768, 840, 841, 1080]) {
      await page.setViewportSize({ width, height: 800 });
      for (const file of ['index.html', 'days/09-12.html', 'places.html', 'packing.html', 'logistics.html', 'tools.html']) {
        await page.goto(`http://localhost:8080/${file}`);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${file} at ${width}px`);
        const nav = width <= 840 ? '.mobile-nav' : '.main-nav';
        assert.equal(await page.locator(nav).isVisible(), true, `${file}: navigation at ${width}px`);
      }
    }
    await context.close();
    const native = await browser.newContext({ viewport: { width: 390, height: 844 }, permissions: ['camera'], reducedMotion: 'reduce' });
    await native.addInitScript(() => {
      window.Capacitor = {
        isNativePlatform: () => true, getPlatform: () => 'android', isPluginAvailable: () => true,
        Plugins: {
          Biometrics: { checkStatus: async () => ({ isAvailable: false }) },
          OfflineTranslator: {
            status: async () => ({ ready: true, downloadedLanguages: ['en', 'fr', 'da', 'sv', 'fi', 'zh'], requiredCount: 6 }),
            translateText: async ({ text }) => ({ text: `測試翻譯：${text}`, model: 'fixture' })
          }
        }
      };
    });
    const app = await native.newPage();
    await app.goto('http://localhost:8080/tools.html');
    await app.waitForFunction(() => document.querySelector('[data-translate-camera]')?.disabled === false);
    assert.equal(await app.evaluate(async () => (await navigator.serviceWorker.getRegistrations()).length), 0);
    await app.locator('[data-translate-camera]').click();
    await app.waitForFunction(() => document.querySelector('[data-translate-camera-video]')?.srcObject?.getTracks().length > 0);
    await app.evaluate(() => { window.testTracks = document.querySelector('[data-translate-camera-video]').srcObject.getTracks(); });
    await app.locator('.tools-quick-links a[href="#tools-exchange"]').click();
    assert.equal(await app.evaluate(() => window.testTracks.every(track => track.readyState === 'ended')), true);
    await app.locator('.tools-quick-links a[href="#tools-translate"]').click();
    await app.locator('[data-translate-mode-tab="text"]').click();
    await app.locator('[data-translate-input]').fill('Hello');
    await native.setOffline(true);
    await app.locator('[data-translate-text]').click();
    await app.waitForFunction(() => document.querySelector('[data-translate-result]')?.textContent === '測試翻譯：Hello');
    await app.locator('[data-translate-input]').focus();
    await app.setViewportSize({ width: 390, height: 500 });
    await app.waitForFunction(() => document.body.classList.contains('keyboard-open'));
    assert.equal(await app.locator('.mobile-nav').isVisible(), false);
    await app.setViewportSize({ width: 390, height: 844 });
    await app.waitForFunction(() => !document.body.classList.contains('keyboard-open'));
    await native.close();
    console.log('Platform checks passed: 36 responsive layouts, native bridge simulation, camera release, offline translation dispatch and keyboard space.');
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
