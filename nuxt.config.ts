import path from 'path';
import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  alias: { "@": path.resolve(new URL('.', import.meta.url).pathname) },
  css: ["~/assets/main.css"],
  modules: ["@nuxtjs/tailwindcss",
            '@nuxt/test-utils/module',
            ],
  plugins: ["~/plugins/supabase.js"], // Supabase-Plugin laden
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
});
