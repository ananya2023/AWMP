import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    allowedHosts: ['frontend-cooksy-v1-518421407309.asia-south1.run.app']
  }

//   server: {
//   allowedHosts: 'all'
// }
})
