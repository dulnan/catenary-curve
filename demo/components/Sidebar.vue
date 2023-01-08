<template>
  <aside
    class="md:w-72 relative z-50 bg-white border-t md:border-t-0 md:border-r md:h-screen border-gray-300 pt-[23px] flex-shrink-0 md:overflow-auto"
  >
    <h1
      class="uppercase font-black text-2xl md:text-5xl md:-ml-0.5 leading-6 md:leading-[48px] px-6"
    >
      Catenary Curve
    </h1>
    <p class="mt-6 px-6">
      JavaScript library to approximate and draw the path for a hanging rope
      (catenary curve) on a HTML canvas.
    </p>
    <ul class="flex justify-between mt-6 px-6">
      <li v-for="(link, i) in links" :key="i">
        <a
          class="text-sky-500 font-bold uppercase underline underline-offset-4 hover:text-sky-800"
          :href="link.href"
          >{{ link.text }}</a
        >
      </li>
    </ul>

    <slot></slot>
  </aside>
</template>

<script lang="ts" setup>
const links = [
  {
    href: 'https://github.com/dulnan/catenary-curve',
    text: 'GitHub'
  },
  {
    href: 'https://www.npmjs.com/package/catenary-curve',
    text: 'npm'
  },
  {
    href: 'https://lazybrush.dulnan.net',
    text: 'Example'
  }
]
</script>
