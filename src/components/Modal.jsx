import { useEffect, useRef } from 'react'
import { Icone } from './Icone'

// Caixa de confirmação. Fecha com Esc, com o botão Cancelar ou clicando fora.
// Enquanto está aberta, o Tab só passa pelos botões dela; ao fechar, o foco
// volta para o botão que abriu.
export function Modal({ titulo, children, textoConfirmar, iconeConfirmar = 'lixeira', onConfirmar, onFechar }) {
  const caixaRef = useRef(null)
  const cancelarRef = useRef(null)
  const fecharRef = useRef(onFechar)

  useEffect(() => {
    fecharRef.current = onFechar
  })

  useEffect(() => {
    const focoAnterior = document.activeElement
    cancelarRef.current?.focus()

    function aoApertarTecla(evento) {
      if (evento.key === 'Escape') {
        fecharRef.current()
        return
      }
      if (evento.key !== 'Tab') return
      const botoes = caixaRef.current.querySelectorAll('button, a[href], input, select, textarea')
      const primeiro = botoes[0]
      const ultimo = botoes[botoes.length - 1]
      if (evento.shiftKey && document.activeElement === primeiro) {
        evento.preventDefault()
        ultimo.focus()
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault()
        primeiro.focus()
      } else if (!caixaRef.current.contains(document.activeElement)) {
        evento.preventDefault()
        primeiro.focus()
      }
    }
    document.addEventListener('keydown', aoApertarTecla)

    return () => {
      document.removeEventListener('keydown', aoApertarTecla)
      focoAnterior?.focus?.()
    }
  }, [])

  function aoClicarFundo(evento) {
    if (evento.target === evento.currentTarget) onFechar()
  }

  return (
    <div className="modal" role="presentation" onMouseDown={aoClicarFundo}>
      <div
        ref={caixaRef}
        className="modal-caixa"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="modal-titulo"
        aria-describedby="modal-texto"
      >
        <span className="modal-icone">
          <Icone nome="alerta" tamanho={24} />
        </span>
        <h2 id="modal-titulo">{titulo}</h2>
        <p id="modal-texto">{children}</p>
        <div className="modal-acoes">
          <button ref={cancelarRef} className="botao botao-secundario" type="button" onClick={onFechar}>
            Cancelar
          </button>
          <button className="botao botao-perigo-cheio" type="button" onClick={onConfirmar}>
            {iconeConfirmar && <Icone nome={iconeConfirmar} />}
            {textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  )
}
