export const LOCAIS = [
  { id: 'recepcao', nome: 'Recepção' },
  { id: 'biblioteca', nome: 'Biblioteca' },
  { id: 'cantina', nome: 'Cantina' },
  { id: 'laboratorio', nome: 'Laboratório' },
  { id: 'sala-de-aula', nome: 'Sala de aula' },
  { id: 'patio', nome: 'Pátio' },
  { id: 'banheiro', nome: 'Banheiro' },
  { id: 'outro', nome: 'Outro' },
]

export function buscarLocal(id) {
  return LOCAIS.find((local) => local.id === id) ?? null
}
