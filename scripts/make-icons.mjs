// Every icon, favicon and logo file in /public, generated from brand/capra-logo.png (the gold markhor).
// Run: npm run icons. Re-run after the logo changes; the outputs are committed.
import sharp from "sharp";
import fs from "node:fs";

const SRC = "brand/capra-logo.png";
const INK = "#0b0a09";
const out = (p) => `public/${p}`;
fs.mkdirSync("public/images/brand", { recursive: true });

// The mark, cropped to its own edges.
const mark = await sharp(SRC).trim().toBuffer();
const { width: mw, height: mh } = await sharp(mark).metadata();

/** The mark centred on an ink square: `scale` is the share of the side the mark's height takes. */
async function tile(size, scale, { radius = 0, bg = INK } = {}) {
  const h = Math.round(size * scale), w = Math.round((mw / mh) * h);
  const art = await sharp(mark).resize({ width: w, height: h, fit: "inside" }).toBuffer();
  const base = sharp({ create: { width: size, height: size, channels: 4, background: bg } });
  const layers = [{ input: art, gravity: "centre" }];
  if (radius) layers.push({ input: Buffer.from(`<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${radius * size}" fill="#fff"/></svg>`), blend: "dest-in" });
  return base.composite(layers).png({ compressionLevel: 9 }).toBuffer();
}

const write = (p, buf) => fs.writeFileSync(out(p), buf);

// Browser tabs: rounded ink tile, mark large so the horns read at 16px.
for (const s of [16, 32, 48, 96]) write(`favicon-${s}x${s}.png`, await tile(s, 0.86, { radius: 0.22 }));
// Apple: full-bleed square (iOS rounds it), with breathing room.
write("apple-icon-180x180.png", await tile(180, 0.72));
write("apple-icon.png", await tile(180, 0.72));
// Android / PWA "any": rounded tile.
for (const s of [36, 48, 72, 96, 144, 192, 512]) write(`android-icon-${s}x${s}.png`, await tile(s, 0.78, { radius: 0.2 }));
// PWA "maskable": full bleed, mark inside the 80% safe circle.
for (const s of [192, 512]) write(`maskable-icon-${s}x${s}.png`, await tile(s, 0.56));
// Windows tiles.
for (const s of [70, 144, 150, 310]) write(`ms-icon-${s}x${s}.png`, await tile(s, 0.7));

// favicon.ico with PNG payloads (16, 32, 48): the ICO container allows PNG entries.
const icoSizes = [16, 32, 48];
const pngs = await Promise.all(icoSizes.map((s) => tile(s, 0.86, { radius: 0.22 })));
const head = Buffer.alloc(6 + 16 * pngs.length);
head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(pngs.length, 4);
let offset = head.length;
pngs.forEach((p, i) => {
  const e = 6 + i * 16, s = icoSizes[i];
  head.writeUInt8(s, e); head.writeUInt8(s, e + 1); head.writeUInt8(0, e + 2); head.writeUInt8(0, e + 3);
  head.writeUInt16LE(1, e + 4); head.writeUInt16LE(32, e + 6); head.writeUInt32LE(p.length, e + 8); head.writeUInt32LE(offset, e + 12);
  offset += p.length;
});
write("favicon.ico", Buffer.concat([head, ...pngs]));

// Site artwork: the transparent mark for the header and footer, and a square logo for JSON-LD.
await sharp(mark).resize({ height: 256 }).webp({ quality: 90 }).toFile(out("images/brand/capra-mark.webp"));
await sharp(mark).resize({ height: 256 }).png({ compressionLevel: 9 }).toFile(out("images/brand/capra-mark.png"));
write("images/brand/capra-logo-square.png", await tile(512, 0.8));

// Email header: mark + wordmark, pre-flattened on ink (Gmail and Outlook mangle transparency).
const wordmark = (w, h, size) => Buffer.from(`<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg"><text x="0" y="${h * 0.7}" font-family="Georgia, serif" font-size="${size}" letter-spacing="${size * 0.32}" fill="#e3cc9c">CAPRA</text></svg>`);
const emailMark = await sharp(mark).resize({ height: 96 }).toBuffer();
const { width: ew } = await sharp(emailMark).metadata();
await sharp({ create: { width: 360, height: 96, channels: 4, background: INK } })
  .composite([{ input: emailMark, left: 0, top: 0 }, { input: wordmark(360 - ew - 18, 96, 40), left: ew + 18, top: 0 }])
  .png().toFile(out("images/brand/logo-email.png"));

// Default share card (noindex pages and the homepage fallback). Per-page cards come from /og.
const ogMark = await sharp(mark).resize({ height: 420 }).toBuffer();
await sharp({ create: { width: 1200, height: 630, channels: 4, background: INK } })
  .composite([
    { input: ogMark, left: 90, top: 105 },
    { input: wordmark(640, 140, 96), left: 470, top: 190 },
    { input: Buffer.from(`<svg width="700" height="60" xmlns="http://www.w3.org/2000/svg"><text x="0" y="40" font-family="Helvetica, Arial, sans-serif" font-size="30" fill="#d9cec1">Vacuum flasks &amp; jugs · Made in Gujranwala</text></svg>`), left: 476, top: 345 },
  ])
  .jpeg({ quality: 86 }).toFile(out("images/brand/og-default.jpg"));

fs.writeFileSync(out("browserconfig.xml"), `<?xml version="1.0" encoding="utf-8"?>
<browserconfig><msapplication><tile><square70x70logo src="/ms-icon-70x70.png"/><square150x150logo src="/ms-icon-150x150.png"/><square310x310logo src="/ms-icon-310x310.png"/><TileColor>${INK}</TileColor></tile></msapplication></browserconfig>
`);
console.log("icons written");
