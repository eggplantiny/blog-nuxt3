import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@vueuse/nuxt',
  ],
  build: {
    transpile: ['@nuxt/content'],
  },
  buildModules: [
    '@pinia/nuxt',
    'nuxt-windicss',
  ],
  head: {
    link: [
      {
        rel: 'stylesheet',
        href: 'https://cdn.jsdelivr.net/gh/naen-nae/fonts@purge-cache-for-subsets/build/css/tway_air.css',
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com'
      },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOriginIsolated: true
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700&display=swap'
      }
    ],
  },
  css: [
    '@/assets/styles.scss',
  ],
  content: {
    documentDriven: true,
    highlight: {
      theme: 'github-dark',
    },
  },
})
