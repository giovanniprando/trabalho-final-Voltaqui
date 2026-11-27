import { normalizar } from './formatar'

const PALAVRAS_VAZIAS = new Set([
  'a', 'o', 'as', 'os', 'um', 'uma', 'uns', 'umas', 'de', 'da', 'do', 'das', 'dos',
  'em', 'na', 'no', 'nas', 'nos', 'com', 'sem', 'por', 'para', 'pra', 'e', 'ou',
  'que', 'tem', 'ter', 'esta', 'era', 'meu', 'minha', 'seu', 'sua',
  'ele', 'ela', 'isso', 'esse', 'essa', 'muito', 'mais', 'bem', 'tambem', 'so', 'ja',
  'ao', 'aos', 'se', 'mas', 'como', 'onde', 'quando', 'perto', 'parte', 'lado',
])

export function palavrasChave(texto) {
  const palavras = normalizar(texto)
    .split(/[^a-z0-9]+/)
    .filter((p) => p.length >= 2 && !PALAVRAS_VAZIAS.has(p))
  return [...new Set(palavras)]
}

function batem(a, b) {
  if (a === b) return true
  return a.length >= 5 && b.length >= 5 && a.slice(0, 5) === b.slice(0, 5)
}

export function compararDescricoes(textoAluno, detalheOculto, descricaoPublica = '') {
  const doAluno = palavrasChave(textoAluno)
  const daDescricao = palavrasChave(descricaoPublica)
  const todasDoDetalhe = palavrasChave(detalheOculto)

  const publicas = todasDoDetalhe.filter((p) => daDescricao.some((q) => batem(p, q)))
  const doDetalhe = todasDoDetalhe.filter((p) => !publicas.includes(p))

  const emComum = doDetalhe.filter((p) => doAluno.some((q) => batem(p, q)))
  const proporcao = doDetalhe.length === 0 ? 0 : emComum.length / doDetalhe.length

  let nivel = 'baixa'
  if (proporcao >= 0.5) nivel = 'alta'
  else if (proporcao >= 0.25) nivel = 'media'

  return { nivel, emComum, publicas, total: doDetalhe.length, proporcao }
}

export function palavraEmComum(palavra, emComum) {
  const limpa = normalizar(palavra).replace(/[^a-z0-9]/g, '')
  return limpa.length >= 2 && emComum.some((p) => batem(p, limpa))
}
