<script setup lang="ts">
// 星河：星點往畫面外飛，營造穿越星空感
const canvas = ref<HTMLCanvasElement | null>(null)
let raf = 0
let ctx: CanvasRenderingContext2D | null = null
let w = 0
let h = 0
let dpr = 1

interface Star { x: number; y: number; z: number }
let stars: Star[] = []
const COUNT = 220

function resize() {
  const c = canvas.value
  if (!c) return
  dpr = Math.min(window.devicePixelRatio || 1, 2)
  w = c.clientWidth
  h = c.clientHeight
  c.width = w * dpr
  c.height = h * dpr
  ctx = c.getContext('2d')
  ctx?.setTransform(dpr, 0, 0, dpr, 0, 0)
}

function spawn(): Star {
  return { x: (Math.random() - 0.5) * w, y: (Math.random() - 0.5) * h, z: Math.random() * w }
}

function frame() {
  if (!ctx) return
  ctx.fillStyle = 'rgba(5, 1, 15, 0.35)'
  ctx.fillRect(0, 0, w, h)
  const cx = w / 2
  const cy = h / 2
  for (const s of stars) {
    s.z -= 4
    if (s.z <= 1) Object.assign(s, spawn())
    const k = 128 / s.z
    const px = cx + s.x * k
    const py = cy + s.y * k
    const size = (1 - s.z / w) * 2.5
    const hue = 200 + (s.z / w) * 80
    ctx.beginPath()
    ctx.arc(px, py, Math.max(size, 0.4), 0, Math.PI * 2)
    ctx.fillStyle = `hsl(${hue}, 90%, 75%)`
    ctx.shadowBlur = 8
    ctx.shadowColor = `hsl(${hue}, 100%, 70%)`
    ctx.fill()
  }
  raf = requestAnimationFrame(frame)
}

onMounted(() => {
  resize()
  stars = Array.from({ length: COUNT }, spawn)
  window.addEventListener('resize', resize)
  raf = requestAnimationFrame(frame)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  window.removeEventListener('resize', resize)
})
</script>

<template>
  <canvas ref="canvas" class="bg-canvas" />
</template>

<style scoped>
.bg-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
}
</style>
