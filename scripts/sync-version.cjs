const fs = require('node:fs');
const path = require('node:path');
const version = process.argv[2];
if (!/^\d{8}-\d{2}$/.test(version || '')) throw new Error('Usage: node scripts/sync-version.cjs YYYYMMDD-NN');
const site = path.join(__dirname, '../site');
for (const directory of [site, path.join(site, 'days')]) {
  for (const name of fs.readdirSync(directory).filter(name => name.endsWith('.html'))) {
    const file = path.join(directory, name);
    const prefix = directory === site ? '' : '../';
    let html = fs.readFileSync(file, 'utf8').replace(/\?v=\d{8}-\d{2}/g, `?v=${version}`);
    if (!html.includes('css/ux.css')) html = html.replace('</head>', `  <link rel="stylesheet" href="${prefix}css/ux.css?v=${version}" />\n  </head>`);
    if (name === 'index.html') {
      html = html.replace(/\s*<meta name="trip-sync"[^>]*>/g, '');
      html = html.replace('</head>', `  <meta name="trip-sync" content="${version}" />\n  </head>`);
    }
    fs.writeFileSync(file, html);
  }
}
for (const relative of ['sw.js', 'js/core.js', 'js/pages/tools.js']) {
  const file = path.join(site, relative);
  let text = fs.readFileSync(file, 'utf8').replace(/v\d{8}-\d{2}/g, `v${version}`);
  if (relative === 'sw.js' && !text.includes("'./css/ux.css'")) text = text.replace("'./css/styles.css',", "'./css/styles.css',\n  './css/ux.css',");
  fs.writeFileSync(file, text);
}
