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
        new_purple: {
          500: { value: '#DACEF3' },
        },
        new_white: {
          400: { value: '#f5f5f5' },
          500: { value: '#fafaf8' },
        },
        accent: {
          50: { value: '#EEEFFF' },
          100: { value: '#DFE2FF' },
          200: { value: '#C5C7FF' },
          300: { value: '#A4A3FE' },
          400: { value: '#765FF5' },
          500: { value: '#7A6FFB' }, // ✅ 기준색
          600: { value: '#6841EA' },
          700: { value: '#5934CE' },
          800: { value: '#492DA6' },
          900: { value: '#3E2C83' },
          950: { value: '#261A4C' },
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
