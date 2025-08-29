// vite.config.ts (단일 파일 통합 버전)
/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'; // ⬅️ 포인트: vitest/config에서 가져오기!
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import tsconfigPaths from 'vite-tsconfig-paths';

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';

const dirname = path.dirname(fileURLToPath(import.meta.url));

// Storybook / Vitest 실행 시 PWA 비활성화
const isStorybook = process.env.STORYBOOK === '1' || process.env.VITEST === 'true';

export default defineConfig({
  plugins: [
    react(),
    !isStorybook &&
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: [
          'favicon.ico',
          'apple-touch-icon.png',
          'pwa-192x192.png',
          'pwa-512x512.png',
        ],
        manifest: {
          name: '대여해Young',
          short_name: '대여해Young',
          description: '대학생을 위한 물품 대여 서비스',
          theme_color: '#6C67FF',
          background_color: '#ffffff',
          display: 'standalone',
          icons: [
            { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
            { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          ],
        },
      }),
    tsconfigPaths(),
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // ⬇️ Vitest 설정을 같은 파일에 둔다
  test: {
    projects: [
      {
        extends: true,
        plugins: [
          // Storybook 스토리 기반 테스트
          storybookTest({
            configDir: path.join(dirname, '.storybook'),
          }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: 'playwright',
            instances: [{ browser: 'chromium' }],
          },
          setupFiles: ['.storybook/vitest.setup.ts'],
        },
      },
    ],
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://43.200.61.108:8082',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
