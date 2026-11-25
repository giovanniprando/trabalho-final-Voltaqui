// Jeitos de ordenar a lista de achados.
export const ORDENS = [
  { id: 'recentes', nome: 'Mais recentes primeiro' },
  { id: 'antigos', nome: 'Há mais tempo aqui primeiro' },
  { id: 'numero', nome: 'Pelo número' },
]

// Devolve uma cópia ordenada (sort mexe no array original, por isso o [...lista]).
export function ordenarAchados(lista, ordem) {
  const copia = [...lista]
  if (ordem === 'antigos') return copia.sort((a, b) => a.dataEncontrado.localeCompare(b.dataEncontrado))
  if (ordem === 'numero') return copia.sort((a, b) => a.numero - b.numero)
  // 'recentes': quem foi encontrado por último aparece primeiro
  return copia.sort((a, b) => b.dataEncontrado.localeCompare(a.dataEncontrado))
}
