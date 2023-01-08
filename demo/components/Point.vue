<template>
  <div
    class="w-14 h-14 rounded-full bg-sky-500 absolute -top-7 -left-7 shadow-2xl cursor-grab"
    :style="style"
    :class="{
      'cursor-grabbing bg-sky-900': active,
      'hover:bg-sky-700': !active
    }"
    @mousedown.prevent="onMouseDown"
    @touchstart.prevent="onTouchStart"
  ></div>
</template>

<script lang="ts" setup>
import { computed, PropType, ref } from 'vue'
import { Point } from './../../src/main'

const emits = defineEmits(['update'])
const props = defineProps({
  point: {
    type: Object as PropType<Point>,
    default: () => {}
  }
})
const style = computed(() => {
  return {
    transform: `translate(${props.point.x}px, ${props.point.y}px)`
  }
})

const active = ref(false)

let startX: number = 0
let startY: number = 0
let initX: number = 0
let initY: number = 0

function onTouchStart(e: TouchEvent) {
  initX = props.point.x
  initY = props.point.y
  startX = e.touches[0].clientX
  startY = e.touches[0].clientY
  document.addEventListener('touchmove', onTouchMove)
  document.addEventListener('touchend', onTouchEnd)
}
function onTouchMove(e: TouchEvent) {
  const diffX = startX - e.touches[0].clientX
  const diffY = startY - e.touches[0].clientY
  emits('update', { x: initX - diffX, y: initY - diffY })
}

function onTouchEnd() {
  document.removeEventListener('touchmove', onTouchMove)
  document.removeEventListener('touchend', onTouchEnd)
  active.value = false
}

function onMouseDown(e: MouseEvent) {
  initX = props.point.x
  initY = props.point.y
  startX = e.clientX
  startY = e.clientY
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
  active.value = true
}

function onMouseMove(e: MouseEvent) {
  const diffX = startX - e.clientX
  const diffY = startY - e.clientY
  emits('update', { x: initX - diffX, y: initY - diffY })
}

function onMouseUp() {
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
  active.value = false
}
</script>
