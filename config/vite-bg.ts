import { defineConfig } from 'vite'
import { ViteComConfig } from './vite-com'


export default defineConfig(({  }) => {

  ViteComConfig.build = {
    lib: {
      entry: 'src/background.ts',
      name: 'MdContent',
      formats: ['umd'],
      fileName: () => `background.js`
    },
    outDir: 'dist',
    copyPublicDir: false,
    emptyOutDir: false
  }
  ViteComConfig.define = {
    APP_ENV: '"background"'
  }
  return ViteComConfig
})
