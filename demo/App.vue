<template>
  <div
    class="flex flex-col-reverse md:flex-row md:h-screen leading-6 bg-white"
    ref="container"
  >
    <Sidebar>
      <Toggle v-model="drawLineSegments" label="Draw line segments" />
      <Slider
        v-model="segments"
        label="Segments"
        description="The amount of segments used for the rope."
        id="segments"
        :min="1"
        :max="200"
      />
      <Slider
        v-model="iterationLimit"
        label="Iteration Limit"
        description="The maximum iterations to determine the catenary parameter."
        id="iterationLimit"
        :min="1"
        :max="15"
      />
      <Slider
        v-model="chainLength"
        label="Chain Length"
        description="The length of the chain."
        id="chainLength"
        :min="100"
        :max="1000"
      />
    </Sidebar>

    <Scene
      :segments="segments"
      :iteration-limit="iterationLimit"
      :chain-length="chainLength"
      :draw-line-segments="drawLineSegments"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import Sidebar from './components/Sidebar.vue'
import Slider from './components/Slider.vue'
import Toggle from './components/Toggle.vue'
import Scene from './components/Scene.vue'

const segments = ref(200)
const iterationLimit = ref(8)
const chainLength = ref(1800)
const drawLineSegments = ref(true)
</script>
