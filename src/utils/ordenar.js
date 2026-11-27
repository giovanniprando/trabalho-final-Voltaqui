export const ORDENS = [
  { id: 'recentes', nome: 'Mais recentes primeiro' },
  { id: 'antigos', nome: 'Há mais tempo aqui primeiro' },
  { id: 'numero', nome: 'Pelo número' },
]

function porData(a, b) {
  return a.dataEncontrado.localeCompare(b.dataEncontrado) || a.numero - b.numero
}

export function ordenarAchados(lista, ordem) {
  if (ordem === 'antigos') return lista.toSorted(porData)
  if (ordem === 'numero') return lista.toSorted((a, b) => a.numero - b.numero)
  return lista.toSorted((a, b) => porData(b, a))
}
