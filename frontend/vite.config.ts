import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
    server: {
    port: 5174, // 👈 change port here
    open: true, // optional: auto-open browser
  },
})
