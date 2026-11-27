import { useEffect, useState } from 'react'
import { lerTema, salvarTema } from '../services/storage'
import { aplicarTema, sistemaEscuro, temaInicial } from '../utils/tema'
import { TemaContext } from './TemaContext'

export function TemaProvider({ children }) {
  const [tema, setTema] = useState(temaInicial)
  const [escolhido, setEscolhido] = useState(() => lerTema() !== null)

  useEffect(() => {
    aplicarTema(tema)
  }, [tema])

  // Enquanto a pessoa não escolhe, o site acompanha o sistema (Windows, celular).
  useEffect(() => {
    if (escolhido) return
    function aoMudarSistema(evento) {
      setTema(evento.matches ? 'escuro' : 'claro')
    }
    sistemaEscuro.addEventListener('change', aoMudarSistema)
    return () => sistemaEscuro.removeEventListener('change', aoMudarSistema)
  }, [escolhido])

  function alternarTema() {
    const novo = tema === 'escuro' ? 'claro' : 'escuro'
    setTema(novo)
    setEscolhido(true)
    salvarTema(novo)
  }

  return <TemaContext.Provider value={{ tema, alternarTema }}>{children}</TemaContext.Provider>
}
