// O campo "icone" é provisório (emoji). Pode ser trocado por ícones de src/assets.

export const CATEGORIAS = [
  { id: 'eletronicos', nome: 'Eletrônicos', icone: '📱' },
  { id: 'documentos', nome: 'Documentos', icone: '🪪' },
  { id: 'roupas', nome: 'Roupas', icone: '🧥' },
  { id: 'material-escolar', nome: 'Material escolar', icone: '📚' },
  { id: 'garrafas', nome: 'Garrafas e potes', icone: '🧴' },
  { id: 'chaves', nome: 'Chaves', icone: '🔑' },
  { id: 'acessorios', nome: 'Acessórios', icone: '👓' },
  { id: 'outros', nome: 'Outros', icone: '📦' },
]

export function buscarCategoria(id) {
  return CATEGORIAS.find((categoria) => categoria.id === id) ?? null
}
