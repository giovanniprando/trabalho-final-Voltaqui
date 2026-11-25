import { normalizar } from '../utils/formatar'

// Cada escola tem lugares diferentes, então o local é digitado livremente
// no cadastro. Esta lista só aparece como sugestão enquanto a pessoa digita.
export const LOCAIS_SUGERIDOS = [
  'Recepção',
  'Biblioteca',
  'Cantina',
  'Laboratório',
  'Sala de aula',
  'Pátio',
  'Banheiro',
  'Quadra',
]

// Achados de versões antigas guardavam um id ("sala-de-aula") no lugar do nome.
const NOMES_ANTIGOS = {
  recepcao: 'Recepção',
  biblioteca: 'Biblioteca',
  cantina: 'Cantina',
  laboratorio: 'Laboratório',
  'sala-de-aula': 'Sala de aula',
  patio: 'Pátio',
  banheiro: 'Banheiro',
  outro: 'Outro',
}

// Nome para mostrar na tela, funcione o achado com nome ou com id antigo.
export function nomeDoLocal(local) {
  return NOMES_ANTIGOS[local] ?? local ?? ''
}

// Locais já usados nos achados, sem repetir "Cantina" e "cantina".
export function locaisUsados(achados) {
  const porChave = new Map()
  for (const achado of achados) {
    const nome = nomeDoLocal(achado.local)
    const chave = normalizar(nome)
    if (chave && !porChave.has(chave)) porChave.set(chave, nome)
  }
  return [...porChave.values()].toSorted((a, b) => a.localeCompare(b, 'pt-BR'))
}

// Sugestões do campo: os locais já usados + a lista padrão, sem repetir.
export function sugestoesDeLocal(achados) {
  const usados = locaisUsados(achados)
  const chaves = new Set(usados.map(normalizar))
  const extras = LOCAIS_SUGERIDOS.filter((nome) => !chaves.has(normalizar(nome)))
  return [...usados, ...extras]
}

// Se a pessoa digitar "cantina" e já existir "Cantina", usa a grafia que já existe.
// Assim o filtro por local não mostra o mesmo lugar duas vezes.
export function padronizarLocal(texto, achados) {
  const limpo = texto.trim().replace(/\s+/g, ' ')
  const igual = sugestoesDeLocal(achados).find((nome) => normalizar(nome) === normalizar(limpo))
  return igual ?? limpo
}
