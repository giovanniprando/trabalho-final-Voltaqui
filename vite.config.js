import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  test: {
    env: { TZ: 'America/Sao_Paulo' },
  },
})
