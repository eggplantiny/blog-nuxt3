import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@nuxtjs/tailwindcss',
  ],
  build: {
    transpile: ['@nuxt/content'],
  },
  buildModules: [
    '@pinia/nuxt',
  ],
  head: {
    link: [
      {
        rel: 'stylesheet',
        href: 'https://cdn.jsdelivr.net/gh/naen-nae/fonts@purge-cache-for-subsets/build/css/tway_air.css',
      },
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
