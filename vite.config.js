import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: '/' → the site lives at the root of its domain, with language pages at /en/, /nl/, /sq/.
// For a sub-folder (e.g. GitHub Pages without own domain) set base to '/<repo-name>/'.
export default defineConfig({
  plugins: [react()],
  base: '/',
  server: { port: 5174 },
});
