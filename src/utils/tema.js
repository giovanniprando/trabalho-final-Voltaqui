import { lerTema } from '../services/storage'

export const sistemaEscuro = window.matchMedia('(prefers-color-scheme: dark)')

export function temaInicial() {
  return lerTema() ?? (sistemaEscuro.matches ? 'escuro' : 'claro')
}

export function aplicarTema(tema) {
  document.documentElement.dataset.tema = tema
}
