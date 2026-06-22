<script setup lang="ts">
import { useBoardStore, type BgType, type BoardMode, type ScrollDir } from '~/stores/board'

const board = useBoardStore()

defineEmits<{ close: [] }>()

const modes: { v: BoardMode; label: string }[] = [
  { v: 'marquee', label: '跑馬燈滾動' },
  { v: 'bigtext', label: '霓虹大字' },
]

const dirs: { v: ScrollDir; label: string }[] = [
  { v: 'left', label: '← 左' },
  { v: 'right', label: '右 →' },
  { v: 'up', label: '↑ 上' },
  { v: 'down', label: '↓ 下' },
]

const backgrounds: { v: BgType; label: string }[] = [
  { v: 'spiral', label: '霓虹漩渦' },
  { v: 'starfield', label: '星河' },
  { v: 'sparks', label: '火花' },
  { v: 'solid', label: '純色' },
]

const speeds = [0.5, 0.8, 1, 1.2, 1.5, 2, 2.5]
const scales = [1, 1.5, 2, 2.5, 3, 4]

// 文字 / 發光 / 純色背景共用色盤
const palette = [
  '#ffffff', '#a64bff', '#2dd4bf', '#ff3d8b', '#ff6b35',
  '#ffd166', '#4cc9f0', '#06d6a0', '#ef476f', '#b5179e',
  '#05010f', '#000000',
]

// 改動即存
function onChange() {
  board.save()
}
</script>

<template>
  <div class="panel">
    <div class="panel-head">
      <span>看板設定</span>
      <button class="x" @click="$emit('close')">✕</button>
    </div>

    <div class="panel-body">
      <!-- 顯示模式 -->
      <section>
        <h4>顯示模式</h4>
        <div class="row-scroll">
          <button
            v-for="m in modes" :key="m.v" class="btn"
            :class="{ 'is-active': board.mode === m.v }"
            @click="board.mode = m.v; onChange()"
          >{{ m.label }}</button>
        </div>
      </section>

      <!-- 文字內容 -->
      <section>
        <h4>文字內容</h4>
        <input
          v-model="board.text" class="text-input"
          placeholder="輸入要顯示的文字" maxlength="40"
          @input="onChange"
        >
      </section>

      <!-- 滾動方向（僅跑馬燈） -->
      <section v-if="board.mode === 'marquee'">
        <h4>滾動方向</h4>
        <div class="row-scroll">
          <button
            v-for="d in dirs" :key="d.v" class="btn"
            :class="{ 'is-active': board.direction === d.v }"
            @click="board.direction = d.v; onChange()"
          >{{ d.label }}</button>
        </div>
      </section>

      <!-- 滾動速度（僅跑馬燈） -->
      <section v-if="board.mode === 'marquee'">
        <h4>滾動速度</h4>
        <div class="row-scroll">
          <button
            v-for="s in speeds" :key="s" class="chip"
            :class="{ 'is-active': board.speed === s }"
            @click="board.speed = s; onChange()"
          >{{ s }}</button>
        </div>
      </section>

      <!-- 文字大小 -->
      <section>
        <h4>文字大小</h4>
        <div class="row-scroll">
          <button
            v-for="s in scales" :key="s" class="chip"
            :class="{ 'is-active': board.fontScale === s }"
            @click="board.fontScale = s; onChange()"
          >{{ s }}x</button>
        </div>
      </section>

      <!-- 文字顏色 -->
      <section>
        <h4>文字顏色</h4>
        <div class="row-scroll">
          <span
            v-for="c in palette" :key="c" class="swatch"
            :class="{ 'is-active': board.textColor === c }"
            :style="{ background: c }"
            @click="board.textColor = c; onChange()"
          />
        </div>
      </section>

      <!-- 文字陰影色彩（霓虹外發光） -->
      <section>
        <h4>霓虹光色</h4>
        <div class="row-scroll">
          <span
            v-for="c in palette" :key="c" class="swatch"
            :class="{ 'is-active': board.glowColor === c }"
            :style="{ background: c }"
            @click="board.glowColor = c; onChange()"
          />
        </div>
      </section>

      <!-- 背景 -->
      <section>
        <h4>背景動效</h4>
        <div class="row-scroll">
          <button
            v-for="b in backgrounds" :key="b.v" class="btn"
            :class="{ 'is-active': board.background === b.v }"
            @click="board.background = b.v; onChange()"
          >{{ b.label }}</button>
        </div>
      </section>

      <!-- 背景底色（純色時較有感，動效時為襯底） -->
      <section>
        <h4>背景底色</h4>
        <div class="row-scroll">
          <span
            v-for="c in palette" :key="c" class="swatch"
            :class="{ 'is-active': board.bgColor === c }"
            :style="{ background: c }"
            @click="board.bgColor = c; onChange()"
          />
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.panel {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  max-height: 62vh;
  background: rgba(12, 8, 24, 0.92);
  backdrop-filter: blur(16px);
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px 20px 0 0;
  display: flex;
  flex-direction: column;
  z-index: 20;
  padding-bottom: env(safe-area-inset-bottom);
}

.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px 8px;
  font-size: 16px;
  font-weight: 600;
}

.x {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 18px;
  cursor: pointer;
}

.panel-body {
  overflow-y: auto;
  padding: 4px 20px 20px;
}

section {
  margin-bottom: 18px;
}

h4 {
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 10px;
}

.text-input {
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.06);
  color: #fff;
  border-radius: 12px;
  padding: 12px 14px;
  font-size: 16px;
}

.text-input::placeholder {
  color: rgba(255, 255, 255, 0.35);
}
</style>
