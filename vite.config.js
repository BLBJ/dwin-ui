import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path";
import fs from "fs";
// 用到的插件
// import dts from 'vite-plugin-dts';
// import DefineOptions from 'unplugin-vue-define-options/vite'
// 打包后的目录
const outDir = path.resolve('dwin-ui/dist');
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";

import pkg from './package.json'
const version = pkg.version;

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [
    vue(),
    createSvgIconsPlugin({
      // 指定需要缓存的图标文件夹
      iconDirs: [path.resolve(process.cwd(), "packages/svg")],
    }),
    {
      name: 'version-json-plugin',
      closeBundle() {
        // 定义输出路径
        const outputPath = path.resolve(__dirname, 'dwin-ui/dist', 'version.json');
        // 创建版本信息对象
        const versionInfo = {
          name: 'dwin-ui',
          version: version,
          buildTime: new Date().toLocaleString(),
        }
        // 写入文件
        fs.writeFileSync(outputPath, JSON.stringify(versionInfo, null, 2))
        console.log(`Version info written to ${outputPath}`)
      }
    }
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, './packages/index.js'),
      name: 'vangle',
      fileName: format => `index.${format}.js`
    },
    outDir: outDir,
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['vue'],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: 'Vue'
        },
         exports: 'named', // 按需引入
      },
     
    },
  },
  server: {
    host: "0.0.0.0",

    watch: {
      usePolling: true,   // 修复HMR热更新失效
    },
  },
  esbuild: {
    drop: ['console', 'debugger'], // 删除 所有的console 和 debugger
  }
})
