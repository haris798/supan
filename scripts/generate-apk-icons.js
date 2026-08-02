import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();

// Source of truth: the committed light icon (bowl + SUPAN text already baked
// in as pixels). No SVG rendering, no fontconfig, no gradient support
// required — this works identically in local builds and GitHub Actions.
const iconSourcePath = path.join(rootDir, 'public', 'icon.png');

async function generateIcons() {
  console.log('🚀 Generating SUPAN APK Icons for Android & Capacitor...');

  if (!fs.existsSync(iconSourcePath)) {
    console.error(`❌ Icon source not found: ${iconSourcePath}`);
    process.exit(1);
  }

  const iconBuffer = fs.readFileSync(iconSourcePath);

  // Render master 1024x1024 icon from the PNG source
  const masterBuffer = await sharp(iconBuffer).resize(1024, 1024).png().toBuffer();

  // Ensure assets dir exists
  const assetsDir = path.join(rootDir, 'assets');
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }

  // 1. Generate master PNG assets
  await sharp(masterBuffer).resize(1024, 1024).toFile(path.join(assetsDir, 'icon-only.png'));
  await sharp(masterBuffer).resize(1024, 1024).toFile(path.join(assetsDir, 'icon-foreground.png'));
  await sharp(masterBuffer).resize(2732, 2732).toFile(path.join(assetsDir, 'splash.png'));

  console.log('✅ Generated master assets in /assets (source: public/icon.png)');

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
