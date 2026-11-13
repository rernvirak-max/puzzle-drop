// Packs the PNG favicons into public/favicon.ico (PNG-compressed ICO entries).
import { readFileSync, writeFileSync } from "node:fs";

const sizes = [16, 32, 96, 128];
const pngs = sizes.map(s =>
  readFileSync(
    new URL(`../public/icons/favicon-${s}x${s}.png`, import.meta.url)
  )
);
const header = Buffer.alloc(6 + 16 * pngs.length);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(pngs.length, 4);
let offset = header.length;
pngs.forEach((png, i) => {
  const at = 6 + i * 16;
  header.writeUInt8(sizes[i] >= 256 ? 0 : sizes[i], at);
  header.writeUInt8(sizes[i] >= 256 ? 0 : sizes[i], at + 1);
  header.writeUInt16LE(1, at + 4);
  header.writeUInt16LE(32, at + 6);
  header.writeUInt32LE(png.length, at + 8);
  header.writeUInt32LE(offset, at + 12);
  offset += png.length;
});
writeFileSync(
  new URL("../public/favicon.ico", import.meta.url),
  Buffer.concat([header, ...pngs])
);
console.log("favicon.ico done");
