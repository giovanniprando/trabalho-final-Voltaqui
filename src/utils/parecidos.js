import { nomeDoLocal } from '../data/locais'
import { normalizar } from './formatar'
import { dataLocal, diasDesde } from './datas'

// Dá pontos para um achado conforme ele combina com o que o aluno perdeu.
//   categoria igual ............................ 3 pontos
//   mesmo local (sem ligar para acento) ......... 2 pontos
//   encontrado até 7 dias depois da perda ...... 2 pontos
//   encontrado até 30 dias depois .............. 1 ponto
// Um achado encontrado ANTES da perda não pode ser o objeto: fica com 0.
export function pontuarAchado(achado, perdido) {
  let pontos = 0

  if (perdido.data) {
    // Datas 'AAAA-MM-DD' podem ser comparadas como texto.
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

// Ordena os achados do mais parecido para o menos parecido.
// Os que não combinam em nada (0 pontos) ficam de fora.
export function ordenarParecidos(achados, perdido) {
  return achados
    .map((achado) => ({ achado, pontos: pontuarAchado(achado, perdido) }))
    .filter((item) => item.pontos > 0)
    .toSorted((a, b) => b.pontos - a.pontos)
}

// Quantos dias do início até o fim (as duas no formato 'AAAA-MM-DD').
function diasEntre(inicioISO, fimISO) {
  return diasDesde(inicioISO, dataLocal(fimISO))
}
