// 158 -> "Nº 0158"
export function formatarNumero(numero) {
  return `Nº ${String(numero).padStart(4, '0')}`
}

// "Ana Souza" -> "AS"
export function iniciais(nome) {
  const partes = nome.trim().split(/\s+/)
  const primeira = partes[0]?.[0] ?? ''
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : ''
  return (primeira + ultima).toUpperCase()
}

// Para buscar sem ligar para acento, maiúscula e espaço sobrando: " Térmica " -> "termica"
export function normalizar(texto) {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()
}
