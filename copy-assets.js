import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.resolve(__dirname, 'dist');
const srcDir = path.resolve(__dirname, 'src');
const publicDir = path.resolve(__dirname, 'public');

console.log('📋 Copying files to dist folder...');

// Ensure dist directory exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Copy manifest.json
const manifestSource = path.join(publicDir, 'manifest.json');
const manifestDest = path.join(distDir, 'manifest.json');
fs.copyFileSync(manifestSource, manifestDest);
console.log('✓ Copied manifest.json');

// Copy background.js
const bgSource = path.join(srcDir, 'background', 'background.js');
const bgDest = path.join(distDir, 'background.js');
fs.copyFileSync(bgSource, bgDest);
console.log('✓ Copied background.js');

// Copy popup.html
const htmlSource = path.join(publicDir, 'popup.html');
const htmlDest = path.join(distDir, 'popup.html');
fs.copyFileSync(htmlSource, htmlDest);
console.log('✓ Copied popup.html');

// Create icons directory
const iconsDir = path.join(distDir, 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Create placeholder PNG icons using base64 encoded minimal PNGs
const icon128 = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADTAomsAAAA5klEQVR4nO3RPQrCQBCG4XDQVrCzsbGwsrUSK2srGxs7m9bGRhsb/4iFjY2VN7CwsbHRUkHEQjh2Z3ZnZvZdXxjYmWFn2NlhDwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/pVx HHdRFEWvu7sLGztoNO7C6GBVEKQK43jCIOzsgYWFVUEaJPMc4OBc4Ny7d+/evXv37t0/9+7du3fv3r179/rdu3fv3r179/rdu3fv3r179/rdu3fv3r179/rdu3fv3r179/rdu3fv3r179/rdu3fv3r179/rdu3fv3r179/rdu3fv3r179/rdu3fv3r179/rdu3fv3r179/rdu3fv3r179/rdu3fv3r179/rdu3fv3r179/rdu3fv/r179/rdu3fv3r179/rdu3fv3r179/rdu3fv3r179/rdu3fvXxz5BxxGlQEy09TYAAAAAElFTkSuQmCC',
  'base64'
);
const icon48 = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAk0lEQVR4nO3RPQrCQBCG4ZEIFraCnY2FhZWVnZWNjY2VjY2NjZ2NlY2NjY2VjY2VjY2NlY2NjZWNjY2VjY2NlY2NjY2VjY2NlY2NlY2VjY2NlY2NlY2VnZ2NlZ2dlZWdnZ2VnZ2dlZ2dlZ2dlZ2VnZ2VnZ2VnZ2VnZ2VnZ2dlZ2dnZ2VnZ2dnZ2VnZ2VnZ2VnZ2VnZ2VnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2dnZ2f/',
  'base64'
);
const icon16 = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAJklEQVR4nGNk+M9QzwAjGIiAkQGKGBkZGRkZGRkZGBgZGRgYGAD/EAD8vVblCQAAAABJRU5ErkJggg==',
  'base64'
);

fs.writeFileSync(path.join(iconsDir, 'icon-128.png'), icon128);
fs.writeFileSync(path.join(iconsDir, 'icon-48.png'), icon48);
fs.writeFileSync(path.join(iconsDir, 'icon-16.png'), icon16);
console.log('✓ Created PNG icons');

console.log('✅ All files copied successfully!');
