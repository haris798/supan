import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();

// NOTE: SVG <linearGradient> fills render as BLACK in the sharp/librsvg build
// used by this repo (and by GitHub Actions). This icon uses only SOLID colors
// so it renders correctly everywhere. No icon.svg file is required.
const ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
  <!-- Full solid light canvas -->
  <rect x="0" y="0" width="100" height="100" fill="#f8fafc" />
  <rect x="0" y="0" width="100" height="100" rx="22" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />

  <!-- Background network mesh lines -->
  <g opacity="0.35">
    <line x1="10" y1="20" x2="40" y2="10" stroke="#94a3b8" strokeWidth="0.8" />
    <line x1="40" y1="10" x2="85" y2="25" stroke="#94a3b8" strokeWidth="0.8" />
    <line x1="85" y1="25" x2="90" y2="60" stroke="#94a3b8" strokeWidth="0.8" />
    <line x1="10" y1="20" x2="15" y2="65" stroke="#94a3b8" strokeWidth="0.8" />
    <line x1="15" y1="65" x2="45" y2="85" stroke="#94a3b8" strokeWidth="0.8" />
    <line x1="45" y1="85" x2="85" y2="80" stroke="#94a3b8" strokeWidth="0.8" />

    <circle cx="10" cy="20" r="2" fill="#38bdf8" />
    <circle cx="40" cy="10" r="2" fill="#34d399" />
    <circle cx="85" cy="25" r="2" fill="#38bdf8" />
    <circle cx="15" cy="65" r="2" fill="#34d399" />
    <circle cx="85" cy="80" r="2" fill="#38bdf8" />
  </g>

  <!-- BOWL + CIRCUIT TREE + CLOUD -->
  <g transform="translate(0, -6)">
    <path d="M 38 48 C 34 40, 30 35, 32 28 C 33 24, 38 24, 37 20" stroke="#06b6d4" strokeWidth="3.5" strokeLinecap="round" />
    <circle cx="37" cy="19" r="3" fill="#06b6d4" />

    <path d="M 48 48 C 48 35, 42 25, 48 16 V 11" stroke="#06b6d4" strokeWidth="3.5" strokeLinecap="round" />
    <circle cx="48" cy="10" r="3.5" fill="#06b6d4" />

    <path d="M 54 48 C 55 38, 62 30, 60 22" stroke="#06b6d4" strokeWidth="3.5" strokeLinecap="round" />

    <path d="M 58 22 C 56 20, 56 16, 60 14 C 62 11, 68 11, 71 14 C 74 12, 78 15, 77 18 C 80 19, 79 24, 75 25 C 72 26, 60 26, 58 22 Z" fill="none" stroke="#06b6d4" strokeWidth="3" strokeLinejoin="round" />
    <circle cx="68" cy="21" r="2.5" fill="#06b6d4" />

    <path d="M 52 46 L 76 25 C 79 22, 83 26, 80 29 L 58 48 Z" fill="#06b6d4" opacity="0.85" />

    <path d="M 22 42 C 22 66, 38 72, 50 72 C 62 72, 78 66, 78 42 Z" fill="none" stroke="#06b6d4" strokeWidth="4" strokeLinejoin="round" />

    <path d="M 27 46 C 35 52, 65 52, 73 46" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" />

    <path d="M 38 72 L 39 76 C 39 77, 61 77, 61 76 L 62 72" fill="#06b6d4" stroke="#06b6d4" strokeWidth="2" strokeLinejoin="round" />
  </g>

  <text x="50" y="90" textAnchor="middle" fill="#0284c7" fontWeight="900" fontSize="13" letterSpacing="1" fontFamily="system-ui, -apple-system, sans-serif">SUPAN</text>
</svg>`;

async function generateIcons() {
  console.log('🚀 Generating SUPAN APK Icons for Android & Capacitor...');

  // Render master 1024x1024 icon from the solid-color SVG
  const masterBuffer = await sharp(Buffer.from(ICON_SVG)).resize(1024, 1024).png().toBuffer();

  // Ensure assets dir exists
  const assetsDir = path.join(rootDir, 'assets');
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }

  // 1. Generate master PNG assets
  await sharp(masterBuffer).resize(1024, 1024).toFile(path.join(assetsDir, 'icon-only.png'));
  await sharp(masterBuffer).resize(1024, 1024).toFile(path.join(assetsDir, 'icon-foreground.png'));
  await sharp(masterBuffer).resize(2732, 2732).toFile(path.join(assetsDir, 'splash.png'));
  await sharp(masterBuffer).resize(512, 512).toFile(path.join(rootDir, 'public', 'icon.png'));

  console.log('✅ Generated master assets in /assets and /public');

  // 2. Android mipmap sizes
  const mipmapSizes = [
    { dir: 'mipmap-mdpi', size: 48, fgSize: 108 },
    { dir: 'mipmap-hdpi', size: 72, fgSize: 162 },
    { dir: 'mipmap-xhdpi', size: 96, fgSize: 216 },
    { dir: 'mipmap-xxhdpi', size: 144, fgSize: 324 },
    { dir: 'mipmap-xxxhdpi', size: 192, fgSize: 432 },
  ];

  const resDir = path.join(rootDir, 'android', 'app', 'src', 'main', 'res');

  for (const { dir, size, fgSize } of mipmapSizes) {
    const targetDir = path.join(resDir, dir);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    // Standard app launcher icon
    await sharp(masterBuffer).resize(size, size).toFile(path.join(targetDir, 'ic_launcher.png'));

    // Round icon
    await sharp(masterBuffer).resize(size, size).toFile(path.join(targetDir, 'ic_launcher_round.png'));

    // Foreground icon for adaptive icons
    await sharp(masterBuffer).resize(fgSize, fgSize).toFile(path.join(targetDir, 'ic_launcher_foreground.png'));

    console.log(`  - Updated ${dir} icons (${size}px / ${fgSize}px)`);
  }

  // 3. Android Splash screens
  const drawableDirs = [
    'drawable',
    'drawable-port-hdpi',
    'drawable-port-mdpi',
    'drawable-port-xhdpi',
    'drawable-port-xxhdpi',
    'drawable-port-xxxhdpi',
    'drawable-land-hdpi',
    'drawable-land-mdpi',
    'drawable-land-xhdpi',
    'drawable-land-xxhdpi',
    'drawable-land-xxxhdpi',
  ];

  for (const dDir of drawableDirs) {
    const targetDir = path.join(resDir, dDir);
    if (fs.existsSync(targetDir)) {
      await sharp(masterBuffer).resize(512, 512).toFile(path.join(targetDir, 'splash.png'));
    }
  }

  // 4. Enforce light adaptive-icon background.
  //    CI runs `npx cap add android`, which recreates the project from the
  //    Capacitor template with a DARK default background. Re-assert our light
  //    background color, drawable, and adaptive-icon XMLs every time.
  const valuesDir = path.join(resDir, 'values');
  fs.mkdirSync(valuesDir, { recursive: true });
  fs.writeFileSync(
    path.join(valuesDir, 'ic_launcher_background.xml'),
    `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#F8FAFC</color>
</resources>`
  );

  const drawableBgDir = path.join(resDir, 'drawable');
  fs.mkdirSync(drawableBgDir, { recursive: true });
  fs.writeFileSync(
    path.join(drawableBgDir, 'ic_launcher_background.xml'),
    `<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp"
    android:height="108dp"
    android:viewportHeight="108"
    android:viewportWidth="108">
    <path
        android:fillColor="#F8FAFC"
        android:pathData="M0,0h108v108h-108z" />
    <path
        android:fillColor="#00000000"
        android:pathData="M9,0L9,108"
        android:strokeColor="#1E293B"
        android:strokeAlpha="0.08"
        android:strokeWidth="0.8" />
    <path
        android:fillColor="#00000000"
        android:pathData="M27,0L27,108"
        android:strokeColor="#1E293B"
        android:strokeAlpha="0.08"
        android:strokeWidth="0.8" />
    <path
        android:fillColor="#00000000"
        android:pathData="M45,0L45,108"
        android:strokeColor="#1E293B"
        android:strokeAlpha="0.08"
        android:strokeWidth="0.8" />
    <path
        android:fillColor="#00000000"
        android:pathData="M63,0L63,108"
        android:strokeColor="#1E293B"
        android:strokeAlpha="0.08"
        android:strokeWidth="0.8" />
    <path
        android:fillColor="#00000000"
        android:pathData="M81,0L81,108"
        android:strokeColor="#1E293B"
        android:strokeAlpha="0.08"
        android:strokeWidth="0.8" />
    <path
        android:fillColor="#00000000"
        android:pathData="M99,0L99,108"
        android:strokeColor="#1E293B"
        android:strokeAlpha="0.08"
        android:strokeWidth="0.8" />
    <path
        android:fillColor="#00000000"
        android:pathData="M0,9L108,9"
        android:strokeColor="#1E293B"
        android:strokeAlpha="0.08"
        android:strokeWidth="0.8" />
    <path
        android:fillColor="#00000000"
        android:pathData="M0,27L108,27"
        android:strokeColor="#1E293B"
        android:strokeAlpha="0.08"
        android:strokeWidth="0.8" />
    <path
        android:fillColor="#00000000"
        android:pathData="M0,45L108,45"
        android:strokeColor="#1E293B"
        android:strokeAlpha="0.08"
        android:strokeWidth="0.8" />
    <path
        android:fillColor="#00000000"
        android:pathData="M0,63L108,63"
        android:strokeColor="#1E293B"
        android:strokeAlpha="0.08"
        android:strokeWidth="0.8" />
    <path
        android:fillColor="#00000000"
        android:pathData="M0,81L108,81"
        android:strokeColor="#1E293B"
        android:strokeAlpha="0.08"
        android:strokeWidth="0.8" />
    <path
        android:fillColor="#00000000"
        android:pathData="M0,99L108,99"
        android:strokeColor="#1E293B"
        android:strokeAlpha="0.08"
        android:strokeWidth="0.8" />
</vector>`
  );

  const anydpiDir = path.join(resDir, 'mipmap-anydpi-v26');
  fs.mkdirSync(anydpiDir, { recursive: true });
  for (const name of ['ic_launcher', 'ic_launcher_round']) {
    fs.writeFileSync(
      path.join(anydpiDir, `${name}.xml`),
      `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
</adaptive-icon>`
    );
  }

  console.log('✅ Android APK icon resource files updated successfully!');
}

generateIcons().catch((err) => {
  console.error('❌ Error generating icons:', err);
  process.exit(1);
});
