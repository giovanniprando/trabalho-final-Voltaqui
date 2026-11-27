import { useState } from 'react'
import { Semelhanca, TextoDestacado } from '../Semelhanca'
import { compararDescricoes } from '../../utils/semelhanca'

const DESCRICAO = 'Garrafa térmica azul, 500 ml'
const DETALHE = 'Adesivo de banda na base e tampa azul arranhada'

const EXEMPLOS = [
  { nome: 'Pedido do dono', texto: 'Tem um adesivo da minha banda embaixo e a tampa é arranhada' },
  { nome: 'Lembra só um pouco', texto: 'Tem um adesivo e a tampa está riscada' },
  { nome: 'Copiou a descrição', texto: 'Garrafa térmica azul de 500 ml, tampa azul' },
]

export function DemoConferencia() {
  const [pedido, setPedido] = useState(EXEMPLOS[0].texto)
  const comparacao = compararDescricoes(pedido, DETALHE, DESCRICAO)

  return (
    <div className="demo-conferencia">
      <fieldset className="demo-exemplos">
        <legend className="visualmente-oculto">Exemplos de pedido</legend>
        {EXEMPLOS.map((exemplo) => (
          <button
            key={exemplo.nome}
            type="button"
            className="demo-exemplo"
            aria-pressed={pedido === exemplo.texto}
            onClick={() => setPedido(exemplo.texto)}
          >
            {exemplo.nome}
          </button>
        ))}
      </fieldset>

      <div className="demo-campo">
        <label htmlFor="demo-pedido">O que o aluno escreveu (pode editar)</label>
        <textarea
          id="demo-pedido"
          rows={2}
          maxLength={160}
          value={pedido}
          onChange={(e) => setPedido(e.target.value)}
        />
      </div>

      <div className="conferencia demo-blocos">
        <div className="demo-bloco">
          <p className="demo-rotulo">Pedido com as palavras em comum</p>
          <p>{pedido.trim() ? <TextoDestacado texto={pedido} emComum={comparacao.emComum} /> : '...'}</p>
        </div>
        <div className="demo-bloco demo-bloco-oculto">
          <p className="demo-rotulo">Detalhe oculto (só a secretaria vê)</p>
          <p><TextoDestacado texto={DETALHE} emComum={comparacao.emComum} /></p>
        </div>
      </div>

      <div aria-live="polite">
        <Semelhanca resultado={comparacao} />
      </div>
    </div>
  )
}
