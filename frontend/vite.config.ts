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
    },
    build: {
      minify: 'terser',
      terserOptions: {
        compress: {
          // 生产环境时移除console.log()
          drop_console: true,
          drop_debugger: true
        }
      },
      //   关闭文件计算
      reportCompressedSize: false,
      //   关闭生成map文件 可以达到缩小打包体积
      sourcemap: false, // 这个生产环境一定要关闭，不然打包的产物会很大
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return id.toString().match(/node_modules\/(?!.pnpm)(?<moduleName>[^/]*)\//)?.groups!.moduleName ?? 'vendor'
            }
          },
          // 核心配置：按类型分目录
          assetFileNames: (assetInfo) => {
            // 将 CSS 文件放入 css 目录
            if (assetInfo.name?.endsWith('.css')) {
              return 'css/[name]-[hash][extname]'
            }
            // 其他资源文件（图片、字体等）放入 assets 目录
            return 'assets/[name]-[hash][extname]'
          },
          // JS 文件分两类存放
          chunkFileNames: 'js/chunks/[name]-[hash].js', // 代码分割产生的 chunk
          entryFileNames: 'js/entries/[name]-[hash].js' // 入口文件
        }
      },
      chunkSizeWarningLimit: 500,
      outDir: 'dist'
    }
  }
})
