<script setup lang="ts">
import { useBoardStore } from '~/stores/board'
import DisplayStage from '~/components/DisplayStage.vue'
import SettingsPanel from '~/components/SettingsPanel.vue'

const board = useBoardStore()
const { loadFromUrl, copyShareLink } = useShareLink()

const panelOpen = ref(false)
const controlsVisible = ref(true)
const toast = ref('')
let hideTimer: ReturnType<typeof setTimeout> | null = null

// 全螢幕（PWA / 瀏覽器）
const isFullscreen = ref(false)
async function toggleFullscreen() {
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
        <button class="btn" @click="toggleFullscreen">
          {{ isFullscreen ? '⤡ 退出' : '⤢ 全螢幕' }}
        </button>
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

/* transitions */
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-up-enter-active, .slide-up-leave-active { transition: transform 0.28s ease; }
.slide-up-enter-from, .slide-up-leave-to { transform: translateY(100%); }
</style>
