import { defineNuxtConfig } from 'nuxt'
import { PugExtractor } from 'vite-plugin-windicss'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  meta: {
    htmlAttrs: {
      lang: 'zh-cn'
    },
    title: 'satori',
    //meta: [
    //  { charset: 'utf-8' },
    //  { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    //  { name: 'viewport', content: 'width=device-width, initial-scale=1.0,user-scalable=no' }
    //],
  },
  buildModules: [
    'nuxt-windicss',
  ],
  windicss: {
    config: {
      extract: {
        extractors: [{
          extractor: PugExtractor,
          extensions: ['vue', 'pug']
        }]
      }
    }
  },
  //vite: {
  //  server: {
  //    proxy: {
  //      "/api": {
  //        target: "http://localhost:2333",
  //        changeOrigin: true,
  //        rewrite: (path) => path.replace(/^\/api/, ""),
  //      },
  //      "/data": {
  //        target: "http://localhost:2333",
  //        changeOrigin: true,
  //      },
  //    },
  //  },
  //},
})
