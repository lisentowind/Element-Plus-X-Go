import path from 'node:path'
import process from 'node:process'
import { defineConfig, loadEnv } from 'vite'
import plugins from './.build/plugins'

// https://vite.dev/config/
export default defineConfig((cnf) => {
  const { mode } = cnf
  const env = loadEnv(mode, process.cwd())
  const { VITE_APP_ENV } = env
  return {
    base: VITE_APP_ENV === 'production' ? '/' : '/',
    plugins: plugins(cnf),
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        'wailsjs': path.resolve(__dirname, '../wailsjs')
      }
    },
    css: {
      // css全局变量使用，@/styles/variable.scss文件
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/styles/var.scss" as *;'
        }
      }
    }
  }
})
