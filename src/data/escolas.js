const ESCOLAS = [
  { codigo: 'SN7K2P', nome: 'SENAI' },
]

export function buscarEscola(codigo) {
  const limpo = codigo.trim().toUpperCase()
  return ESCOLAS.find((escola) => escola.codigo === limpo) ?? null
}
