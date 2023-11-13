import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';
import { VantResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),
    Components({
      resolvers: [VantResolver()],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, "src")
    }
  },
  base:'/',
  css:{
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/assets/css/reset.scss";`//引用公共样式，使用vite搭建项目只安装sass即可，不需要安装node-sass,sass-loader
      }
    }
  },
  // server: {hmr: {protocol: 'ws',host: '127.0.0.1',}}
})
