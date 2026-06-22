// https://nuxt.com/docs/api/configuration/nuxt-config

// 純靜態 PWA：手機可「加到主畫面」當 App 用
// 本地 dev 用 npm run dev（port 3080），baseURL 預設 /
// GitHub Pages 部署在 https://<user>.github.io/neon-board/，故 prod baseURL = /neon-board/
// 本地 dev 預設 /（npm run dev）
const isProd = process.env.NODE_ENV === 'production'
const baseURL = process.env.NUXT_APP_BASE_URL ?? (isProd ? '/neon-board/' : '/')

export default defineNuxtConfig({
  compatibilityDate: '2026-04-25',
  devtools: { enabled: false },

  modules: [
    '@pinia/nuxt',
    '@vite-pwa/nuxt',
  ],

  // 純前端靜態網站
  ssr: false,

  app: {
    baseURL,
    head: {
      title: 'Neon Board 霓虹看板',
      htmlAttrs: { lang: 'zh-Hant' },
      meta: [
        { charset: 'utf-8' },
        // viewport-fit=cover 讓全螢幕吃滿瀏海/圓角
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover' },
        { name: 'description', content: '把手機變成高質感霓虹 LED 看板 — 跑馬燈、舉牌、倒數' },
        { name: 'theme-color', content: '#05010f' },
        // iOS 全螢幕 PWA
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: `${baseURL}favicon-64.png` },
        { rel: 'apple-touch-icon', sizes: '180x180', href: `${baseURL}apple-touch-icon-180x180.png` },
        // 手動掛 manifest（vite-pwa 在 ssr:false + generate 模式不會自動注入）
        { rel: 'manifest', href: `${baseURL}manifest.webmanifest` },
      ],
    },
  },

  css: [
    '~/assets/styles/main.css',
  ],

  // PWA：加到主畫面當 App，深色全螢幕
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Neon Board 霓虹看板',
      short_name: 'NeonBoard',
      description: '高質感霓虹 LED 手機看板',
      theme_color: '#05010f',
      background_color: '#05010f',
      lang: 'zh-Hant',
      display: 'standalone',
      orientation: 'any',
      start_url: baseURL,
      scope: baseURL,
      icons: [
        { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
        { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
        { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
    },
    workbox: {
      globPatterns: ['**/*.{js,css,html,png,svg,ico,woff2}'],
    },
    devOptions: {
      enabled: false,
      type: 'module',
    },
  },
})
