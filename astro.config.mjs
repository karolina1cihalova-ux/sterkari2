// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
    // Dev only: pre-bundle React + Sonner so islands hydrate (otherwise react-dom/client loads as raw CommonJS)
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime', 'react/jsx-dev-runtime', 'sonner'],
    },
  },

  integrations: [react()]
});