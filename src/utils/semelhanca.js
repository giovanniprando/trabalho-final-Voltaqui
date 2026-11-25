import { normalizar } from './formatar'

// Palavras que aparecem em qualquer frase e não ajudam a conferir o dono.
const PALAVRAS_VAZIAS = new Set([
  'a', 'o', 'as', 'os', 'um', 'uma', 'uns', 'umas', 'de', 'da', 'do', 'das', 'dos',
  'em', 'na', 'no', 'nas', 'nos', 'com', 'sem', 'por', 'para', 'pra', 'e', 'ou',
  'que', 'tem', 'ter', 'esta', 'era', 'meu', 'minha', 'seu', 'sua',
  'ele', 'ela', 'isso', 'esse', 'essa', 'muito', 'mais', 'bem', 'tambem', 'so', 'ja',
  'ao', 'aos', 'se', 'mas', 'como', 'onde', 'quando', 'perto', 'parte', 'lado',
])

// "Adesivo de banda na base." -> ['adesivo', 'banda', 'base']
// Tira acento e maiúscula, separa nas pausas e descarta as palavras vazias.
export function palavrasChave(texto) {
  const palavras = normalizar(texto)
    .split(/[^a-z0-9]+/)
    .filter((p) => p.length >= 2 && !PALAVRAS_VAZIAS.has(p))
  return [...new Set(palavras)] // Set remove repetidas
}

// Duas palavras "batem" se forem iguais ou começarem com as mesmas 5 letras.
// Assim "vermelho" bate com "vermelha" e "pintada" com "pintado".
function batem(a, b) {
  if (a === b) return true
  return a.length >= 5 && b.length >= 5 && a.slice(0, 5) === b.slice(0, 5)
}

// Compara o que o aluno escreveu com o detalhe oculto do achado.
// Devolve o nível (alta, média ou baixa) e as palavras em comum.
// É só uma ajuda: quem decide é sempre a secretaria.
export function compararDescricoes(textoAluno, detalheOculto) {
  const doAluno = palavrasChave(textoAluno)
  const doDetalhe = palavrasChave(detalheOculto)

  const emComum = doDetalhe.filter((p) => doAluno.some((q) => batem(p, q)))
  const proporcao = doDetalhe.length === 0 ? 0 : emComum.length / doDetalhe.length

  let nivel = 'baixa'
  if (proporcao >= 0.5) nivel = 'alta'
  else if (proporcao >= 0.25) nivel = 'media'

  return { nivel, emComum, total: doDetalhe.length, proporcao }
}

// Diz se uma palavra do texto está entre as palavras em comum (para destacar).
export function palavraEmComum(palavra, emComum) {
  const limpa = normalizar(palavra).replace(/[^a-z0-9]/g, '')
  return limpa.length >= 2 && emComum.some((p) => batem(p, limpa))
}
