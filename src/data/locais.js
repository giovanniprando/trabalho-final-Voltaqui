import { normalizar } from '../utils/formatar'

const LOCAIS_SUGERIDOS = [
  'Recepção',
  'Biblioteca',
  'Cantina',
  'Laboratório',
  'Sala de aula',
  'Pátio',
  'Banheiro',
  'Quadra',
]

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

export function nomeDoLocal(local) {
  return NOMES_ANTIGOS[local] ?? local ?? ''
}

export function locaisUsados(achados) {
  const porChave = new Map()
  for (const achado of achados) {
    const nome = nomeDoLocal(achado.local)
    const chave = normalizar(nome)
    if (chave && !porChave.has(chave)) porChave.set(chave, nome)
  }
  return [...porChave.values()].toSorted((a, b) => a.localeCompare(b, 'pt-BR'))
}

export function sugestoesDeLocal(achados) {
  const usados = locaisUsados(achados)
  const chaves = new Set(usados.map(normalizar))
  const extras = LOCAIS_SUGERIDOS.filter((nome) => !chaves.has(normalizar(nome)))
  return [...usados, ...extras]
}

export function padronizarLocal(texto, achados) {
  const limpo = texto.trim().replace(/\s+/g, ' ')
  const igual = sugestoesDeLocal(achados).find((nome) => normalizar(nome) === normalizar(limpo))
  return igual ?? limpo
}
