<script setup lang="ts">
import { useBoardStore } from '~/stores/board'
import DisplayStage from '~/components/DisplayStage.vue'
import SettingsPanel from '~/components/SettingsPanel.vue'

const board = useBoardStore()
const { loadFromUrl, copyShareLink } = useShareLink()

const panelOpen = ref(false)
const controlsVisible = ref(true)
const toast = ref('')
const showInstallHint = ref(false)
let hideTimer: ReturnType<typeof setTimeout> | null = null

// 平台 / 能力偵測
const isIOS = ref(false)
const isStandalone = ref(false)   // 已是「加到主畫面」開啟（chrome-less）
const canFullscreen = ref(false)  // 瀏覽器是否支援 Fullscreen API（iPhone Safari 不支援）

// 全螢幕（PWA / 瀏覽器）
const isFullscreen = ref(false)
async function toggleFullscreen() {
  // iPhone Safari 沒有 Fullscreen API → 引導加到主畫面
  if (!canFullscreen.value) {
    showInstallHint.value = true
    return
  }
  try {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen()
      isFullscreen.value = true
      // 嘗試鎖定橫向（支援的瀏覽器才有效）
      try { await (screen.orientation as any)?.lock?.('landscape') } catch { /* 忽略 */ }
    } else {
      await document.exitFullscreen()
      isFullscreen.value = false
    }
  } catch { /* 部分瀏覽器不支援 */ }
}

// 點畫面：開關控制列（看板全螢幕時隱藏按鈕）
function tapStage() {
  if (panelOpen.value) return
  controlsVisible.value = !controlsVisible.value
  scheduleHide()
}

function scheduleHide() {
  if (hideTimer) clearTimeout(hideTimer)
  if (controlsVisible.value) {
    hideTimer = setTimeout(() => { controlsVisible.value = false }, 3500)
  }
}

async function onShare() {
  const ok = await copyShareLink()
  showToast(ok ? '分享連結已複製' : '複製失敗，請手動複製網址')
}

function showToast(msg: string) {
  toast.value = msg
  setTimeout(() => { toast.value = '' }, 2000)
}

onMounted(() => {
  // 優先吃分享連結，其次讀本機儲存
  if (!loadFromUrl()) board.load()
  scheduleHide()

  // 平台偵測
  const ua = navigator.userAgent
  isIOS.value = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  isStandalone.value = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone === true
  canFullscreen.value = !!document.documentElement.requestFullscreen

  document.addEventListener('fullscreenchange', () => {
    isFullscreen.value = !!document.fullscreenElement
  })
})
</script>

<template>
  <div class="app">
    <!-- 點擊區（開關控制列） -->
    <div class="tap-layer" @click="tapStage">
      <DisplayStage />
    </div>

    <!-- 頂部控制列 -->
    <transition name="fade">
      <div v-show="controlsVisible && !panelOpen" class="controls">
        <button class="btn" @click="panelOpen = true">⚙️ 設定</button>
        <div class="spacer" />
        <button class="btn" @click="onShare">🔗 分享</button>
        <button v-if="!isStandalone" class="btn" @click="toggleFullscreen">
          <template v-if="!canFullscreen">📲 加到主畫面</template>
          <template v-else>{{ isFullscreen ? '⤡ 退出' : '⤢ 全螢幕' }}</template>
        </button>
      </div>
    </transition>

    <!-- 加到主畫面教學（iPhone Safari 無 Fullscreen API，靠 standalone 達成全螢幕） -->
    <transition name="fade">
      <div v-if="showInstallHint" class="hint-mask" @click="showInstallHint = false">
        <div class="hint-card" @click.stop>
          <h3>📲 加到主畫面 = 全螢幕</h3>
          <p v-if="isIOS">
            iPhone / iPad 請用 <b>Safari</b> 開啟，然後：
          </p>
          <p v-else>
            請依瀏覽器選單操作：
          </p>
          <ol>
            <li>點底部（或右上）的<b>分享 / 選單</b>鈕</li>
            <li>選「<b>加入主畫面</b>」</li>
            <li>從主畫面圖示開啟 → 自動<b>全螢幕無工具列</b></li>
          </ol>
          <p class="hint-note">
            ※ iPhone 限用 Safari，LINE / Chrome 等內建瀏覽器看不到「加入主畫面」
          </p>
          <button class="btn hint-ok" @click="showInstallHint = false">知道了</button>
        </div>
      </div>
    </transition>

    <!-- 設定面板 -->
    <transition name="slide-up">
      <SettingsPanel v-if="panelOpen" @close="panelOpen = false" />
    </transition>

    <!-- 提示 -->
    <transition name="fade">
      <div v-if="toast" class="toast">{{ toast }}</div>
    </transition>
  </div>
</template>

<style scoped>
.app {
  position: fixed;
  inset: 0;
  overflow: hidden;
}

.tap-layer {
  position: absolute;
  inset: 0;
}

.controls {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  gap: 10px;
  align-items: center;
  padding: calc(env(safe-area-inset-top) + 14px) 16px 14px;
  z-index: 10;
}

.spacer {
  flex: 1;
}

.toast {
  position: absolute;
  bottom: 12%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.18);
  padding: 10px 18px;
  border-radius: 999px;
  font-size: 14px;
  z-index: 30;
  backdrop-filter: blur(8px);
}

/* 加到主畫面教學浮層 */
.hint-mask {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 40;
  padding: 24px;
}

.hint-card {
  max-width: 360px;
  background: rgba(18, 12, 32, 0.96);
  border: 1px solid rgba(166, 75, 255, 0.4);
  border-radius: 18px;
  padding: 24px;
  box-shadow: 0 0 30px rgba(166, 75, 255, 0.35);
}

.hint-card h3 {
  font-size: 18px;
  margin-bottom: 14px;
}

.hint-card p {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 10px;
}

.hint-card ol {
  padding-left: 20px;
  margin-bottom: 12px;
}

.hint-card li {
  font-size: 14px;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.9);
}

.hint-note {
  font-size: 12px !important;
  color: rgba(255, 255, 255, 0.5) !important;
}

.hint-ok {
  width: 100%;
  margin-top: 8px;
}

/* transitions */
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-up-enter-active, .slide-up-leave-active { transition: transform 0.28s ease; }
.slide-up-enter-from, .slide-up-leave-to { transform: translateY(100%); }
</style>
