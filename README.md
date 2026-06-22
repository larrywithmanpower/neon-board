# 🪧 Neon Board 霓虹看板

把手機變成高質感霓虹 LED 看板 —— 演唱會舉牌、接機、表白、倒數。

純前端 PWA，可「加到主畫面」當 App 用，**零廣告**。

## 功能

- 兩種顯示模式：跑馬燈滾動 / 霓虹大字定格
- 霓虹外發光文字（文字色 + 光色可調）
- 動態背景：霓虹漩渦 / 星河 / 火花 / 純色
- 滾動方向、速度、字級可調
- 全螢幕 + 橫向鎖定
- 分享連結（設定編碼進網址）
- PWA 離線可用

## 開發

```bash
npm install
npm run dev      # http://localhost:3080
```

## 部署

push 到 main 後由 GitHub Actions 自動 `nuxt generate` 並發佈到 GitHub Pages。

## 技術

Nuxt 3 (SSR off, SPA) · Vite 6 · Pinia · @vite-pwa/nuxt · Canvas 動態背景

> ⚠️ Vite 必鎖 v6（`overrides`）：Vite 7 會踩 `ssr:false` 的 `No entry found in rollupOptions.input` bug
