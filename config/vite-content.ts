import { defineConfig } from 'vite'
import { ViteComConfig } from './vite-com'

export default defineConfig(() => {
  ViteComConfig.build = {
    lib: {
      entry: 'src/cont/Content.tsx',
      name: 'MdContent',
      formats: ['umd'],
      fileName: () => `content.js`
    },
    outDir:'dist',
    emptyOutDir: false
  }
  ViteComConfig.define = {
    APP_ENV: '"content"'
  }
  return ViteComConfig
})
