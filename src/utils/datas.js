const UM_DIA = 24 * 60 * 60 * 1000

function doisDigitos(numero) {
  return String(numero).padStart(2, '0')
}

export function dataLocal(textoAAAAMMDD) {
  const [ano, mes, dia] = textoAAAAMMDD.slice(0, 10).split('-').map(Number)
  return new Date(ano, mes - 1, dia, 12)
}

function paraAAAAMMDD(data) {
  return `${data.getFullYear()}-${doisDigitos(data.getMonth() + 1)}-${doisDigitos(data.getDate())}`
}

export function hojeISO() {
  return paraAAAAMMDD(new Date())
}

function diaLocal(valor) {
  return valor.length > 10 ? new Date(valor) : dataLocal(valor)
}

export function formatarData(valor) {
  if (!valor) return ''
  const data = diaLocal(valor)
  return `${doisDigitos(data.getDate())}/${doisDigitos(data.getMonth() + 1)}/${data.getFullYear()}`
}

export function formatarHora(valorISO) {
  return new Date(valorISO).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

export function diasDesde(textoAAAAMMDD, ate = new Date()) {
  const inicio = dataLocal(textoAAAAMMDD)
  const fim = new Date(ate.getFullYear(), ate.getMonth(), ate.getDate(), 12)
  return Math.max(0, Math.round((fim - inicio) / UM_DIA))
}

export function tempoRelativo(textoAAAAMMDD, ate = new Date()) {
  const dias = diasDesde(textoAAAAMMDD, ate)
  if (dias === 0) return 'hoje'
  if (dias === 1) return 'ontem'
  return `há ${dias} dias`
}

export function protocoloDevolucao(numero, entregueEmISO) {
  const dia = paraAAAAMMDD(diaLocal(entregueEmISO)).replaceAll('-', '')
  return `VQ-${dia}-${String(numero).padStart(4, '0')}`
}
