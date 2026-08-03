import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const svgPath = path.join(rootDir, 'public', 'icon.svg');
const svgBuffer = fs.readFileSync(svgPath);

async function generateIcons() {
  console.log('🚀 Generating SUPAN APK Icons for Android & Capacitor...');

  // Ensure assets dir exists
  const assetsDir = path.join(rootDir, 'assets');
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  }

  // 1. Generate master PNG assets
  await sharp(svgBuffer).resize(1024, 1024).toFile(path.join(assetsDir, 'icon-only.png'));
  await sharp(svgBuffer).resize(1024, 1024).toFile(path.join(assetsDir, 'icon-foreground.png'));
  await sharp(svgBuffer).resize(2732, 2732).toFile(path.join(assetsDir, 'splash.png'));
  await sharp(svgBuffer).resize(512, 512).toFile(path.join(rootDir, 'public', 'icon.png'));

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
    await sharp(svgBuffer)
      .resize(size, size)
      .toFile(path.join(targetDir, 'ic_launcher.png'));

    // Round icon
    await sharp(svgBuffer)
      .resize(size, size)
      .toFile(path.join(targetDir, 'ic_launcher_round.png'));

    // Foreground icon for adaptive icons
    await sharp(svgBuffer)
      .resize(fgSize, fgSize)
      .toFile(path.join(targetDir, 'ic_launcher_foreground.png'));

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
      await sharp(svgBuffer)
        .resize(512, 512)
        .toFile(path.join(targetDir, 'splash.png'));
    }
  }

  console.log('✅ Android APK icon resource files updated successfully!');
}

generateIcons().catch((err) => {
  console.error('❌ Error generating icons:', err);
  process.exit(1);
});
