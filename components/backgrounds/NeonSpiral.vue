<script setup lang="ts">
// 霓虹漩渦：阿基米德螺線 + 多層發光描邊，緩慢旋轉（Boss 參考圖的同心圓漩渦）
const canvas = ref<HTMLCanvasElement | null>(null)
let raf = 0
let ctx: CanvasRenderingContext2D | null = null
let w = 0
let h = 0
let dpr = 1
let angle = 0

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

// 畫一條從中心向外的螺線
function drawSpiral(cx: number, cy: number, hue: number, rot: number) {
  if (!ctx) return
  const maxR = Math.hypot(w, h) * 0.6
  const turns = 6
  const totalAngle = turns * Math.PI * 2
  ctx.beginPath()
  for (let t = 0; t <= totalAngle; t += 0.12) {
    const r = (t / totalAngle) * maxR
    const x = cx + Math.cos(t + rot) * r
    const y = cy + Math.sin(t + rot) * r
    if (t === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.strokeStyle = `hsl(${hue}, 100%, 65%)`
  ctx.lineWidth = 3
  ctx.shadowBlur = 18
  ctx.shadowColor = `hsl(${hue}, 100%, 60%)`
  ctx.stroke()
}

function frame() {
  if (!ctx) return
  ctx.clearRect(0, 0, w, h)
  const cx = w / 2
  const cy = h / 2
  // 兩層交錯色相（藍 + 紫），交叉旋轉做出漩渦層次
  drawSpiral(cx, cy, 265, angle)
  drawSpiral(cx, cy, 200, -angle * 0.8)
  angle += 0.004
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
