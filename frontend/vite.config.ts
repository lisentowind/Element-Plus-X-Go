import { defineConfig, loadEnv } from 'vite'
import path from 'path'
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
      alias: [
        {
          find: '@',
          replacement: path.resolve(__dirname, 'src')
        },
        {
          find: 'wailsjs',
          replacement: path.resolve(__dirname, 'wailsjs')
        }
      ],
      extensions: ['.ts', '.js']
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
