import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { codeInspectorPlugin } from 'code-inspector-plugin'

export default defineConfig({
  plugins: [vue(),codeInspectorPlugin({
    bundler: 'vite'
  })],
  base: '/',
  server: {
    host: '0.0.0.0',
    port: 3000,
    proxy: {
      '/endpoint': {
        target: 'http://10.17.0.10:8211/',
        changeOrigin: true
      }
    }
  }
})
