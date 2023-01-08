<template>
  <div
    class="relative z-10 w-full h-canvas md:h-full overflow-hidden"
    ref="container"
  >
    <canvas class="canvas z-40" ref="canvas"></canvas>
    <div class="canvas z-10" ref="grid"></div>
    <canvas class="hidden" ref="canvasGrid"></canvas>
    <div class="relative z-50">
      <DraggablePoint
        v-for="(ball, i) in balls"
        :key="i"
        :point="ball"
        @update="updatePoint(i, $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue'
import { Point, getCatenaryCurve, drawResult } from './../../src/main'
import DraggablePoint from './Point.vue'

const props = defineProps({
  segments: {
    type: Number,
    default: 50
  },
  iterationLimit: {
    type: Number,
    default: 50
  },
  chainLength: {
    type: Number,
    default: 400
  },
  debug: {
    type: Boolean,
    default: false
  }
})

watch(
  () => [props.chainLength, props.debug, props.iterationLimit, props.segments],
  () => {
    loop()
  }
)

const container = ref(null as HTMLDivElement)
const canvas = ref(null as HTMLCanvasElement)
const canvasGrid = ref(null as HTMLCanvasElement)
const grid = ref(null as HTMLDivElement)

let raf: any = null

interface Ball extends Point {
  x: number
  y: number
  d: number
}

/**
 * Get the difference for x and y axis to another point
 */
function getDifferenceTo(p1: Point, p2: Point): Point {
  return { x: p1.x - p2.x, y: p1.y - p2.y }
}

function getDistanceBetweenPoints(p1: Point, p2: Point): number {
  const diff = getDifferenceTo(p1, p2)

  return Math.sqrt(Math.pow(diff.x, 2) + Math.pow(diff.y, 2))
}

const balls = ref<Point[]>([])
const width = ref(0)
const height = ref(0)
const dpi = ref(0)

const PADDING = 200

const numberOfBalls = computed(() => {
  return Math.floor(width.value / 350) + 1
})

function createBalls() {
  balls.value = []

  for (let i = 0; i < numberOfBalls.value; i++) {
    balls.value.push({
      x:
        (i / (numberOfBalls.value - 1)) * (width.value - PADDING) + PADDING / 2,
      y: height.value / 4 + 200 * Math.cos(i * 1.9)
    })
  }
}

function updatePoint(index: number, newPoint: Ball) {
  balls.value[index] = { x: newPoint.x, y: newPoint.y }
  raf = requestAnimationFrame(loop)
}

function loop() {
  const ctx = canvas.value.getContext('2d')
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  for (let i = 1; i < balls.value.length; i++) {
    const p1 = balls.value[i - 1]
    const p2 = balls.value[i]
    const distance = getDistanceBetweenPoints(p1, p2)

    const pullOffset = Math.max(distance - props.chainLength, -0.1)
    const stretchFactor = pullOffset / props.chainLength + 1

    // Create the catenary path.
    const result = getCatenaryCurve(p1, p2, props.chainLength, {
      segments: props.segments,
      iterationLimit: props.iterationLimit
    })

    if (props.debug) {
      ctx.strokeStyle = 'red'
      ctx.lineWidth = 1
      ctx.setLineDash([])
      if (result.type === 'quadraticCurve') {
        for (let j = 0; j < result.curves.length; j++) {
          const [cx, cy, x, y] = result.curves[j]
          ctx.beginPath()
          ctx.fillStyle = 'red'
          ctx.arc(x, y, 5, 0, Math.PI * 2, true)
          ctx.closePath()
          ctx.fill()

          ctx.beginPath()
          ctx.fillStyle = 'blue'
          ctx.arc(cx, cy, 5, 0, Math.PI * 2, true)
          ctx.closePath()
          ctx.fill()
        }
        ctx.beginPath()
        ctx.moveTo(...result.start)
        for (let j = 0; j < result.curves.length; j++) {
          const [cx, cy, x, y] = result.curves[j]
          ctx.quadraticCurveTo(cx, cy, x, y)
        }
        ctx.stroke()
        ctx.closePath()
      }
    } else {
      ctx.beginPath()
      drawResult(result, ctx)

      // Draw rope.
      ctx.setLineDash([])
      ctx.lineWidth = 2 / (stretchFactor * 0.5)
      ctx.lineDashOffset = 0
      ctx.strokeStyle = '#0c4a6e'
      ctx.stroke()

      ctx.setLineDash([0, 40 * stretchFactor])
      ctx.lineWidth = 17
      ctx.lineDashOffset = 20 * stretchFactor
      ctx.strokeStyle = '#0c4a6e'
      ctx.lineCap = 'round'
      ctx.stroke()

      // Draw dark balls.
      ctx.setLineDash([0, 40 * stretchFactor])
      ctx.lineWidth = 12
      ctx.lineDashOffset = 20 * stretchFactor
      ctx.strokeStyle = 'white'
      ctx.lineCap = 'round'
      ctx.stroke()

      ctx.closePath()
    }
  }
}

function setSizes() {
  width.value = container.value.clientWidth
  height.value = container.value.clientHeight
  dpi.value =
    width.value > 1024
      ? Math.min(window.devicePixelRatio, 4)
      : window.devicePixelRatio

  const targetDpi = dpi.value
  canvas.value.width = width.value * targetDpi
  canvas.value.height = height.value * targetDpi
  canvas.value.style.width = width.toString()
  canvas.value.style.height = height.toString()

  const ctx = canvas.value.getContext('2d')
  ctx.scale(targetDpi, targetDpi)
  ctx.lineWidth = 5
  ctx.lineCap = 'square'
}

/**
 * Draws the grid on a small invisible canvas and then sets the image of the
 * canvas as the background image on our grid element.
 */
function drawGrid() {
  const size = 24 * dpi.value
  canvasGrid.value.width = size
  canvasGrid.value.height = size
  const ctx = canvasGrid.value.getContext('2d')
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  ctx.strokeStyle = '#d1d5db'
  ctx.lineWidth = dpi.value

  ctx.beginPath()
  ctx.moveTo(0, size - 0.5)
  ctx.lineTo(size + 2, size - 0.5)
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(size - 0.5, 0)
  ctx.lineTo(size - 0.5, size + 2)
  ctx.stroke()

  const png = canvasGrid.value.toDataURL()
  grid.value.style.backgroundImage = `url(${png})`
  grid.value.style.backgroundSize = `24px`
}

let resizeTimeout: any = null

function onDocumentResize() {
  clearTimeout(resizeTimeout)

  resizeTimeout = setTimeout(() => {
    setSizes()
    createBalls()
    drawGrid()
    loop()
  }, 500)
}

onMounted(() => {
  window.addEventListener('resize', onDocumentResize)

  setSizes()
  createBalls()
  drawGrid()
  loop()
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  window.removeEventListener('resize', onDocumentResize)
})
</script>
