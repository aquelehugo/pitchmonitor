import { defineConfig } from 'vite'

export default defineConfig({
  worker: {
    format: 'es', // Ensure the worker is treated as an ES module
  },
})
