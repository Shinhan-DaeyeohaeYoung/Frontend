/* src/theme/system.ts */
import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react';

const config = defineConfig({
  theme: {
    breakpoints: {
      xs: '375px',
      mobile: '520px',
    },
    tokens: {
      colors: {
        new_white: {
          500: { value: '#fafaf8' },
        },
        accent: {
          50: { value: '#F3F2FF' },
          100: { value: '#E5E3FF' },
          200: { value: '#D5D3FF' },
          300: { value: '#CCC9FF' },
          400: { value: '#C3C0FF' },
          // 500: { value: '#006AFF' }, //  기준색
          500: { value: '#7A6FFB' }, //  기준색
          600: { value: '#9B94F0' },
          700: { value: '#776ED8' },
          800: { value: '#5B50B0' },
          900: { value: '#413589' },

          950: { value: '#2A2166' },
        },
      },
      fonts: {
        pretendard: {
          value: 'Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
        },
        body: { value: '{fonts.pretendard}' },
        heading: { value: '{fonts.pretendard}' },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
