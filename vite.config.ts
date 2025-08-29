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
        injectRegister: 'auto',
        includeAssets: [
          'favicon.ico',
          'apple-touch-icon.png',
          'pwa-192x192.png',
          'pwa-512x512.png',
        ],
        devOptions: {
          enabled: true, // ✅ 개발 모드에서 PWA 테스트 가능
        },
        workbox: {
          // ❌ 문제가 있는 설정
          // globPatterns: ['**/*.{js,css,html,ico,png,svg}'],

          // ✅ 수정된 설정
          globPatterns: ['**/*.{js,css,html}'],
          globDirectory: 'dist', // 빌드된 폴더 지정

          // ✅ 오프라인 지원 설정
          navigateFallback: '/index.html',
          navigateFallbackAllowlist: [/^\/$/],

          runtimeCaching: [
            {
              urlPattern: /^https:\/\/.*\.(png|jpg|jpeg|svg|gif)$/,
              handler: 'CacheFirst',
              options: {
                cacheName: 'images',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 30 * 24 * 60 * 60, // 30일
                },
              },
            },
            // ✅ API 요청 캐싱 추가
            {
              urlPattern: /^https:\/\/.*\/api\/.*/,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'api-cache',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 5 * 60, // 5분
                },
              },
            },
          ],
        },
        manifest: {
          name: '대여해Young', // ✅ 서비스 이름으로 변경
          short_name: '대여해Young', // ✅ 짧은 이름도 동일하게
          description: '대학생을 위한 물품 대여 서비스 PWA', // ✅ 설명도 서비스에 맞게 변경
          theme_color: '#6C67FF',
          background_color: '#ffffff', // ✅ 배경색 추가
          display: 'standalone',
          orientation: 'portrait', // ✅ 화면 방향 설정
          start_url: '/',
          scope: '/', // ✅ 범위 설정
          icons: [
            { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
            { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
            {
              src: 'pwa-512x512-maskable.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable',
            },
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
