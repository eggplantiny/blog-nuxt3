import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
  ],
  buildModules: [
    'nuxt-windicss',
  ],
  css: [
    '@/assets/styles.scss'
  ],
  content: {
    highlight: {
      theme: 'solarized-dark',
    },
  },
})
