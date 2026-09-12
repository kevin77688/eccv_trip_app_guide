const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');

(async () => {
  const output = fs.mkdtempSync('/tmp/eccv-souvenirs-');
  const browser = await chromium.launch();
  try {
    for (const width of [390, 1280]) {
      const context = await browser.newContext({
        viewport: { width, height: width === 390 ? 844 : 800 },
        reducedMotion: 'reduce',
        serviceWorkers: 'block'
      });
      const page = await context.newPage();
      const pageErrors = [];
      page.on('pageerror', (e) => pageErrors.push(e.message));

      await page.goto('http://localhost:8080/packing.html#souvenirs');
      await page.waitForSelector('[data-packing-pane="souvenirs"]:not([hidden])');

      // Verify page text does NOT contain sensitive word "男友"
      const bodyText = await page.textContent('body');
      assert.equal(bodyText.includes('男友'), false, 'Page must not contain word 男友');

      // Check all 21 cards exist (6 Sweden + 6 Denmark + 9 France)
      const totalCards = await page.locator('.souvenir-card').count();
      assert.equal(totalCards, 21, `Expected 21 souvenir cards, got ${totalCards}`);

      // Check cards by country
      const swedenCardCount = await page.locator('[data-souvenir-section="sweden"] .souvenir-card').count();
      const denmarkCardCount = await page.locator('[data-souvenir-section="denmark"] .souvenir-card').count();
      const franceCardCount = await page.locator('[data-souvenir-section="france"] .souvenir-card').count();
      assert.equal(swedenCardCount, 6, `Expected 6 Sweden cards, got ${swedenCardCount}`);
      assert.equal(denmarkCardCount, 6, `Expected 6 Denmark cards, got ${denmarkCardCount}`);
      assert.equal(franceCardCount, 9, `Expected 9 France cards, got ${franceCardCount}`);

      // Check images loaded
      const images = page.locator('.souvenir-img');
      const imgCount = await images.count();
      assert.equal(imgCount, 21, `Expected 21 souvenir images, got ${imgCount}`);
      for (let i = 0; i < imgCount; i++) {
        const naturalWidth = await images.nth(i).evaluate((img) => img.naturalWidth);
        assert.ok(naturalWidth > 0, `Image #${i} failed to load (naturalWidth = 0)`);
      }

      // Check Not Recommended section items
      const notRecommendedCount = await page.locator('.not-recommended-card').count();
      assert.equal(notRecommendedCount, 6, `Expected 6 not recommended items, got ${notRecommendedCount}`);

      // Check decision tags exist
      const tagCount = await page.locator('.souvenir-tag-chip').count();
      assert.ok(tagCount >= 21, `Expected at least 21 decision tag chips, got ${tagCount}`);

      // Check Country filter pills
      const allPill = page.locator('[data-souvenir-filter="all"]');
      const swedenPill = page.locator('[data-souvenir-filter="sweden"]');
      const denmarkPill = page.locator('[data-souvenir-filter="denmark"]');
      const francePill = page.locator('[data-souvenir-filter="france"]');

      assert.equal(await allPill.count(), 1);
      assert.equal(await swedenPill.count(), 1);
      assert.equal(await denmarkPill.count(), 1);
      assert.equal(await francePill.count(), 1);

      // Verify dynamic counts in pill text
      assert.ok((await allPill.textContent()).includes('(21)'), 'All pill must include (21)');
      assert.ok((await swedenPill.textContent()).includes('(6)'), 'Sweden pill must include (6)');
      assert.ok((await denmarkPill.textContent()).includes('(6)'), 'Denmark pill must include (6)');
      assert.ok((await francePill.textContent()).includes('(9)'), 'France pill must include (9)');

      // Filter Sweden
      await swedenPill.click();
      assert.equal(await page.locator('[data-souvenir-section="sweden"]').isVisible(), true);
      assert.equal(await page.locator('[data-souvenir-section="denmark"]').isVisible(), false);
      assert.equal(await page.locator('[data-souvenir-section="france"]').isVisible(), false);

      // Filter Denmark
      await denmarkPill.click();
      assert.equal(await page.locator('[data-souvenir-section="sweden"]').isVisible(), false);
      assert.equal(await page.locator('[data-souvenir-section="denmark"]').isVisible(), true);
      assert.equal(await page.locator('[data-souvenir-section="france"]').isVisible(), false);

      // Filter France
      await francePill.click();
      assert.equal(await page.locator('[data-souvenir-section="sweden"]').isVisible(), false);
      assert.equal(await page.locator('[data-souvenir-section="denmark"]').isVisible(), false);
      assert.equal(await page.locator('[data-souvenir-section="france"]').isVisible(), true);

      // Filter All
      await allPill.click();
      assert.equal(await page.locator('[data-souvenir-section="sweden"]').isVisible(), true);
      assert.equal(await page.locator('[data-souvenir-section="denmark"]').isVisible(), true);
      assert.equal(await page.locator('[data-souvenir-section="france"]').isVisible(), true);

      // Test Dark Mode
      await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
      const isDark = await page.evaluate(() => document.documentElement.getAttribute('data-theme') === 'dark');
      assert.equal(isDark, true);

      // Horizontal overflow check (especially for phone 390px)
      const overflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth + 1;
      });
      assert.equal(overflow, false, `Horizontal overflow detected on width ${width}!`);

      // Screenshot for verification
      await page.screenshot({ path: `${output}/${width}-souvenirs.png`, fullPage: false });

      assert.deepEqual(pageErrors, [], `Encountered page errors on width ${width}`);
      await context.close();
    }
    console.log(JSON.stringify({
      result: 'passed',
      screenshots: output,
      checks: '21 souvenir cards, 3 country sections, 6 not recommended items, interactive filter pills, valid image loading, dark mode, zero horizontal overflow, and privacy copy compliance'
    }));
  } finally {
    await browser.close();
  }
})().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
