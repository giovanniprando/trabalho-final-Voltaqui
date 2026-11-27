export const CATEGORIAS = [
  { id: 'eletronicos', nome: 'Eletrônicos', icone: 'cel' },
  { id: 'documentos', nome: 'Documentos', icone: 'documento' },
  { id: 'roupas', nome: 'Roupas', icone: 'camisa' },
  { id: 'material-escolar', nome: 'Material escolar', icone: 'livro' },
  { id: 'garrafas', nome: 'Garrafas e potes', icone: 'garrafa' },
  { id: 'chaves', nome: 'Chaves', icone: 'chave' },
  { id: 'acessorios', nome: 'Acessórios', icone: 'oculos' },
  { id: 'outros', nome: 'Outros', icone: 'pacote' },
]

export function buscarCategoria(id) {
  return CATEGORIAS.find((categoria) => categoria.id === id) ?? null
}
