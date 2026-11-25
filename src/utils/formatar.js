export function formatarData(valor) {
  if (!valor) return ''
  const [ano, mes, dia] = valor.slice(0, 10).split('-')
  return `${dia}/${mes}/${ano}`
}

export function hojeISO() {
  const hoje = new Date()
  const mes = String(hoje.getMonth() + 1).padStart(2, '0')
  const dia = String(hoje.getDate()).padStart(2, '0')
  return `${hoje.getFullYear()}-${mes}-${dia}`
}

// 158 -> "Nº 0158"
export function formatarNumero(numero) {
  return `Nº ${String(numero).padStart(4, '0')}`
}

// "Ana Souza" -> "AS"
export function iniciais(nome) {
  const partes = nome.trim().split(/\s+/)
  const primeira = partes[0]?.[0] ?? ''
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : ''
  return (primeira + ultima).toUpperCase()
}

// Para buscar sem ligar para acento e maiúscula: "Térmica" -> "termica"
export function normalizar(texto) {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()
}
