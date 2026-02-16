import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, 'public');
const sourceImage = path.join(publicDir, 'icon512.png');

// 리사이즈할 사이즈들
const sizes = [
  { size: 16, name: 'icon16.png' },
  { size: 32, name: 'icon32.png' },
  { size: 48, name: 'icon48.png' },
  { size: 128, name: 'icon128.png' },
];

// public 폴더가 없으면 만들기
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

async function resizeIcons() {
  try {
    console.log('🎨 아이콘 리사이즈 시작...');
    
    for (const { size, name } of sizes) {
      const outputPath = path.join(publicDir, name);
      
      await sharp(sourceImage)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 }
        })
        .png()
        .toFile(outputPath);
      
      console.log(`✅ ${size}×${size}px 아이콘 생성: ${name}`);
    }
    
    console.log('\n🎉 모든 아이콘이 성공적으로 생성되었습니다!');
  } catch (error) {
    console.error('❌ 아이콘 리사이즈 실패:', error);
    process.exit(1);
  }
}

resizeIcons();
