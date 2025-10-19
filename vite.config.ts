import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import path from 'path';

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    fs: {
      // allow convex folder to be served
      allow: ['..', path.resolve(__dirname, 'convex')],
    },
  },
});
