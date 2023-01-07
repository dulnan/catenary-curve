import { resolve } from 'path'
import dts from 'vite-plugin-dts'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true
    })
  ],
  build: {
    minify: 'terser',
    terserOptions: {
      module: true,
      toplevel: true,
      compress: {
        inline: true
      }
    },
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
