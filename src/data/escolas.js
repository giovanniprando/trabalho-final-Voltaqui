// Escolas que usam o Voltaqui. O aluno digita o "codigo" ao criar a conta.

export const ESCOLAS = [
  { codigo: 'SN7K2P', nome: 'SENAI' },
]

export function buscarEscola(codigo) {
  const limpo = codigo.trim().toUpperCase()
  return ESCOLAS.find((escola) => escola.codigo === limpo) ?? null
}
