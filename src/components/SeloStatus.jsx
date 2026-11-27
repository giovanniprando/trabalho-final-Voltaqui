const STATUS = {
  disponivel: { texto: 'Disponível', classe: 'selo-disponivel' },
  em_analise: { texto: 'Em análise', classe: 'selo-analise' },
  devolvido: { texto: 'Devolvido', classe: 'selo-devolvido' },
  pendente: { texto: 'Pendente', classe: 'selo-analise' },
  aprovada: { texto: 'Aprovada', classe: 'selo-disponivel' },
  recusada: { texto: 'Recusada', classe: 'selo-recusada' },
}

const TEXTOS_ALUNO = {
  disponivel: 'Pode solicitar',
  em_analise: 'Em análise pela secretaria',
}

export function SeloStatus({ status, paraAluno = false }) {
  const { texto, classe } = STATUS[status] ?? STATUS.disponivel
  const textoFinal = (paraAluno && TEXTOS_ALUNO[status]) || texto
  return <span className={`selo ${classe}`}>{textoFinal}</span>
}
