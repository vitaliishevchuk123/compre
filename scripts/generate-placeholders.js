// Generate SQUARE placeholder PNGs for lesson images.
//
// Workflow: this script produces neutral square placeholders so the layout and
// image registry work end to end; real artwork (sourced from the internet) is
// dropped in later under the same filename — the square lesson frame uses
// `resizeMode: contain`, so a replacement of any aspect ratio stays centered.
//
// Usage:
//   node scripts/generate-placeholders.js a1/boy a1/dog a1/cat ...
//   node scripts/generate-placeholders.js            # fills in any MISSING A1 images
//   node scripts/generate-placeholders.js --force ... # overwrite existing files
//
// By default existing files are SKIPPED, so real artwork the user has dropped in
// is never clobbered. Pass --force to regenerate. Output goes to
// assets/images/<level>/<name>.png

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const SIZE = 512; // square

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(zlib.crc32(Buffer.concat([typeBuf, data])) >>> 0, 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}

function solidPng(size, [r, g, b]) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // color type RGB
  const px = Buffer.from([r, g, b]);
  const row = Buffer.concat([Buffer.from([0]), ...Array.from({ length: size }, () => px)]);
  const raw = Buffer.concat(Array.from({ length: size }, () => row));
  const idat = zlib.deflateSync(raw);
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))]);
}

// Deterministic pleasant color from a key.
function colorFor(key) {
  let h = 0;
  for (const ch of key) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const hue = h % 360;
  // simple HSL->RGB at S=55% L=62%
  const s = 0.55, l = 0.62;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = l - c / 2;
  const [r1, g1, b1] =
    hue < 60 ? [c, x, 0] : hue < 120 ? [x, c, 0] : hue < 180 ? [0, c, x] :
    hue < 240 ? [0, x, c] : hue < 300 ? [x, 0, c] : [c, 0, x];
  return [r1, g1, b1].map((v) => Math.round((v + m) * 255));
}

const DEFAULT_KEYS = [
  'a1/boy', 'a1/girl', 'a1/dog', 'a1/dog-run', 'a1/boy-eat',
  'a1/girl-happy', 'a1/dog-run-fast', 'a1/boy-sad', 'a1/dog-angry', 'a1/girl-sad',
];

const args = process.argv.slice(2);
const force = args.includes('--force');
const requested = args.filter((a) => a !== '--force');
const keys = requested.length ? requested : DEFAULT_KEYS;
const root = path.join(__dirname, '..', 'assets', 'images');

for (const key of keys) {
  const file = path.join(root, `${key}.png`);
  if (fs.existsSync(file) && !force) {
    console.log('skip (exists)', path.relative(path.join(__dirname, '..'), file));
    continue;
  }
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, solidPng(SIZE, colorFor(key)));
  console.log('wrote', path.relative(path.join(__dirname, '..'), file));
}
