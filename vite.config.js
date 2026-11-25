import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  test: {
    // Os testes de data rodam no fuso do Brasil, onde os erros de "um dia antes" aparecem.
    env: { TZ: 'America/Sao_Paulo' },
  },
})
