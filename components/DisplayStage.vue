<script setup lang="ts">
import { useBoardStore } from '~/stores/board'
import NeonSpiral from '~/components/backgrounds/NeonSpiral.vue'
import Starfield from '~/components/backgrounds/Starfield.vue'
import Sparks from '~/components/backgrounds/Sparks.vue'

const board = useBoardStore()

// 依背景種類選對應元件（solid 不渲染 canvas）
const bgComponent = computed(() => {
  switch (board.background) {
    case 'spiral': return NeonSpiral
    case 'starfield': return Starfield
    case 'sparks': return Sparks
    default: return null
  }
})

// 跑馬燈動畫：速度越大越快 → duration 反比
const marqueeStyle = computed(() => {
  const duration = 12 / board.speed
  const isVertical = board.direction === 'up' || board.direction === 'down'
  return {
    animationDuration: `${duration}s`,
    animationName: `scroll-${board.direction}`,
    flexDirection: isVertical ? 'column' : 'row',
  } as Record<string, string>
})

// 字級：相對視窗高度，跨裝置一致
const fontSize = computed(() => `${board.fontScale * 12}vmin`)
</script>

<template>
  <div class="stage" :style="{ background: board.bgColor }">
    <!-- 動態背景層 -->
    <component :is="bgComponent" v-if="bgComponent" />

    <!-- 跑馬燈模式 -->
    <div v-if="board.mode === 'marquee'" class="marquee" :style="marqueeStyle">
      <span class="marquee-text" :style="[board.textStyle, { fontSize }]">{{ board.text }}</span>
      <span class="marquee-text" :style="[board.textStyle, { fontSize }]">{{ board.text }}</span>
    </div>

    <!-- 大字定格模式 -->
    <div v-else class="bigtext">
      <span class="big-text" :style="[board.textStyle, { fontSize }]">{{ board.text }}</span>
    </div>
  </div>
</template>

<style scoped>
.stage {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

/* 跑馬燈 */
.marquee {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  white-space: nowrap;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  will-change: transform;
}

.marquee-text {
  font-weight: 800;
  line-height: 1;
  padding: 0 0.4em;
}

/* 大字定格 */
.bigtext {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4vmin;
}

.big-text {
  font-weight: 900;
  line-height: 1.05;
  word-break: break-word;
}
</style>
