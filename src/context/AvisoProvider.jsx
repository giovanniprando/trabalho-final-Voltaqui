import { useCallback, useRef, useState } from 'react'
import { Icone } from '../components/Icone'
import { AvisoContext } from './AvisoContext'

const DURACAO = 4500

// Mostra mensagens rápidas no canto da tela ("Achado cadastrado.").
// Elas somem sozinhas depois de alguns segundos.
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

      <div className="avisos" role="status" aria-live="polite">
        {avisos.map((aviso) => (
          <div key={aviso.id} className={`aviso aviso-${aviso.tipo}`}>
            <Icone nome={aviso.tipo === 'erro' ? 'alerta_circulo' : 'check_circulo'} />
            <p>{aviso.texto}</p>
            <button type="button" onClick={() => fechar(aviso.id)} aria-label="Fechar aviso">
              <Icone nome="x" tamanho={16} />
            </button>
          </div>
        ))}
      </div>
    </AvisoContext.Provider>
  )
}
