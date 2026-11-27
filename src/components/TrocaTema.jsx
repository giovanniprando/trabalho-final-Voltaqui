import { useState } from 'react'
import { salvarTema } from '../services/storage'
import { aplicarTema } from '../utils/tema'
import { Icone } from './Icone'

// Botão do canto superior direito que troca entre tema claro e escuro.
export function TrocaTema() {
  const [tema, setTema] = useState(() => document.documentElement.dataset.tema)
  const escuro = tema === 'escuro'

  function trocar() {
    const novo = escuro ? 'claro' : 'escuro'
    aplicarTema(novo)
    setTema(novo)
    salvarTema(novo)
  }

  return (
    <button
      className="troca-tema"
      type="button"
      onClick={trocar}
      aria-label={escuro ? 'Usar tema claro' : 'Usar tema escuro'}
      title={escuro ? 'Tema claro' : 'Tema escuro'}
    >
      <Icone nome={escuro ? 'sol' : 'lua'} />
    </button>
  )
}
