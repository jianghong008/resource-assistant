import { defineConfig } from 'vite'
import { ViteComConfig } from './vite-com'


export default defineConfig(({  }) => {

  ViteComConfig.build = {
    outDir: 'dist/popup',
    emptyOutDir: false
  }
  ViteComConfig.base = '/popup/'
  ViteComConfig.define = {
    APP_ENV: '"popup"'
  }
  return ViteComConfig
})