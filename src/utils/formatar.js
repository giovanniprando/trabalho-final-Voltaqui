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

// Quantos dias se passaram desde uma data 'AAAA-MM-DD' até hoje.
// Usa meio-dia para o horário de verão não mudar a conta.
export function diasDesde(dataISO, hoje = new Date()) {
  const [ano, mes, dia] = dataISO.slice(0, 10).split('-').map(Number)
  const inicio = new Date(ano, mes - 1, dia, 12)
  const fim = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), 12)
  const UM_DIA = 24 * 60 * 60 * 1000
  return Math.max(0, Math.round((fim - inicio) / UM_DIA))
}

// Horário de uma data ISO no fuso do navegador: "14:32"
export function formatarHora(valorISO) {
  return new Date(valorISO).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

// Número do comprovante: "VQ-20261125-0161" (data da entrega + número do achado).
export function protocoloDevolucao(numero, entregueEmISO) {
  const data = entregueEmISO.slice(0, 10).replaceAll('-', '')
  return `VQ-${data}-${String(numero).padStart(4, '0')}`
}
