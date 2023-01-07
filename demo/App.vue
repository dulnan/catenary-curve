<template>
  <div
    class="flex flex-col-reverse md:flex-row md:h-screen leading-6 bg-white"
    ref="container"
  >
    <Sidebar>
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
        :max="1000"
      />
    </Sidebar>

    <Scene :segments="segments" :iteration-limit="iterationLimit" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import Sidebar from './components/Sidebar.vue'
import Slider from './components/Slider.vue'
import Scene from './components/Scene.vue'

const segments = ref(11)
const iterationLimit = ref(5)
</script>
