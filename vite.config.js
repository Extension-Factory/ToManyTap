import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-files',
      apply: 'build',
      generateBundle() {
        // Copy manifest.json
        const manifestContent = fs.readFileSync(
          resolve(__dirname, 'public/manifest.json'),
          'utf-8'
        );
        this.emitFile({
          type: 'asset',
          fileName: 'manifest.json',
          source: manifestContent,
        });

        // Copy background.js
        const bgContent = fs.readFileSync(
          resolve(__dirname, 'src/background/background.js'),
          'utf-8'
        );
        this.emitFile({
          type: 'asset',
          fileName: 'background.js',
          source: bgContent,
        });

        // Copy popup.html
        const htmlContent = fs.readFileSync(
          resolve(__dirname, 'public/popup.html'),
          'utf-8'
        ).replace('src="/popup.js"', 'src="/popup.js"');
        
        this.emitFile({
          type: 'asset',
          fileName: 'popup.html',
          source: htmlContent,
        });
      },
    },
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'src/popup/popup.jsx'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.css')) {
            return 'index.css';
          }
          return '[name].[ext]';
        },
      },
    },
  },
});
