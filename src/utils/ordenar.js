// Jeitos de ordenar a lista de achados.
export const ORDENS = [
  { id: 'recentes', nome: 'Mais recentes primeiro' },
  { id: 'antigos', nome: 'Há mais tempo aqui primeiro' },
  { id: 'numero', nome: 'Pelo número' },
]

// Na mesma data, o número desempata (quem foi cadastrado depois tem número maior).
function porData(a, b) {
  return a.dataEncontrado.localeCompare(b.dataEncontrado) || a.numero - b.numero
}

// toSorted devolve uma cópia ordenada e não mexe na lista original.
export function ordenarAchados(lista, ordem) {
  if (ordem === 'antigos') return lista.toSorted(porData)
  if (ordem === 'numero') return lista.toSorted((a, b) => a.numero - b.numero)
  return lista.toSorted((a, b) => porData(b, a))
}
