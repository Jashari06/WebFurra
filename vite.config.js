import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' → the built site works from any folder (GitHub Pages, sub-paths, plain hosting)
export default defineConfig({
  plugins: [react()],
  base: './',
  server: { port: 5174 },
});
