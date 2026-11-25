import { useState } from 'react'
import * as storage from '../services/storage'
import { DadosContext } from './DadosContext'

// Guarda achados e solicitações no estado do React.
// Cada ação grava no localStorage (storage.js) e depois relê tudo,
// assim todas as telas (e o contador do menu) se atualizam juntas.
export function DadosProvider({ children }) {
  const [achados, setAchados] = useState(() => storage.listarAchados())
  const [solicitacoes, setSolicitacoes] = useState(() => storage.listarSolicitacoes())

  function recarregar() {
    setAchados(storage.listarAchados())
    setSolicitacoes(storage.listarSolicitacoes())
  }

  function executar(acao) {
    return (...args) => {
      const resultado = acao(...args)
      recarregar()
      return resultado
    }
  }

  const valor = {
    achados,
    solicitacoes,
    buscarAchado: (id) => achados.find((a) => a.id === id) ?? null,
    cadastrarAchado: executar(storage.criarAchado),
    editarAchado: executar(storage.atualizarAchado),
    removerAchado: executar(storage.excluirAchado),
    solicitarDevolucao: executar(storage.criarSolicitacao),
    aprovar: executar(storage.aprovarSolicitacao),
    recusar: executar(storage.recusarSolicitacao),
    marcarDevolvido: executar(storage.marcarDevolvido),
    restaurarExemplos: executar(storage.restaurarExemplos),
  }

  return <DadosContext.Provider value={valor}>{children}</DadosContext.Provider>
}
