import { useCallback, useRef, useState } from 'react'
import { Icone } from '../components/Icone'
import { AvisoContext } from './AvisoContext'

const DURACAO = 4500

export function AvisoProvider({ children }) {
  const [avisos, setAvisos] = useState([])
  const proximoId = useRef(1)

  const fechar = useCallback((id) => {
    setAvisos((lista) => lista.filter((aviso) => aviso.id !== id))
  }, [])

  const avisar = useCallback((texto, tipo = 'sucesso') => {
    const id = proximoId.current++
    setAvisos((lista) => [...lista, { id, texto, tipo }])
    setTimeout(() => fechar(id), DURACAO)
  }, [fechar])

  return (
    <AvisoContext.Provider value={avisar}>
      {children}

      <output className="avisos" aria-live="polite">
        {avisos.map((aviso) => (
          <span key={aviso.id} className={`aviso aviso-${aviso.tipo}`}>
            <Icone nome={aviso.tipo === 'erro' ? 'alerta_circulo' : 'check_circulo'} />
            <span className="aviso-texto">{aviso.texto}</span>
            <button type="button" onClick={() => fechar(aviso.id)} aria-label="Fechar aviso">
              <Icone nome="x" tamanho={16} />
            </button>
          </span>
        ))}
      </output>
    </AvisoContext.Provider>
  )
}
