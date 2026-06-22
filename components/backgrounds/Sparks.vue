<script setup lang="ts">
// 火花粒子：從底部不斷竄升的彩色光點，飄散後淡出（演唱會煙火感）
const canvas = ref<HTMLCanvasElement | null>(null)
let raf = 0
let ctx: CanvasRenderingContext2D | null = null
let w = 0
let h = 0
let dpr = 1

interface Spark {
  x: number; y: number; vx: number; vy: number
  life: number; max: number; hue: number; size: number
}
let sparks: Spark[] = []

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

function spawn(): Spark {
  const max = 80 + Math.random() * 80
  return {
    x: Math.random() * w,
    y: h + 10,
    vx: (Math.random() - 0.5) * 1.2,
    vy: -(1.2 + Math.random() * 2.4),
    life: 0,
    max,
    hue: 250 + Math.random() * 80, // 紫～粉
    size: 1.5 + Math.random() * 2.5,
  }
}

function frame() {
  if (!ctx) return
  ctx.fillStyle = 'rgba(5, 1, 15, 0.22)'
  ctx.fillRect(0, 0, w, h)
  // 每幀補新火花
  for (let i = 0; i < 3; i++) sparks.push(spawn())
  sparks = sparks.filter((s) => s.life < s.max)
  for (const s of sparks) {
    s.life++
    s.x += s.vx
    s.y += s.vy
    s.vy += 0.012 // 微重力，竄升後回落
    const alpha = 1 - s.life / s.max
    ctx.beginPath()
    ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2)
    ctx.fillStyle = `hsla(${s.hue}, 100%, 70%, ${alpha})`
    ctx.shadowBlur = 12
    ctx.shadowColor = `hsl(${s.hue}, 100%, 65%)`
    ctx.fill()
  }
  raf = requestAnimationFrame(frame)
}

onMounted(() => {
  resize()
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
