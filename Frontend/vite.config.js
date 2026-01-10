import path from "path"
import tailwindcss from "tailwindcss"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'redux-vendor': ['@reduxjs/toolkit', 'react-redux'],
          // UI components chunk
          'ui-components': [
            './src/components/ui/button.jsx',
            './src/components/ui/card.jsx',
            './src/components/ui/input.jsx',
          ],
          // Admin pages chunk
          'admin-pages': [
            './src/Pages/admin/Dashboard.jsx',
            './src/Pages/admin/course/CourseTable.jsx',
            './src/Pages/admin/course/AddCourse.jsx',
            './src/Pages/admin/course/EditCourse.jsx',
          ],
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Increase limit to 1MB
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})