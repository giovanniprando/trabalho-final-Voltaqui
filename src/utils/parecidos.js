import { nomeDoLocal } from '../data/locais'
import { normalizar } from './formatar'
import { dataLocal, diasDesde } from './datas'

export function pontuarAchado(achado, perdido) {
  let pontos = 0

  if (perdido.data) {
    if (achado.dataEncontrado < perdido.data) return 0
    const diasDepois = diasEntre(perdido.data, achado.dataEncontrado)
    if (diasDepois <= 7) pontos += 2
    else if (diasDepois <= 30) pontos += 1
  }

  if (perdido.categoria && achado.categoria === perdido.categoria) pontos += 3

  const procurado = normalizar(perdido.local)
  if (procurado) {
    const local = normalizar(nomeDoLocal(achado.local))
    if (local && (local.includes(procurado) || procurado.includes(local))) pontos += 2
  }

  return pontos
}

export function ordenarParecidos(achados, perdido) {
  return achados
    .map((achado) => ({ achado, pontos: pontuarAchado(achado, perdido) }))
    .filter((item) => item.pontos > 0)
    .toSorted((a, b) => b.pontos - a.pontos)
}

function diasEntre(inicioISO, fimISO) {
  return diasDesde(inicioISO, dataLocal(fimISO))
}
