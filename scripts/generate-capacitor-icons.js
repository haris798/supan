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

// 3. Generate assets/icon-background.png (1024x1024 solid dark emerald canvas)
const bgSvg = `<svg width="1024" height="1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#151821" />
      <stop offset="50%" stop-color="#0f1117" />
      <stop offset="100%" stop-color="#090a0e" />
    </linearGradient>
  </defs>
  <rect width="1024" height="1024" fill="url(#bgGrad)" />
</svg>`;

await sharp(Buffer.from(bgSvg))
  .resize(1024, 1024)
  .png()
  .toFile(path.resolve('assets/icon-background.png'));

// 4. Generate assets/icon-foreground.png (1024x1024 adaptive icon foreground)
const fgSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="1024" height="1024">
  <defs>
    <linearGradient id="supaBoltGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3ef09d" />
      <stop offset="50%" stop-color="#3ecf8e" />
      <stop offset="100%" stop-color="#10b981" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  <g transform="translate(0, 0)" filter="url(#glow)">
    <path d="M 276,88 
             L 156,260 
             C 148,272 158,288 172,288 
             L 248,288 
             L 220,420 
             C 216,436 238,446 248,432 
             L 368,252 
             C 376,240 366,224 352,224 
             L 276,224 
             L 304,100 
             C 308,84 286,74 276,88 Z" 
          fill="url(#supaBoltGrad)" />
  </g>
</svg>`;

await sharp(Buffer.from(fgSvg))
  .resize(1024, 1024)
  .png()
  .toFile(path.resolve('assets/icon-foreground.png'));

// 5. Generate assets/splash.png (2732x2732 splash screen)
const splashSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2732 2732" width="2732" height="2732">
  <defs>
    <linearGradient id="splashBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#151821" />
      <stop offset="50%" stop-color="#0d0f14" />
      <stop offset="100%" stop-color="#050608" />
    </linearGradient>
    <linearGradient id="supaBoltGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#3ef09d" />
      <stop offset="50%" stop-color="#3ecf8e" />
      <stop offset="100%" stop-color="#10b981" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="12" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <rect width="2732" height="2732" fill="url(#splashBgGrad)" />

  <g transform="translate(1110, 1110)" filter="url(#glow)">
    <path d="M 276,88 
             L 156,260 
             C 148,272 158,288 172,288 
             L 248,288 
             L 220,420 
             C 216,436 238,446 248,432 
             L 368,252 
             C 376,240 366,224 352,224 
             L 276,224 
             L 304,100 
             C 308,84 286,74 276,88 Z" 
          fill="url(#supaBoltGrad)" />
  </g>
</svg>`;

await sharp(Buffer.from(splashSvg))
  .resize(2732, 2732)
  .png()
  .toFile(path.resolve('assets/splash.png'));

console.log('Successfully generated Supan database custom icons and splash images!');
