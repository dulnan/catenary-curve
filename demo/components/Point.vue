<template>
  <div
    class="w-10 h-10 rounded-full bg-orange-600 absolute -top-5 -left-5 shadow-2xl cursor-grab hover:bg-orange-800"
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
