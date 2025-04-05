import { defineConfig } from 'vitest/config';
import dts from 'vite-plugin-dts';
import react from '@vitejs/plugin-react-swc';
import svgr from 'vite-plugin-svgr';
import { externalizeDeps } from 'vite-plugin-externalize-deps';

export default defineConfig({
  root: __dirname,
  build: {
    lib: {
      entry: { index: 'src/index.ts' },
      formats: ['es'],
    },
    sourcemap: true,
    minify: false,
    rollupOptions: {
      output: {
        preserveModules: true,
      },
    },
  },
  plugins: [
    react(),
    svgr({ include: '**/*.svg' }),
    dts({ entryRoot: 'src' }),
    externalizeDeps(),
  ],
  server: {
    port: 3002,
    open: true,
  },
  test: {
    coverage: {
      exclude: [
        '**/public/**',
        '**/types.ts',
        '**/*.test.tsx',
        '**/vite.config.ts',
        '**/node_modules/**',
        '**/dist/**',
        '**/*.d.ts',
      ],
    },
    environment: 'jsdom',
    globals: true,
    // setupFiles: './setup-tests.ts',
  },
});
