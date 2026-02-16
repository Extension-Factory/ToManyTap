#!/bin/bash

# Build script for ToManyTab
# This script builds the extension and creates icon files

echo "🔨 Building ToManyTab extension..."

# Build with Vite
npm run build

# Create icons directory
mkdir -p dist/icons

# Create simple SVG icons and convert to data URLs for manifest
# For now, we'll create placeholder PNG files by converting SVG
echo "📦 Creating icon files..."

# Create a simple 128x128 icon
cat > dist/icons/icon-128.svg << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <rect width="128" height="128" fill="#8B5CF6"/>
  <text x="64" y="74" font-size="80" font-weight="bold" text-anchor="middle" fill="white">📑</text>
</svg>
EOF

cat > dist/icons/icon-48.svg << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
  <rect width="48" height="48" fill="#8B5CF6"/>
  <text x="24" y="36" font-size="32" font-weight="bold" text-anchor="middle" fill="white">📑</text>
</svg>
EOF

cat > dist/icons/icon-16.svg << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
  <rect width="16" height="16" fill="#8B5CF6"/>
  <text x="8" y="13" font-size="12" font-weight="bold" text-anchor="middle" fill="white">📑</text>
</svg>
EOF

echo "✅ Build complete! Extension is ready in the 'dist' folder."
echo ""
echo "📋 Next steps:"
echo "1. Open Chrome and go to chrome://extensions/"
echo "2. Enable 'Developer mode' (top right)"
echo "3. Click 'Load unpacked' and select the 'dist' folder"
echo "4. The ToManyTab extension should now appear in your extensions!"
