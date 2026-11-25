import { useEffect, useState } from 'react'
import * as storage from '../services/storage'
import { DadosContext } from './DadosContext'
import { useAviso } from './useAviso'

// Guarda achados e solicitações no estado do React.
// Cada ação grava no localStorage (storage.js) e depois relê tudo,
// assim todas as telas (e o contador do menu) se atualizam juntas.
export function DadosProvider({ children }) {
  const avisar = useAviso()
  const [achados, setAchados] = useState(() => storage.listarAchados())
  const [solicitacoes, setSolicitacoes] = useState(() => storage.listarSolicitacoes())

  function recarregar() {
    setAchados(storage.listarAchados())
    setSolicitacoes(storage.listarSolicitacoes())
  }

  // Outra aba gravou algo (a secretaria aprovou um pedido, por exemplo):
  // o navegador dispara o evento "storage" aqui, e esta aba relê os dados.
  useEffect(() => {
    function aoMudarEmOutraAba(evento) {
      if (evento.key === null || storage.CHAVES_DE_DADOS.includes(evento.key)) {
        setAchados(storage.listarAchados())
        setSolicitacoes(storage.listarSolicitacoes())
      }
    }
    window.addEventListener('storage', aoMudarEmOutraAba)
    return () => window.removeEventListener('storage', aoMudarEmOutraAba)
  }, [])

  // Se o armazenamento estiver cheio, nada é salvo: avisa e devolve null.
  // Quem chamou a ação confere o null antes de seguir.
  function executar(acao) {
    return (...args) => {
      try {
        return acao(...args)
      } catch (erro) {
        if (!(erro instanceof storage.ArmazenamentoCheio)) throw erro
        avisar('Não deu para salvar: o armazenamento do navegador está cheio. Exclua achados antigos ou remova fotos.', 'erro')
        return null
      } finally {
        recarregar()
      }
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
