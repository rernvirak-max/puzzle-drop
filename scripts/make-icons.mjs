// Renders the Kampuzzle app icons from scripts/kampuzzle-icon.svg.
// Run: npm i --no-save sharp && node scripts/make-icons.mjs && node scripts/make-favicon.mjs
import sharp from "sharp";
import { readFileSync } from "node:fs";

const svg = readFileSync(new URL("./kampuzzle-icon.svg", import.meta.url));
const out = name =>
  new URL(`../public/icons/${name}`, import.meta.url).pathname.replace(
    /^\/([A-Za-z]:)/,
    "$1"
  );

const square = [
  ["icon-128x128.png", 128],
  ["icon-192x192.png", 192],
  ["icon-256x256.png", 256],
  ["icon-384x384.png", 384],
  ["icon-512x512.png", 512],
  ["apple-icon-120x120.png", 120],
  ["apple-icon-152x152.png", 152],
  ["apple-icon-167x167.png", 167],
  ["apple-icon-180x180.png", 180],
  ["favicon-16x16.png", 16],
  ["favicon-32x32.png", 32],
  ["favicon-96x96.png", 96],
  ["favicon-128x128.png", 128]
];
for (const [name, size] of square) {
  await sharp(svg, { density: 384 }).resize(size, size).png().toFile(out(name));
}
// Maskable: shrink the artwork into the 80% safe zone on the same background.
const inner = await sharp(svg, { density: 384 })
  .resize(410, 410)
  .png()
  .toBuffer();
await sharp({
  create: { width: 512, height: 512, channels: 4, background: "#17352c" }
})
  .composite([{ input: inner, gravity: "center" }])
  .png()
  .toFile(out("icon-maskable-512x512.png"));
// Monochrome: white piece on transparent.
const mono = readFileSync(
  new URL("./kampuzzle-icon.svg", import.meta.url),
  "utf8"
)
  .replace('<rect width="512" height="512" fill="#17352c"/>', "")
  .replaceAll(/fill="#[0-9a-f]{6}"/g, 'fill="#ffffff"');
await sharp(Buffer.from(mono), { density: 384 })
  .resize(512, 512)
  .png()
  .toFile(out("icon-monochrome-512x512.png"));
console.log("icons done");
