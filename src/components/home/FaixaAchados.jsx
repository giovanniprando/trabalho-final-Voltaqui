const ITENS = [
  { texto: 'Garrafa térmica azul', categoria: 'garrafas' },
  { texto: 'Fone sem fio branco', categoria: 'eletronicos' },
  { texto: 'Casaco cinza com capuz', categoria: 'roupas' },
  { texto: 'Chave com chaveiro de coruja', categoria: 'chaves' },
  { texto: 'Estojo roxo', categoria: 'material-escolar' },
  { texto: 'Carteirinha de estudante', categoria: 'documentos' },
  { texto: 'Óculos de grau', categoria: 'acessorios' },
  { texto: 'Calculadora científica', categoria: 'eletronicos' },
]

function Lista({ copia }) {
  return (
    <ul className="faixa-lista" aria-hidden={copia || undefined}>
      {ITENS.map((item) => (
        <li key={item.texto} className="faixa-item" data-categoria={item.categoria}>
          {item.texto}
        </li>
      ))}
    </ul>
  )
}

// Faixa que passa devagar com objetos esperando o dono. Para quando o mouse passa por cima.
export function FaixaAchados() {
  return (
    <div className="faixa">
      <div className="faixa-trilho">
        <Lista copia={false} />
        <Lista copia />
      </div>
    </div>
  )
}
