<template>
  <label
    class="flex items-center cursor-pointer justify-between pt-[23px] pb-6 border-t border-gray-300 mt-6 px-6 hover:bg-gray-50"
  >
    <span class="uppercase font-bold">{{ label }}</span>
    <div class="relative">
      <input
        type="checkbox"
        :checked="modelValue"
        @change="$emit('update:modelValue', !modelValue)"
        class="sr-only peer"
      />

      <div
        class="w-9 h-5 peer-focus:outline peer-focus:outline-2 peer-focus:outline-offset-2 border rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-4 peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[3px] after:bg-gray-200 after:rounded-full after:h-3 after:w-3 transition-colors after:transition-all dark:border-gray-600 peer-checked:bg-sky-500 peer-checked:after:bg-white peer-checked:border-sky-500"
      ></div>
    </div>
  </label>
</template>

<script lang="ts" setup>
defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  label: {
    type: String,
    default: ''
  }
})
</script>
