const fs = require('fs');
const path = require('path');

const jsDir = 'C:/Users/Dimi/Documents/Discordbot/apps/web/public/assets/js';
if (!fs.existsSync(jsDir)) {
  console.log('JS directory does not exist yet.');
  process.exit(0);
}

const files = fs.readdirAll ? [] : fs.readdirSync(jsDir).filter(f => f.startsWith('script_main') && f.endsWith('.mjs'));

function replacePath(src, fromPath, toPath) {
  const searchStr = 'path:`' + fromPath + '`';
  const replaceStr = 'path:`' + toPath + '`';
  if (src.includes(searchStr)) {
    return { result: src.split(searchStr).join(replaceStr), changed: true };
  }
  return { result: src, changed: false };
}

for (const file of files) {
  const filePath = path.join(jsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let changes = 0;

  ['/sign-in', '/sign-up', '/otp', '/account', '/contact'].forEach(p => {
    const r = replacePath(content, p, '/__framer' + p);
    if (r.changed) {
      content = r.result;
      changes++;
      console.log(`[${file}] Patched ${p} -> /__framer${p}`);
    }
  });

  if (changes > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`[${file}] Done. Applied ${changes} patches.`);
  } else {
    console.log(`[${file}] Clean export: No legacy routes found (already removed in Framer).`);
  }
}
