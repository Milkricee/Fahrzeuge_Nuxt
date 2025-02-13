import { defineConfig } from 'vite/config'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'node:url'
import { resolve, dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom',
    globals: true
  },
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./', import.meta.url)),
      '@': fileURLToPath(new URL('./', import.meta.url)),
      '#app': resolve(__dirname, './node_modules/nuxt/dist/app'),
      '#head': resolve(__dirname, './node_modules/nuxt/dist/head/runtime'),
      '#imports': resolve(__dirname, './.nuxt/imports'),
      'vue-router': resolve(__dirname, './node_modules/vue-router'),
      'nuxt/app': resolve(__dirname, './node_modules/nuxt/dist/app')
    }
  }
})