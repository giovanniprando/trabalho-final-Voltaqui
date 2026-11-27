// Selo colorido de status: do achado ou da solicitação.

const STATUS = {
  disponivel: { texto: 'Disponível', classe: 'selo-disponivel' },
  em_analise: { texto: 'Em análise', classe: 'selo-analise' },
  devolvido: { texto: 'Devolvido', classe: 'selo-devolvido' },
  pendente: { texto: 'Pendente', classe: 'selo-analise' },
  aprovada: { texto: 'Aprovada', classe: 'selo-disponivel' },
  recusada: { texto: 'Recusada', classe: 'selo-recusada' },
}

export function SeloStatus({ status }) {
  const { texto, classe } = STATUS[status] ?? STATUS.disponivel
  return <span className={`selo ${classe}`}>{texto}</span>
}
