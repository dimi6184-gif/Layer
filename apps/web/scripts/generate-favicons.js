const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function generateFavicons() {
  const logoPath = path.join(__dirname, '..', 'public', 'logo.png');
  const publicDir = path.join(__dirname, '..', 'public');
  const appDir = path.join(__dirname, '..', 'src', 'app');

  console.log('Generating favicons and icons from:', logoPath);

  // 1. icon.png (32x32 and 192x192)
  await sharp(logoPath)
    .resize(32, 32)
    .png()
    .toFile(path.join(appDir, 'icon.png'));
  console.log('✓ Created src/app/icon.png (32x32)');

  await sharp(logoPath)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'icon.png'));
  console.log('✓ Created public/icon.png (192x192)');

  // 2. apple-icon.png (180x180)
  await sharp(logoPath)
    .resize(180, 180)
    .png()
    .toFile(path.join(appDir, 'apple-icon.png'));
  console.log('✓ Created src/app/apple-icon.png (180x180)');

  await sharp(logoPath)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-icon.png'));
  console.log('✓ Created public/apple-icon.png (180x180)');

  // 3. Create a valid multi-size ICO file containing 16x16, 32x32, 48x48
  // Standard ICO header: 6 bytes header + 16 bytes per image directory entry + image raw data (PNG format supported in modern ICO)
  const sizes = [16, 32, 48];
  const pngBuffers = [];
  for (const s of sizes) {
    const buf = await sharp(logoPath).resize(s, s).png().toBuffer();
    pngBuffers.push({ size: s, buffer: buf });
  }

  // ICO header: reserved (2 bytes = 0), type (2 bytes = 1 for icon), count (2 bytes)
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngBuffers.length, 4);

  let offset = 6 + (16 * pngBuffers.length);
  const dirEntries = [];
  for (const item of pngBuffers) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(item.size, 0); // width
    entry.writeUInt8(item.size, 1); // height
    entry.writeUInt8(0, 2); // color palette (0 = no palette)
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(item.buffer.length, 8); // image size in bytes
    entry.writeUInt32LE(offset, 12); // file offset
    dirEntries.push(entry);
    offset += item.buffer.length;
  }

  const icoBuffer = Buffer.concat([
    header,
    ...dirEntries,
    ...pngBuffers.map(b => b.buffer)
  ]);

  fs.writeFileSync(path.join(appDir, 'favicon.ico'), icoBuffer);
  console.log('✓ Created src/app/favicon.ico with 16, 32, 48px');

  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
  console.log('✓ Created public/favicon.ico');

  // Also overwrite the framer extra images if they were used as favicons
  const extraImages = [
    path.join(publicDir, 'assets', 'images', 'image-extra-1.png'),
    path.join(publicDir, 'assets', 'images', 'image-extra-2.png'),
    path.join(publicDir, 'assets', 'images', 'image-extra-3.png'),
  ];
  for (const p of extraImages) {
    if (fs.existsSync(p)) {
      await sharp(logoPath).resize(64, 64).png().toFile(p);
      console.log(`✓ Replaced Framer favicon: ${path.basename(p)}`);
    }
  }

  console.log('\nAll favicons generated successfully!');
}

generateFavicons().catch(err => {
  console.error('Error generating favicons:', err);
  process.exit(1);
});
