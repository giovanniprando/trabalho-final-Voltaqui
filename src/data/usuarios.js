// Usuários fixos para o login simulado (não há backend).

export const PERFIS = {
  SECRETARIA: 'secretaria',
  ALUNO: 'aluno',
}

export const USUARIOS = [
  {
    id: 'u-secretaria',
    nome: 'Secretaria SENAI',
    email: 'secretaria@senai.br',
    senha: '123456',
    perfil: PERFIS.SECRETARIA,
  },
  {
    id: 'u-aluno-1',
    nome: 'Ana Souza',
    email: 'ana@aluno.senai.br',
    senha: '123456',
    perfil: PERFIS.ALUNO,
  },
  {
    id: 'u-aluno-2',
    nome: 'Bruno Lima',
    email: 'bruno@aluno.senai.br',
    senha: '123456',
    perfil: PERFIS.ALUNO,
  },
]
