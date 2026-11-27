import { lerTema } from '../services/storage'

export const sistemaEscuro = window.matchMedia('(prefers-color-scheme: dark)')

export function temaInicial() {
  return lerTema() ?? (sistemaEscuro.matches ? 'escuro' : 'claro')
}

// Sem escolha salva, segue o tema do sistema (Windows, celular).
export function temaInicial() {
  return lerTema() ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'escuro' : 'claro')
}

// As cores do tema escuro ficam em tokens.css, em :root[data-tema='escuro'].
export function aplicarTema(tema) {
  document.documentElement.dataset.tema = tema
}
