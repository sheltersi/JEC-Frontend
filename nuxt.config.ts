/// <reference types="node" />

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@nuxt/eslint', '@nuxtjs/tailwindcss', '@pinia/nuxt', '@vueuse/nuxt', '@nuxt/icon'],

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3000',
    },
  },

  nitro: {
    devProxy: {
      '/api': {
        target: 'https://JEC.test',
        changeOrigin: true,
      },
    },
  },
})
