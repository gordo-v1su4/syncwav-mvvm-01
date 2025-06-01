import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import path from 'path';

export default defineConfig({
  plugins: [sveltekit()],
  resolve: {
    alias: {
      $lib: path.resolve('./src/lib'),
    },
  },
  test: {
    include: ['src/**/*.{test,spec}.{js,ts}'],
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./setupTests.ts'],
    clearMocks: true,
    restoreMocks: true,
    // Ensure compatibility with Vite 6
    server: {
      deps: {
        inline: ['@sveltejs/kit'],
      },
    },
  },
  // Explicitly set Vite version
  define: {
    'import.meta.vitest': 'undefined',
  },
});