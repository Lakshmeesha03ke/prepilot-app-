import fs from 'fs';
import zlib from 'zlib';

function createPNG(width, height, drawFn) {
  // 1. Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // 2. IHDR Chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr.writeUInt8(8, 8); // bit depth: 8
  ihdr.writeUInt8(6, 9); // color type: 6 (RGBA)
  ihdr.writeUInt8(0, 10); // compression method
  ihdr.writeUInt8(0, 11); // filter method
  ihdr.writeUInt8(0, 12); // interlace method

  const ihdrChunk = makeChunk('IHDR', ihdr);

  // 3. Raw image scanlines
  // Each scanline begins with a filter byte (0 = None) followed by width * 4 RGBA bytes
  const scanlineLength = 1 + width * 4;
  const rawData = Buffer.alloc(scanlineLength * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * scanlineLength;
    rawData[rowOffset] = 0; // Filter: None
    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;
      const [r, g, b, a] = drawFn(x, y, width, height);
      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  // Deflate IDAT
  const compressedData = zlib.deflateSync(rawData);
  const idatChunk = makeChunk('IDAT', compressedData);

  // 4. IEND Chunk
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// CRC32 calculation for PNG chunks
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) c = 0xedb88320 ^ (c >>> 1);
    else c = c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const len = data.length;
  const buf = Buffer.alloc(4 + 4 + len + 4);
  buf.writeUInt32BE(len, 0);
  buf.write(type, 4, 4, 'ascii');
  data.copy(buf, 8);

  const crcData = buf.subarray(4, 8 + len);
  const crcVal = crc32(crcData);
  buf.writeUInt32BE(crcVal, 8 + len);
  return buf;
}

// Draw PrePilot Brand Icon: Deep Slate Background, Sky/Indigo Gradient Diamond and Center Rocket
function prepilotPainter(x, y, w, h) {
  const cx = w / 2;
  const cy = h / 2;
  const dx = x - cx;
  const dy = y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // Background rounded rect / squircle
  const cornerR = w * 0.22;
  const inBox = Math.abs(dx) <= (cx - cornerR) || Math.abs(dy) <= (cy - cornerR) || 
    (Math.sqrt(Math.pow(Math.abs(dx) - (cx - cornerR), 2) + Math.pow(Math.abs(dy) - (cy - cornerR), 2)) <= cornerR);

  if (!inBox) {
    return [0, 0, 0, 0]; // Transparent outside
  }

  // Base background: Deep Slate #0f172a
  let r = 15;
  let g = 23;
  let b = 42;
  let a = 255;

  // Thin outer cyan border
  const borderDist = Math.max(Math.abs(dx) / (w * 0.45), Math.abs(dy) / (h * 0.45));
  if (borderDist > 0.94 && borderDist < 1.0) {
    r = 56; g = 189; b = 248; a = 120;
  }

  // Diamond (Graduation cap top)
  const normX = dx / (w * 0.32);
  const normY = (dy + h * 0.1) / (h * 0.22);
  if (Math.abs(normX) + Math.abs(normY) <= 1.0) {
    // Sky blue to indigo gradient
    const t = (x + y) / (w + h);
    r = Math.floor(56 + t * (99 - 56));
    g = Math.floor(189 + t * (102 - 189));
    b = Math.floor(248 + t * (241 - 248));
  }

  // Rocket body in center
  const rockX = Math.abs(dx) / (w * 0.08);
  const rockY = (dy - h * 0.05);
  if (rockY >= -h * 0.15 && rockY <= h * 0.18 && rockX <= (1.0 - (rockY + h * 0.15) / (h * 0.33) * 0.4)) {
    // White body
    r = 255; g = 255; b = 255;
    // Porthole
    if (dist < w * 0.035 && dy < 0) {
      r = 2; g = 132; b = 199;
    }
  }

  // Rocket Flame at bottom
  if (dy > h * 0.15 && dy < h * 0.28 && Math.abs(dx) < (w * 0.06 * (1 - (dy - h * 0.15) / (h * 0.13)))) {
    r = 245; g = 158; b = 11; // Amber flame
  }

  return [r, g, b, a];
}

// Generate files
const publicDir = './public';
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

console.log('Generating PWA PNG icons...');

fs.writeFileSync(`${publicDir}/pwa-192x192.png`, createPNG(192, 192, prepilotPainter));
fs.writeFileSync(`${publicDir}/pwa-512x512.png`, createPNG(512, 512, prepilotPainter));
fs.writeFileSync(`${publicDir}/pwa-maskable-512x512.png`, createPNG(512, 512, prepilotPainter));
fs.writeFileSync(`${publicDir}/apple-touch-icon.png`, createPNG(180, 180, prepilotPainter));

console.log('Successfully generated all PWA PNG icons in /public!');
