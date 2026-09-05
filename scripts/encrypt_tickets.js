const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PDF_DIR = path.join(__dirname, '..', 'pdf');
const OUT_DIR = path.join(__dirname, '..', 'site', 'assets', 'tickets');
const PASSWORD = process.env.TICKET_PASSWORD;

if (!PASSWORD) {
  console.error('[Error] 請設定 TICKET_PASSWORD 環境變數。');
  console.error('範例: TICKET_PASSWORD=your_password node scripts/encrypt_tickets.js');
  process.exit(1);
}

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

// Exact mapping from authentic source PDF files to output encrypted assets
const TICKET_DEFINITIONS = [
  {
    id: 'emirates-flights',
    encFile: 'emirates-flights.enc',
    sourcePattern: /Emirates_.*official-e-ticket\.pdf$/,
    title: '阿聯酋航空官方電子機票'
  },
  {
    id: 'stromma-canal-tour',
    encFile: 'stromma-canal-tour.enc',
    sourcePdf: '2026-09-12_15-00_Stromma-Classic-Canal-Tour_QR-ticket.pdf',
    title: 'Stromma 經典運河遊船門票'
  },
  {
    id: 'church-our-saviour',
    encFile: 'church-our-saviour.enc',
    sourcePdf: '2026-09-12_16-30_Church-of-Our-Saviour-Tower_QR-tickets.pdf',
    title: '救主堂螺旋塔登頂門票'
  },
  {
    id: 'ryanair-fr9267',
    encFile: 'ryanair-fr9267.enc',
    sourcePdf: '2026-09-12_20-05_FR9267_Copenhagen-Beauvais_itinerary.pdf',
    title: 'Ryanair 航班 FR9267 訂位行程單'
  },
  {
    id: 'sainte-chapelle',
    encFile: 'sainte-chapelle.enc',
    sourcePdf: '2026-09-14_15-00_Sainte-Chapelle_QR-tickets.pdf',
    title: 'Sainte-Chapelle 聖徒禮拜堂門票'
  },
  {
    id: 'arc-de-triomphe',
    encFile: 'arc-de-triomphe.enc',
    sourcePdf: '2026-09-16_10-50_Arc-de-Triomphe_QR-tickets.pdf',
    title: '巴黎凱旋門登頂門票'
  },
  {
    id: 'louvre',
    encFile: 'louvre.enc',
    sourcePdf: '2026-09-16_16-30_Louvre_QR-tickets.pdf',
    title: '羅浮宮博物館參觀門票'
  },
  {
    id: 'versailles',
    encFile: 'versailles.enc',
    sourcePdf: '2026-09-17_10-00_Versailles-Passport_QR-tickets-and-audioguides.pdf',
    title: '凡爾賽宮 Passport 門票與語音導覽'
  },
  {
    id: 'k7-pass',
    encFile: 'k7-pass.enc',
    sourcePdf: '2026-09-07_to_09-13_K7-week-37_digital-pass.pdf',
    title: 'K7 Week 37 青年文化通行證'
  },
  {
    id: 'ek367-boarding-pass',
    encFile: 'ek367-boarding-pass.enc',
    sourcePdf: '2026-09-06_to_09-07_EK367-EK151_TPE-DXB-CPH_boarding-passes.pdf',
    title: 'EK 367 / EK 151 台北至哥本哈根官方電子登機證'
  },
  {
    id: 'first-camp',
    encFile: 'first-camp.enc',
    sourcePdf: '2026-09-07_to_09-12_First-Camp-Sibbarp-Malmo_reservation.pdf',
    title: 'First Camp Sibbarp-Malmö 訂房確認單'
  }
];

function encryptPdfBuffer(inputBuffer, password) {
  const mimeType = 'application/pdf';
  const mimeBytes = Buffer.from(mimeType, 'utf8');

  // Binary payload envelope: [1-byte mime length] [mimeType UTF-8] [raw PDF buffer]
  const payload = Buffer.concat([
    Buffer.from([mimeBytes.length]),
    mimeBytes,
    inputBuffer
  ]);

  const salt = crypto.randomBytes(16);
  const iv = crypto.randomBytes(12);
  const key = crypto.pbkdf2Sync(password, salt, 600000, 32, 'sha256');

  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([
    cipher.update(payload),
    cipher.final(),
    cipher.getAuthTag() // 16 bytes auth tag
  ]);

  // Output format: [16 bytes salt] [12 bytes iv] [ciphertext + 16 bytes tag]
  return Buffer.concat([salt, iv, encrypted]);
}

function run() {
  console.log('[Encrypt] Processing authentic PDF tickets with AES-256-GCM...');

  let count = 0;
  for (const t of TICKET_DEFINITIONS) {
    let sourceFilename = t.sourcePdf;
    if (!sourceFilename && t.sourcePattern && fs.existsSync(PDF_DIR)) {
      const matched = fs.readdirSync(PDF_DIR).find(f => t.sourcePattern.test(f));
      if (matched) sourceFilename = matched;
    }

    const fullSourcePath = path.join(PDF_DIR, sourceFilename || '');
    if (!fs.existsSync(fullSourcePath)) {
      console.error('[Error] Missing authentic source PDF:', fullSourcePath);
      process.exit(1);
    }

    const rawBuffer = fs.readFileSync(fullSourcePath);
    if (rawBuffer.length === 0) {
      console.error('[Error] Source PDF is empty:', fullSourcePath);
      process.exit(1);
    }

    const encrypted = encryptPdfBuffer(rawBuffer, PASSWORD);
    const outPath = path.join(OUT_DIR, t.encFile);
    fs.writeFileSync(outPath, encrypted);

    console.log('  ✓ Encrypted ' + t.title + ' (' + sourceFilename + ') -> ' + t.encFile + ' [' + rawBuffer.length + ' bytes -> ' + encrypted.length + ' bytes]');
    count++;
  }

  console.log('[Encrypt] Complete! Successfully encrypted ' + count + ' authentic PDF ticket files.');
}

run();
