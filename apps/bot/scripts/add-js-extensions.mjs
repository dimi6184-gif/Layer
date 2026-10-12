#!/usr/bin/env node
// scripts/add-js-extensions.mjs
// Post-build script: adds .js extensions to all relative imports in dist/ files
import { readdir, readFile, writeFile } from 'fs/promises';
import { join, extname } from 'path';

async function getAllFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await getAllFiles(full)));
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      files.push(full);
    }
  }
  return files;
}

const distDir = new URL('../dist', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1');

const files = await getAllFiles(distDir);

for (const file of files) {
  const original = await readFile(file, 'utf8');
  // Add .js to relative imports that have no extension
  const updated = original.replace(
    /(from\s+['"])(\.{1,2}\/[^'"]+?)(['"])/g,
    (_, prefix, path, suffix) => {
      if (extname(path)) return _ ; // already has extension
      return `${prefix}${path}.js${suffix}`;
    }
  ).replace(
    /(import\(['"])(\.{1,2}\/[^'"]+?)(['"]\))/g,
    (_, prefix, path, suffix) => {
      if (extname(path)) return _;
      return `${prefix}${path}.js${suffix}`;
    }
  );
  if (updated !== original) {
    await writeFile(file, updated, 'utf8');
    console.log(`✓ ${file.split('dist')[1]}`);
  }
}
console.log(`\nDone! Processed ${files.length} files.`);
