// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  // Configuration pour VeeValidate/Zod
  vue: {
    defineModel: true,
    propsDestructure: true
  },
  ui: {
    icons: ['heroicons'],
    global: true,
    fonts: {
      sans: 'Poppins'
    },
  },
  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    '@nuxtjs/i18n',
  ],

  css: [
    '@/assets/fonts/index.scss',
    '@/assets/css/main.css'      // Tailwind
  ],

  fonts: {
    provider: 'none' // désactive l'appel à https://api.fontsource.org
  },

  i18n: {
    locales: [
      { code: 'fr', iso: 'fr-FR', name: 'Français' },
      { code: 'en', iso: 'en-US', name: 'English' }
    ],
    /*lazy: true,
    langDir: 'locales',*/
    defaultLocale: 'fr',
    fallbackLocale: "fr",
    strategy: 'no_prefix',
  },

  pinia: {
    autoImports: ['defineStore', 'storeToRefs'],
  },
  
  app: {
    head: {
      htmlAttrs: { lang: 'fr' },
      // Application de la classe Tailwind pour Poppins
      bodyAttrs: { class: 'bg-gray-100' } 
    }
  },

  devServer: {
    hmr: {
      host: 'localhost',
      port: 0, // 0 = choisir automatiquement un port libre
    }
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
})
