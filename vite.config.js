import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Plain Vite + React single-page app. Keep it boring.
export default defineConfig({
  plugins: [react()],
})
