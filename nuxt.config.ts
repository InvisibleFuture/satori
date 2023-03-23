import { defineNuxtConfig } from 'nuxt/config'
import { PugExtractor } from 'vite-plugin-windicss'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: ['nuxt-windicss'],
  app: {
    head: {
      title: 'satori',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0,user-scalable=no' }
      ]
    },
  },
  windicss: {
    config: {
      extract: {
        extractors: [{
          extractor: PugExtractor,
          extensions: ['vue', 'pug'],
        }]
      },
    },
  },
  nitro: {
    storage: {
      blog: {
        driver: 'fs',
        base: './data/blog'
      },
      user: {
        driver: 'fs',
        base: './data/user'
      },
    },
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
