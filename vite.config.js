import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  root: 'src',
  base: '/',
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
    },
  },
  publicDir: 'public',
  build: {
    outDir: '../dist',
  },
  server: {
    port: 3000,
  },
  test: {
    environment: 'happy-dom',
  },
})
