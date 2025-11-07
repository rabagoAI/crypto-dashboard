import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  },
  build: {
    rollupOptions: {
      // NO externalizar react-is, dejar que Vite lo maneje
    }
  },
  optimizeDeps: {
    include: ['react-is']
  },
  resolve: {
    // Esto ayuda a Vite a resolver correctamente las dependencias
    dedupe: ['react', 'react-dom', 'react-is']
  }
})