import { defineStore } from 'pinia'

// 顯示模式
export type BoardMode = 'marquee' | 'bigtext'
// 滾動方向（跑馬燈用）
export type ScrollDir = 'left' | 'right' | 'up' | 'down'
// 動態背景種類
export type BgType = 'solid' | 'spiral' | 'starfield' | 'sparks'

// 看板全部設定 — 也是分享連結會序列化的內容
export interface BoardState {
  mode: BoardMode
  text: string
  textColor: string   // 文字顏色
  glowColor: string   // 文字陰影色彩（霓虹外發光，靈魂設定）
  fontScale: number   // 字級倍率 1~4（相對視窗，不寫死 px 才能跨裝置）
  speed: number       // 跑馬燈速度 0.5~2.5
  direction: ScrollDir
  background: BgType
  bgColor: string     // 純色背景 / 動態背景底色
}

// 預設值：開箱即是 Boss 最愛的霓虹漩渦 + 白字紫光
const DEFAULTS: BoardState = {
  mode: 'marquee',
  text: '寂靜地平線',
  textColor: '#ffffff',
  glowColor: '#a64bff',
  fontScale: 2,
  speed: 1,
  direction: 'left',
  background: 'spiral',
  bgColor: '#05010f',
}

const STORAGE_KEY = 'neon-board:settings'

export const useBoardStore = defineStore('board', {
  state: (): BoardState => ({ ...DEFAULTS }),

  getters: {
    // 文字 + 多層 text-shadow 霓虹外發光（質感關鍵）
    textStyle(state): Record<string, string> {
      const g = state.glowColor
      return {
        color: state.textColor,
        textShadow: [
          '0 0 4px #fff',
          '0 0 11px #fff',
          `0 0 22px ${g}`,
          `0 0 44px ${g}`,
          `0 0 66px ${g}`,
        ].join(', '),
      }
    },
  },

  actions: {
    // 套用一組設定（分享連結載入 / 還原用）
    apply(patch: Partial<BoardState>) {
      Object.assign(this, patch)
    },
    reset() {
      this.apply({ ...DEFAULTS })
    },
    save() {
      if (import.meta.client) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.$state))
      }
    },
    load() {
      if (!import.meta.client) return
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) this.apply(JSON.parse(raw))
      } catch { /* 壞掉就用預設 */ }
    },
  },
})
