import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const iconSvgPath = path.resolve('public/icon.svg');
const svgBuffer = fs.readFileSync(iconSvgPath);

// 1. Generate public/icon.png (512x512)
await sharp(svgBuffer)
  .resize(512, 512)
  .png()
  .toFile(path.resolve('public/icon.png'));

// 2. Generate assets/icon-only.png (1024x1024)
await sharp(svgBuffer)
  .resize(1024, 1024)
  .png()
  .toFile(path.resolve('assets/icon-only.png'));

// 3. Generate assets/icon-background.png (1024x1024 solid capacitor blue)
const bgSvg = `<svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#53b9ff" />
      <stop offset="100%" stop-color="#0054e9" />
    </linearGradient>
  </defs>
  <rect width="1024" height="1024" fill="url(#bgGrad)" />
</svg>`;

await sharp(Buffer.from(bgSvg))
  .resize(1024, 1024)
  .png()
  .toFile(path.resolve('assets/icon-background.png'));

// 4. Generate assets/icon-foreground.png (1024x1024 transparent with white emblem)
const fgSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="1024" height="1024">
  <defs>
    <linearGradient id="boltGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="100%" stop-color="#e0f2fe" />
    </linearGradient>
  </defs>
  <g transform="translate(0, 16)" fill="url(#boltGrad)">
    <path d="M 256,96 L 384,176 L 256,256 L 128,176 Z" opacity="0.95" />
    <path d="M 128,208 L 256,288 L 384,208 L 384,256 L 256,336 L 128,256 Z" opacity="0.85" />
    <path d="M 128,288 L 256,368 L 384,288 L 384,336 L 256,416 L 128,336 Z" />
  </g>
</svg>`;

await sharp(Buffer.from(fgSvg))
  .resize(1024, 1024)
  .png()
  .toFile(path.resolve('assets/icon-foreground.png'));

// 5. Generate assets/splash.png (2732x2732 with dark/blue bg and centered emblem)
const splashSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2732 2732" width="2732" height="2732">
  <defs>
    <linearGradient id="splashGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="50%" stop-color="#0284c7" />
      <stop offset="100%" stop-color="#0369a1" />
    </linearGradient>
    <linearGradient id="boltGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="100%" stop-color="#e0f2fe" />
    </linearGradient>
  </defs>

  <rect width="2732" height="2732" fill="url(#splashGrad)" />

  <g transform="translate(1110, 1110) scale(1) translate(0, 8)" fill="url(#boltGrad)">
    <path d="M 256,96 L 384,176 L 256,256 L 128,176 Z" opacity="0.95" />
    <path d="M 128,208 L 256,288 L 384,208 L 384,256 L 256,336 L 128,256 Z" opacity="0.85" />
    <path d="M 128,288 L 256,368 L 384,288 L 384,336 L 256,416 L 128,336 Z" />
  </g>
</svg>`;

await sharp(Buffer.from(splashSvg))
  .resize(2732, 2732)
  .png()
  .toFile(path.resolve('assets/splash.png'));

console.log('Successfully generated default Capacitor icons and splash images!');
