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

let allFilesFound = true;

filesToCopy.forEach(file => {
  const sourcePath = path.join(sourceDir, file);
  const targetPath = path.join(targetDir, file);
  
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, targetPath);
    console.log(`✅ Copied ${file} to static directory`);
  } else {
    console.warn(`⚠️  Warning: ${file} not found in ${sourceDir}`);
    allFilesFound = false;
    
    // Create placeholder files to prevent build errors
    if (file.endsWith('.js')) {
      const placeholderContent = `// Placeholder for ${file} - Rust modules not built
console.warn('Rust WASM modules not available. Some features may be disabled.');
export default {};
`;
      fs.writeFileSync(targetPath, placeholderContent);
      console.log(`📝 Created placeholder ${file}`);
    } else if (file.endsWith('.wasm')) {
      // Create empty WASM file placeholder
      fs.writeFileSync(targetPath, Buffer.alloc(0));
      console.log(`📝 Created empty WASM placeholder ${file}`);
    }
  }
});

if (!allFilesFound) {
  console.log('⚠️  Some WASM files were missing. Placeholders created to allow frontend build.');
  console.log('💡 To build Rust modules, you may need to use a different platform or install Rust toolchain manually.');
}

console.log('WASM files copy complete!');
