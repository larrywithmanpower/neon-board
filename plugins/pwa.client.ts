// @vite-pwa/nuxt 在 ssr:false 靜態模式不會自動注入 SW 註冊碼，
// 必須手動在 client plugin 呼叫 registerSW（否則無 active SW、不可安裝、無離線）
export default defineNuxtPlugin(async () => {
  try {
    // virtual:pwa-register 是 vite-plugin-pwa 的虛擬模組
    // @ts-expect-error 虛擬模組無型別定義
    const { registerSW } = await import('virtual:pwa-register')
    registerSW({ immediate: true })
  } catch {
    // 開發環境 devOptions 關閉時 import 會失敗，忽略
  }
})
