import { useEffect, useRef } from 'react'
import { Icone } from './Icone'

// Caixa de confirmação. Fecha com Esc, com o botão Cancelar ou clicando fora.
export function Modal({ titulo, children, textoConfirmar, onConfirmar, onFechar }) {
  const cancelarRef = useRef(null)
  const fecharRef = useRef(onFechar)

  useEffect(() => {
    fecharRef.current = onFechar
  })

  useEffect(() => {
    const focoAnterior = document.activeElement
    cancelarRef.current?.focus()

    function aoApertarTecla(evento) {
      if (evento.key === 'Escape') fecharRef.current()
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
    <div className="modal modal-aberto" onMouseDown={aoClicarFundo}>
      <div
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
            <Icone nome="lixeira" />
            {textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  )
}
