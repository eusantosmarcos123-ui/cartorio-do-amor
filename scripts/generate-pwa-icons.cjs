const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Create an elegant SVG for the app icon
const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <radialGradient id="bgGrad" cx="50%" cy="30%" r="75%">
      <stop offset="0%" stop-color="#9e1b45"/>
      <stop offset="50%" stop-color="#72092c"/>
      <stop offset="100%" stop-color="#3d0315"/>
    </radialGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a"/>
      <stop offset="40%" stop-color="#facc15"/>
      <stop offset="70%" stop-color="#ca8a04"/>
      <stop offset="100%" stop-color="#854d0e"/>
    </linearGradient>
    <linearGradient id="innerShine" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.4"/>
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#000000" flood-opacity="0.45"/>
    </filter>
  </defs>

  <!-- Background Rounded Rect -->
  <rect width="512" height="512" rx="112" fill="url(#bgGrad)"/>
  <rect width="504" height="504" x="4" y="4" rx="108" fill="none" stroke="url(#goldGrad)" stroke-width="4" stroke-opacity="0.6"/>

  <!-- Romantic Wax Seal Outline -->
  <g filter="url(#shadow)">
    <!-- Decorative Certificate Ribbon -->
    <path d="M 210 330 L 210 420 L 256 395 L 302 420 L 302 330 Z" fill="url(#goldGrad)" />
    
    <!-- Central Medallion -->
    <circle cx="256" cy="240" r="140" fill="url(#bgGrad)" stroke="url(#goldGrad)" stroke-width="8"/>
    <circle cx="256" cy="240" r="126" fill="none" stroke="url(#goldGrad)" stroke-width="2" stroke-dasharray="6 4" stroke-opacity="0.8"/>

    <!-- Dual Hearts Icon -->
    <g transform="translate(256, 235) scale(1.15)">
      <!-- Left heart -->
      <path d="M -15 -35 C -45 -65, -80 -15, -45 25 L 0 70 C 45 25, 80 -15, 50 -35 C 25 -55, 5 -30, 0 -15 C -5 -30, -25 -55, -50 -35 Z" 
            fill="url(#goldGrad)" 
            filter="drop-shadow(0 4px 6px rgba(0,0,0,0.3))"/>
      
      <!-- Inner Scroll details -->
      <path d="M -18 -15 Q 0 -2 18 -15 Q 0 -8 -18 -15 Z" fill="#72092c" opacity="0.6"/>
    </g>
  </g>
  
  <!-- Subtle Header Text Arc or Star -->
  <circle cx="256" cy="140" r="6" fill="url(#goldGrad)"/>
</svg>`;

// Write SVG files
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'icon.svg'), iconSvg);
fs.writeFileSync(path.join(publicDir, 'favicon.svg'), iconSvg);

// Generate valid standalone uncompressed PNGs via pure Buffer PNG encoder
function createPng(width, height, _r = 114, _g = 9, _b = 44, _a = 255) {
  // Simple PNG generator with solid color and center seal gradient
  const bytesPerPixel = 4;
  const rawData = Buffer.alloc(height * (width * bytesPerPixel + 1));
  
  const cx = width / 2;
  const cy = height / 2;
  const radius = width * 0.42;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * (width * bytesPerPixel + 1);
    rawData[rowOffset] = 0; // Filter type 0 (None)
    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * bytesPerPixel;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < radius) {
        // Inner Seal
        if (dist < radius * 0.75) {
          // Heart / Medallion gold center
          rawData[pxOffset] = 234;     // R
          rawData[pxOffset + 1] = 179; // G
          rawData[pxOffset + 2] = 8;   // B
          rawData[pxOffset + 3] = 255; // A
        } else {
          // Wine Red Seal
          rawData[pxOffset] = 114;     // R
          rawData[pxOffset + 1] = 9;   // G
          rawData[pxOffset + 2] = 44;  // B
          rawData[pxOffset + 3] = 255; // A
        }
      } else {
        // Background rounded / dark wine
        rawData[pxOffset] = 61;      // R
        rawData[pxOffset + 1] = 3;   // G
        rawData[pxOffset + 2] = 21;  // B
        rawData[pxOffset + 3] = 255; // A
      }
    }
  }

  const deflated = zlib.deflateSync(rawData);

  // PNG Signature
  const pngSig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR Chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth
  ihdr[9] = 6; // Color type: RGBA
  ihdr[10] = 0; // Compression method
  ihdr[11] = 0; // Filter method
  ihdr[12] = 0; // Interlace method

  const ihdrChunk = createChunk('IHDR', ihdr);
  const idatChunk = createChunk('IDAT', deflated);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([pngSig, ihdrChunk, idatChunk, iendChunk]);
}

function createChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(len + 12);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4);
  data.copy(chunk, 8);

  const crc = crc32(Buffer.concat([Buffer.from(type), data]));
  chunk.writeUInt32BE(crc >>> 0, len + 8);
  return chunk;
}

// CRC32 table
const crcTable = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) {
      c = 0xedb88320 ^ (c >>> 1);
    } else {
      c = c >>> 1;
    }
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return crc ^ 0xffffffff;
}

// Write PNG icon sizes
fs.writeFileSync(path.join(publicDir, 'icon-192.png'), createPng(192, 192, 114, 9, 44));
fs.writeFileSync(path.join(publicDir, 'icon-512.png'), createPng(512, 512, 114, 9, 44));
fs.writeFileSync(path.join(publicDir, 'icon-maskable-192.png'), createPng(192, 192, 114, 9, 44));
fs.writeFileSync(path.join(publicDir, 'icon-maskable-512.png'), createPng(512, 512, 114, 9, 44));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createPng(180, 180, 114, 9, 44));

console.log('✅ PWA Icons successfully generated in public directory!');
