export const PERFIS = {
  SECRETARIA: 'secretaria',
  ALUNO: 'aluno',
}

export const USUARIOS = [
  {
    id: 'u-secretaria',
    nome: 'Márcia Lopes',
    email: 'secretaria@senai.br',
    senha: '123456',
    perfil: PERFIS.SECRETARIA,
    escola: 'SN7K2P',
  },
  {
    id: 'u-aluno-1',
    nome: 'Ana Souza',
    email: 'ana@aluno.senai.br',
    senha: '123456',
    perfil: PERFIS.ALUNO,
    escola: 'SN7K2P',
    matricula: '20250114',
    curso: 'Desenvolvimento de Sistemas',
  },
  {
    id: 'u-aluno-2',
    nome: 'Bruno Lima',
    email: 'bruno@aluno.senai.br',
    senha: '123456',
    perfil: PERFIS.ALUNO,
    escola: 'SN7K2P',
    matricula: '20250231',
    curso: 'Mecatrônica',
  },
]

export function paginaInicial(usuario) {
  return usuario.perfil === PERFIS.SECRETARIA ? '/secretaria' : '/achados'
}
