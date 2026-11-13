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
