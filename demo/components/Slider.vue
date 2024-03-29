<template>
  <div
    class="pt-[23px] pb-6 px-6 border-t border-gray-300 relative group hover:border-solid hover:bg-gray-50"
    :class="{ 'text-gray-300 pointer-events-none': disabled }"
  >
    <div class="flex justify-between">
      <label class="uppercase font-bold" :for="id">{{ label }}</label>
      <input
        type="number"
        :value="value"
        :min="min"
        :max="max"
        :step="step"
        @input="$emit('update:modelValue', getSliderValue($event))"
        class="appearance-none outline-none h-6 w-14 bg-transparent text-right -mr-3"
      />
    </div>
    <p
      class="text-xs mt-3 mb-3"
      :class="disabled ? 'text-gray-300' : 'text-gray-800'"
    >
      {{ description }}
    </p>

    <input
      class="slider"
      :class="{ disabled: disabled }"
      type="range"
      :id="'slider_' + id"
      :name="id"
      :step="step"
      :value="modelValue"
      @input="$emit('update:modelValue', getSliderValue($event))"
      @wheel.prevent="onWheel"
      :min="min"
      :max="max"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  min: {
    type: Number,
    default: 1
  },
  max: {
    type: Number,
    default: 100
  },
  step: {
    type: Number,
    default: 1
  },
  id: {
    type: String,
    default: ''
  },
  modelValue: {
    type: Number,
    default: 0
  },
  valueText: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const wheelStep = computed(() => {
  return (props.max - props.min) / 100
})

const value = computed(() => {
  return props.valueText || Math.round(props.modelValue).toString()
})

function getSliderValue(e: Event) {
  if ('target' in e && 'value' in e.target) {
    return parseFloat(e.target.value as any)
  }
}

function onWheel(e: WheelEvent) {
  if (e.deltaY > 0) {
    emit(
      'update:modelValue',
      Math.max(props.modelValue - wheelStep.value, props.min)
    )
  } else {
    emit(
      'update:modelValue',
      Math.min(props.modelValue + wheelStep.value, props.max)
    )
  }
}
</script>

<style lang="postcss"></style>
