import { defineConfig } from 'vite'
import { ViteComConfig } from './vite-com'


export default defineConfig(({  }) => {

  ViteComConfig.build = {
    outDir: 'dist/settings',
    emptyOutDir: false
  }
  ViteComConfig.base = '/settings/'
  ViteComConfig.define = {
    APP_ENV: '"settings"'
  }
  return ViteComConfig
})