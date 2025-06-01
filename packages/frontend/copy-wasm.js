// Script to copy WASM files from rust-modules/pkg to frontend/static
import fs from 'fs';
import path from 'path';

const sourceDir = path.resolve('../rust-modules/pkg');
const targetDir = path.resolve('./static');

// Make sure the target directory exists
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Files to copy
const filesToCopy = [
  'artivus_rust_modules_bg.wasm',
  'artivus_rust_modules.js',
  'artivus_rust_modules_bg.js'
];

console.log('Copying WASM files to frontend static directory...');

filesToCopy.forEach(file => {
  const sourcePath = path.join(sourceDir, file);
  const targetPath = path.join(targetDir, file);
  
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, targetPath);
    console.log(`✅ Copied ${file} to static directory`);
  } else {
    console.error(`❌ Error: ${file} not found in ${sourceDir}`);
  }
});

console.log('WASM files copy complete!');
