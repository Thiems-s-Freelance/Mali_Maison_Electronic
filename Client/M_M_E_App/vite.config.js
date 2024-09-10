import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0', // Permet les connexions externes
    port: 5173,      // Définit le port sur lequel le serveur écoute
  },
  plugins: [react()],
})
