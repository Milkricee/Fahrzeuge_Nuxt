import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    vue(),
    tsconfigPaths() // Nutzt die Alias-Pfade aus tsconfig.json
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['tests/**/*.test.{ts,js}']
  },
});
