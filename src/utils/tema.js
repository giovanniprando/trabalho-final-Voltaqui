import { lerTema } from '../services/storage'

export const sistemaEscuro = window.matchMedia('(prefers-color-scheme: dark)')

// Tema que vale ao abrir o site: o que a pessoa escolheu antes ou, se nunca escolheu, o do sistema.
export function temaInicial() {
  return lerTema() ?? (sistemaEscuro.matches ? 'escuro' : 'claro')
}

// O tema fica no atributo data-tema do <html>. O tokens.css troca as cores a partir dele.
export function aplicarTema(tema) {
  document.documentElement.dataset.tema = tema
}
