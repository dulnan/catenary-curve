<template>
  <div
    class="flex flex-col-reverse md:flex-row md:h-screen leading-6 bg-white"
    ref="container"
  >
    <Sidebar>
      <Toggle v-model="debug" label="Debug Mode" />
      <Slider
        v-model="segments"
        label="Segments"
        description="The amount of segments used for the curve. Higher value = more realistic."
        id="segments"
        :min="1"
        :max="40"
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
        description="The total length of the chain. This is divided by the amount of segments."
        id="chainLength"
        :step="40"
        :min="200"
        :max="2000"
      />
      <Copyright />
    </Sidebar>

    <Scene
      :segments="segments"
      :iteration-limit="iterationLimit"
      :chain-length="chainLength"
      :debug="debug"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Sidebar from './components/Sidebar.vue'
import Slider from './components/Slider.vue'
import Toggle from './components/Toggle.vue'
import Scene from './components/Scene.vue'
import Copyright from './components/Copyright.vue'

function getInitialChainLength() {
  if (!import.meta.env.SSR) {
    if (window.innerWidth > 768) {
      return Math.floor(window.innerHeight / 100) * 40 * 2
    }
  }

  return 400
}

const segments = ref(40)
const iterationLimit = ref(8)
const chainLength = ref(getInitialChainLength())
const debug = ref(false)
</script>
