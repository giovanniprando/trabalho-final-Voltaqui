import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { iniciarEtiquetaFisica } from '../lib/etiquetaFisica'

// Painel azul da esquerda no login e no criar conta, com a etiqueta que voa.
export function PainelMarca({ etiqueta, descricao }) {
  const painelRef = useRef(null)

  useEffect(() => iniciarEtiquetaFisica(painelRef.current), [])

  return (
    <aside className="marca" ref={painelRef}>
      <Link className="marca-logo" to="/">
        <img src="/img/logo-horizontal-escura.svg" alt="Voltaqui, início" width="159" height="56" />
      </Link>

      <div className="etiqueta-area" aria-hidden="true">
        <div className="etiqueta">
          <p className="etiqueta-numero">Achado nº {etiqueta.numero}</p>
          <p className="etiqueta-objeto">{etiqueta.objeto}</p>
          <p className="etiqueta-local">{etiqueta.local}</p>
          <span className={`badge ${etiqueta.classe}`}>{etiqueta.status}</span>
        </div>
      </div>

      <div>
        <p className="marca-slogan">Se é seu, <span>merece voltar.</span></p>
        <p className="marca-descricao">{descricao}</p>
      </div>
    </aside>
  )
}
