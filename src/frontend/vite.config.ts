import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // server: {
  //   // proxy: {
  //   //   '/api': 'http://localhost:5000',
  //   //   '/uploads/': 'http://localhost:5000'
  //   // }
  // }
  server: {
    port: 3000
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  // Add this section
  preview: {
    host: true,
    strictPort: true
  }
})
