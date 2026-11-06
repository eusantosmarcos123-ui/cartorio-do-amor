import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// SVG Standard: Rounded Squircle for normal display, browser tabs, desktop PWA modal, Apple touch icon
const createSvgLogo = () => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <!-- Background Gradient: Deep Royal Burgundy / Wine -->
    <radialGradient id="bgGrad" cx="30%" cy="20%" r="90%">
      <stop offset="0%" stop-color="#b91c4c"/>
      <stop offset="35%" stop-color="#881337"/>
      <stop offset="70%" stop-color="#580822"/>
      <stop offset="100%" stop-color="#2a020d"/>
    </radialGradient>

    <!-- Luxury Gold Metallic Gradient -->
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="20%" stop-color="#fef08a"/>
      <stop offset="45%" stop-color="#facc15"/>
      <stop offset="75%" stop-color="#eab308"/>
      <stop offset="100%" stop-color="#a16207"/>
    </linearGradient>

    <linearGradient id="goldGleam" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.2"/>
    </linearGradient>

    <!-- Subtle Drop Shadow Filter for central emblem -->
    <filter id="goldShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.6"/>
    </filter>
  </defs>

  <!-- Rounded Squircle Base -->
  <rect x="16" y="16" width="480" height="480" rx="108" fill="url(#bgGrad)"/>

  <!-- Inner Soft Highlight Glow -->
  <rect x="20" y="20" width="472" height="472" rx="104" fill="url(#goldGleam)"/>

  <!-- Elegant Golden Border -->
  <rect x="24" y="24" width="464" height="464" rx="100" fill="none" stroke="url(#goldGrad)" stroke-width="8" stroke-opacity="0.85"/>
  <rect x="36" y="36" width="440" height="440" rx="88" fill="none" stroke="url(#goldGrad)" stroke-width="2" stroke-opacity="0.4" stroke-dasharray="8 6"/>

  <!-- Central Scroll Emblem (Exact Lucide Scroll scaled and styled) -->
  <g filter="url(#goldShadow)" transform="translate(256, 256)">
    <g transform="scale(10.5) translate(-12, -12)">
      <!-- Main scroll paths -->
      <path d="M19 17V5a2 2 0 0 0-2-2H4" 
            fill="none" 
            stroke="url(#goldGrad)" 
            stroke-width="2.2" 
            stroke-linecap="round" 
            stroke-linejoin="round"/>
      <path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3" 
            fill="none" 
            stroke="url(#goldGrad)" 
            stroke-width="2.2" 
            stroke-linecap="round" 
            stroke-linejoin="round"/>
      
      <!-- Romantic Heart Wax Seal emblem inside the scroll body -->
      <path d="M 13.5 12.8 C 13.5 12.8 11.2 10.5 11.2 9.2 C 11.2 8.2 12.0 7.4 13.0 7.4 C 13.6 7.4 14.1 7.7 14.4 8.2 C 14.7 7.7 15.2 7.4 15.8 7.4 C 16.8 7.4 17.6 8.2 17.6 9.2 C 17.6 10.5 15.3 12.8 15.3 12.8 L 14.4 13.6 Z"
            fill="url(#goldGrad)"
            stroke="url(#goldGrad)"
            stroke-width="0.3"/>

      <!-- Delicate Certificate Script lines below the heart -->
      <line x1="12" y1="15" x2="17" y2="15" stroke="url(#goldGrad)" stroke-width="1" stroke-linecap="round" opacity="0.8"/>
      <line x1="12" y1="17" x2="15" y2="17" stroke="url(#goldGrad)" stroke-width="1" stroke-linecap="round" opacity="0.6"/>
    </g>
  </g>

  <!-- Sparkles / Stars accents -->
  <g fill="url(#goldGrad)" opacity="0.75">
    <path d="M 370 120 Q 370 135 385 135 Q 370 135 370 150 Q 370 135 355 135 Q 370 135 370 120 Z"/>
    <path d="M 140 370 Q 140 380 150 380 Q 140 380 140 390 Q 140 380 130 380 Q 140 380 140 370 Z"/>
  </g>
</svg>
`;

// SVG Maskable: Full 512x512 edge-to-edge bleed, emblem within 80% safe zone
const createSvgMaskable = () => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <radialGradient id="bgGradM" cx="40%" cy="30%" r="85%">
      <stop offset="0%" stop-color="#b91c4c"/>
      <stop offset="35%" stop-color="#881337"/>
      <stop offset="70%" stop-color="#580822"/>
      <stop offset="100%" stop-color="#2a020d"/>
    </radialGradient>
    <linearGradient id="goldGradM" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="20%" stop-color="#fef08a"/>
      <stop offset="45%" stop-color="#facc15"/>
      <stop offset="75%" stop-color="#eab308"/>
      <stop offset="100%" stop-color="#a16207"/>
    </linearGradient>
    <filter id="goldShadowM" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.6"/>
    </filter>
  </defs>

  <!-- Full Bleed Edge-to-Edge Background -->
  <rect width="512" height="512" fill="url(#bgGradM)"/>

  <!-- Subtle Circular Guide / Ornament within safe-zone -->
  <circle cx="256" cy="256" r="190" fill="none" stroke="url(#goldGradM)" stroke-width="3" stroke-opacity="0.5"/>
  <circle cx="256" cy="256" r="182" fill="none" stroke="url(#goldGradM)" stroke-width="1.5" stroke-opacity="0.25" stroke-dasharray="6 6"/>

  <!-- Centered Emblem strictly within 70% safe zone -->
  <g filter="url(#goldShadowM)" transform="translate(256, 256)">
    <g transform="scale(8.5) translate(-12, -12)">
      <path d="M19 17V5a2 2 0 0 0-2-2H4" 
            fill="none" 
            stroke="url(#goldGradM)" 
            stroke-width="2.3" 
            stroke-linecap="round" 
            stroke-linejoin="round"/>
      <path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3" 
            fill="none" 
            stroke="url(#goldGradM)" 
            stroke-width="2.3" 
            stroke-linecap="round" 
            stroke-linejoin="round"/>
      
      <path d="M 13.5 12.8 C 13.5 12.8 11.2 10.5 11.2 9.2 C 11.2 8.2 12.0 7.4 13.0 7.4 C 13.6 7.4 14.1 7.7 14.4 8.2 C 14.7 7.7 15.2 7.4 15.8 7.4 C 16.8 7.4 17.6 8.2 17.6 9.2 C 17.6 10.5 15.3 12.8 15.3 12.8 L 14.4 13.6 Z"
            fill="url(#goldGradM)"
            stroke="url(#goldGradM)"
            stroke-width="0.3"/>

      <line x1="12" y1="15" x2="17" y2="15" stroke="url(#goldGradM)" stroke-width="1" stroke-linecap="round" opacity="0.8"/>
      <line x1="12" y1="17" x2="15" y2="17" stroke="url(#goldGradM)" stroke-width="1" stroke-linecap="round" opacity="0.6"/>
    </g>
  </g>

  <!-- Sparkles -->
  <g fill="url(#goldGradM)" opacity="0.75">
    <path d="M 350 140 Q 350 152 362 152 Q 350 152 350 164 Q 350 152 338 152 Q 350 152 350 140 Z"/>
    <path d="M 160 350 Q 160 360 170 360 Q 160 360 160 370 Q 160 360 150 360 Q 160 360 160 350 Z"/>
  </g>
</svg>
`;

async function main() {
  const publicDir = path.resolve('public');
  const svgStandard = createSvgLogo();
  const svgMaskable = createSvgMaskable();

  console.log('Writing public/icon.svg and public/favicon.svg...');
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgStandard, 'utf8');
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgStandard, 'utf8');

  console.log('Generating public/icon-512.png (512x512)...');
  await sharp(Buffer.from(svgStandard))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'icon-512.png'));

  console.log('Generating public/icon-192.png (192x192)...');
  await sharp(Buffer.from(svgStandard))
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'icon-192.png'));

  console.log('Generating public/apple-touch-icon.png (180x180)...');
  await sharp(Buffer.from(svgStandard))
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));

  console.log('Generating public/icon-maskable-512.png (512x512)...');
  await sharp(Buffer.from(svgMaskable))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'icon-maskable-512.png'));

  console.log('Generating public/icon-maskable-192.png (192x192)...');
  await sharp(Buffer.from(svgMaskable))
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'icon-maskable-192.png'));

  console.log('All official logo assets generated and replaced successfully in public/!');
}

main().catch(console.error);
