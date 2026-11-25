// Datas sempre no fuso de quem usa o site (no Brasil, UTC-3).
//
// Dois cuidados com o JavaScript:
// 1. new Date('2026-10-20') entende a data como meia-noite em Londres (UTC).
//    No Brasil isso ainda é 19/10, às 21h. Por isso separamos ano, mês e dia na mão.
// 2. new Date().toISOString() devolve o horário de Londres. Depois das 21h no Brasil,
//    ele já está no dia seguinte. Por isso a data de hoje é montada com getFullYear etc.

const UM_DIA = 24 * 60 * 60 * 1000

function doisDigitos(numero) {
  return String(numero).padStart(2, '0')
}

// '2026-10-20' -> Date de 20/10/2026 no fuso local (ao meio-dia, para o horário de verão não atrapalhar).
export function dataLocal(textoAAAAMMDD) {
  const [ano, mes, dia] = textoAAAAMMDD.slice(0, 10).split('-').map(Number)
  return new Date(ano, mes - 1, dia, 12)
}

// Date -> '2026-10-20', usando o dia do fuso local.
export function paraAAAAMMDD(data) {
  return `${data.getFullYear()}-${doisDigitos(data.getMonth() + 1)}-${doisDigitos(data.getDate())}`
}

// A data de hoje no formato do campo <input type="date">: '2026-11-25'.
export function hojeISO() {
  return paraAAAAMMDD(new Date())
}

// Um registro salvo pode ter só a data ('2026-10-20') ou data e hora em UTC
// ('2026-10-20T23:30:00.000Z'). Com hora, converte para o dia local.
function diaLocal(valor) {
  return valor.length > 10 ? new Date(valor) : dataLocal(valor)
}

// '2026-10-20' ou '2026-10-20T23:30:00.000Z' -> '20/10/2026'
export function formatarData(valor) {
  if (!valor) return ''
  const data = diaLocal(valor)
  return `${doisDigitos(data.getDate())}/${doisDigitos(data.getMonth() + 1)}/${data.getFullYear()}`
}

// Horário de uma data ISO no fuso do navegador: "14:32"
export function formatarHora(valorISO) {
  return new Date(valorISO).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

// Quantos dias se passaram de uma data 'AAAA-MM-DD' até hoje (ou até outra data).
export function diasDesde(textoAAAAMMDD, ate = new Date()) {
  const inicio = dataLocal(textoAAAAMMDD)
  const fim = new Date(ate.getFullYear(), ate.getMonth(), ate.getDate(), 12)
  return Math.max(0, Math.round((fim - inicio) / UM_DIA))
}

// Número do comprovante: "VQ-20261125-0161" (dia local da entrega + número do achado).
export function protocoloDevolucao(numero, entregueEmISO) {
  const dia = paraAAAAMMDD(diaLocal(entregueEmISO)).replaceAll('-', '')
  return `VQ-${dia}-${String(numero).padStart(4, '0')}`
}
