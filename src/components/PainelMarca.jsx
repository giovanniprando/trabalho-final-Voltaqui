import { useEffect, useRef } from 'react'
import { Link } from 'react-router'
import { iniciarEtiquetaFisica } from '../lib/etiquetaFisica'

export function PainelMarca({ etiqueta, descricao }) {
  const painelRef = useRef(null)

  useEffect(
    () => iniciarEtiquetaFisica(painelRef.current, { obstaculos: ['.marca-logo', '.marca-texto'] }),
    [],
  )

  return (
    <aside className="marca" ref={painelRef}>
      <Link className="marca-logo" to="/">
        <img src="/img/logo-horizontal-escura.svg" alt="voltAqui, início" width="159" height="56" />
      </Link>

      <div className="etiqueta-area" aria-hidden="true">
        <div className="etiqueta">
          <p className="etiqueta-numero">Achado nº {etiqueta.numero}</p>
          <p className="etiqueta-objeto">{etiqueta.objeto}</p>
          <p className="etiqueta-local">{etiqueta.local}</p>
          <span className={`selo ${etiqueta.classe}`}>{etiqueta.status}</span>
        </div>
      </div>

      <div className="marca-texto">
        <p className="marca-slogan">Se é seu, <span>merece voltar.</span></p>
        <p className="marca-descricao">{descricao}</p>
      </div>
    </aside>
  )
}
