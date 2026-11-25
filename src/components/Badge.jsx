// Etiqueta colorida de status: achado ou solicitação.

const STATUS = {
  disponivel: { texto: 'Disponível', classe: 'badge-disponivel' },
  em_analise: { texto: 'Em análise', classe: 'badge-analise' },
  devolvido: { texto: 'Devolvido', classe: 'badge-devolvido' },
  pendente: { texto: 'Pendente', classe: 'badge-analise' },
  aprovada: { texto: 'Aprovada', classe: 'badge-disponivel' },
  recusada: { texto: 'Recusada', classe: 'badge-recusada' },
}

export function Badge({ status }) {
  const { texto, classe } = STATUS[status] ?? STATUS.disponivel
  return <span className={`badge ${classe}`}>{texto}</span>
}
