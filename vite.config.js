import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import liveReload from 'vite-plugin-live-reload'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      include: "*/*.jsx",
    }),
    liveReload("./src/Components/Body.jsx")
  ],
  server: {
    hmr: true
  }
})
