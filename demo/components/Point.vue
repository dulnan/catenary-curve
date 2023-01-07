<template>
  <div
    class="w-14 h-14 rounded-full bg-sky-500 absolute -top-7 -left-7 shadow-2xl cursor-grab hover:bg-sky-700"
    :style="style"
    @mousedown.prevent="onMouseDown"
  ></div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const emits = defineEmits(['update'])
const props = defineProps({
  point: {
    type: Object,
    default: () => {}
  }
})
const style = computed(() => {
  return {
    transform: `translate(${props.point.x}px, ${props.point.y}px)`
  }
})

let offsetX: number = 0
let offsetY: number = 0

function onMouseDown(e: MouseEvent) {
  // offsetX = e.offsetX
  // offsetY = e.offsetY
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}

function onMouseMove(e: MouseEvent) {
  emits('update', { x: e.clientX - offsetX, y: e.clientY - offsetY })
}

function onMouseUp(e: MouseEvent) {
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseup', onMouseUp)
}
</script>
