import { resolve } from 'path'
import dts from 'vite-plugin-dts'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true
    })
  ],
  publicDir: false,
  build: {
    outDir: 'lib',
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'catenary-curve',
      // the proper extensions will be added
      fileName: 'catenary-curve'
    },
    rollupOptions: {}
  }
})
