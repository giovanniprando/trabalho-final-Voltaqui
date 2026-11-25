// Dados iniciais: entram no localStorage só na primeira vez que o site abre.

export const ACHADOS_EXEMPLO = [
  {
    id: 'a-0142', numero: 142, categoria: 'outros', local: 'Recepção',
    descricao: 'Mochila preta com chaveiro de dinossauro',
    detalheOculto: 'Zíper do bolso da frente quebrado.',
    dataEncontrado: '2026-10-14', status: 'em_analise',
    criadoEm: '2026-10-14T13:10:00.000Z', atualizadoEm: '2026-10-17T15:00:00.000Z',
  },
  {
    id: 'a-0151', numero: 151, categoria: 'garrafas', local: 'Pátio',
    descricao: 'Garrafa térmica verde com adesivos',
    detalheOculto: 'Nome "Lu" escrito na tampa.',
    dataEncontrado: '2026-10-21', status: 'disponivel',
    criadoEm: '2026-10-21T12:00:00.000Z', atualizadoEm: '2026-10-24T14:00:00.000Z',
  },
  {
    id: 'a-0156', numero: 156, categoria: 'documentos', local: 'Recepção',
    descricao: 'Carteirinha de estudante',
    detalheOculto: 'Foto com uniforme azul e matrícula terminando em 77.',
    dataEncontrado: '2026-10-28', status: 'devolvido',
    criadoEm: '2026-10-28T11:30:00.000Z', atualizadoEm: '2026-10-29T17:00:00.000Z',
  },
  {
    id: 'a-0158', numero: 158, categoria: 'garrafas', local: 'Cantina',
    descricao: 'Garrafa térmica azul, 500 ml',
    detalheOculto: 'Adesivo de banda na base.',
    dataEncontrado: '2026-11-02', status: 'em_analise',
    criadoEm: '2026-11-02T13:00:00.000Z', atualizadoEm: '2026-11-12T14:00:00.000Z',
  },
  {
    id: 'a-0161', numero: 161, categoria: 'eletronicos', local: 'Biblioteca',
    descricao: 'Fones de ouvido sem fio, estojo branco',
    detalheOculto: 'Capinha de silicone cinza no estojo.',
    dataEncontrado: '2026-11-05', status: 'em_analise',
    criadoEm: '2026-11-05T16:20:00.000Z', atualizadoEm: '2026-11-11T13:00:00.000Z',
  },
  {
    id: 'a-0163', numero: 163, categoria: 'roupas', local: 'Sala de aula',
    descricao: 'Casaco azul-marinho, tamanho M',
    detalheOculto: 'Chaveiro de caveira no zíper.',
    dataEncontrado: '2026-11-08', status: 'disponivel',
    criadoEm: '2026-11-08T18:00:00.000Z', atualizadoEm: '2026-11-08T18:00:00.000Z',
  },
  {
    id: 'a-0165', numero: 165, categoria: 'chaves', local: 'Laboratório',
    descricao: 'Chaveiro com duas chaves',
    detalheOculto: 'Uma das chaves tem a cabeça pintada de vermelho.',
    dataEncontrado: '2026-11-10', status: 'disponivel',
    criadoEm: '2026-11-10T14:45:00.000Z', atualizadoEm: '2026-11-10T14:45:00.000Z',
  },
]

export const SOLICITACOES_EXEMPLO = [
  {
    id: 's-1', achadoId: 'a-0158', alunoId: 'u-aluno-1', alunoNome: 'Ana Souza',
    descricaoDono: 'Tem um adesivo de uma banda na parte de baixo e um arranhão perto da tampa.',
    status: 'pendente', criadaEm: '2026-11-12T14:00:00.000Z', analisadaEm: null,
  },
  {
    id: 's-2', achadoId: 'a-0161', alunoId: 'u-aluno-2', alunoNome: 'Bruno Lima',
    descricaoDono: 'O estojo está com uma capinha de silicone cinza e falta a borrachinha do fone esquerdo.',
    status: 'pendente', criadaEm: '2026-11-11T13:00:00.000Z', analisadaEm: null,
  },
  {
    id: 's-3', achadoId: 'a-0142', alunoId: 'u-aluno-1', alunoNome: 'Ana Souza',
    descricaoDono: 'O zíper do bolso da frente está quebrado e tem um caderno de matemática dentro.',
    status: 'aprovada', criadaEm: '2026-10-16T12:00:00.000Z', analisadaEm: '2026-10-17T15:00:00.000Z',
  },
  {
    id: 's-4', achadoId: 'a-0151', alunoId: 'u-aluno-1', alunoNome: 'Ana Souza',
    descricaoDono: 'Tem um adesivo de gato na lateral.',
    status: 'recusada', criadaEm: '2026-10-23T12:00:00.000Z', analisadaEm: '2026-10-24T14:00:00.000Z',
  },
]
