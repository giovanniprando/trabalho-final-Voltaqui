import { palavraEmComum } from '../utils/semelhanca'
import { Icone } from './Icone'

const NIVEIS = {
  alta: { texto: 'Alta semelhança', icone: 'check_circulo' },
  media: { texto: 'Média semelhança', icone: 'info' },
  baixa: { texto: 'Baixa semelhança', icone: 'alerta_circulo' },
}

// Faixa que resume a comparação entre o texto do aluno e o detalhe oculto.
export function Semelhanca({ resultado }) {
  const { nivel, emComum, total } = resultado
  const { texto, icone } = NIVEIS[nivel]

  return (
    <div className={`semelhanca semelhanca-${nivel}`}>
      <Icone nome={icone} tamanho={18} />
      <p>
        <strong>{texto}.</strong>
        {' '}{emComum.length} de {total} palavras do detalhe oculto aparecem no pedido.
        {' '}Use como apoio: a decisão é sua.
      </p>
      {/* Barrinha que enche conforme a proporção de palavras em comum */}
      <span className="semelhanca-barra" aria-hidden="true">
        <span style={{ width: `${Math.round(resultado.proporcao * 100)}%` }} />
      </span>
    </div>
  )
}

// Mostra o texto com as palavras em comum marcadas com <mark>.
export function TextoDestacado({ texto, emComum }) {
  // split com parênteses mantém os espaços, para o texto voltar igual.
  return texto.split(/(\s+)/).map((pedaco, i) =>
    palavraEmComum(pedaco, emComum) ? <mark key={i}>{pedaco}</mark> : pedaco,
  )
}
