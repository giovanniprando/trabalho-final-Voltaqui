import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { useDados } from '../context/useDados'
import { lerUltimaLeitura, marcarNotificacoesLidas, STATUS_SOLICITACAO } from '../services/storage'
import { formatarData } from '../utils/datas'
import { Icone } from './Icone'

// Sino do aluno: avisa quando a secretaria aprova ou recusa um pedido.
export function Notificacoes({ usuario }) {
  const { solicitacoes, buscarAchado } = useDados()
  const [aberto, setAberto] = useState(false)
  const [ultimaLeitura, setUltimaLeitura] = useState(() => lerUltimaLeitura(usuario.id))
  const caixa = useRef(null)

  // Uma notificação para cada pedido do aluno que já foi analisado.
  const notificacoes = solicitacoes
    .filter((s) => s.alunoId === usuario.id && s.analisadaEm)
    .map((s) => ({ ...s, achado: buscarAchado(s.achadoId) }))
    .filter((s) => s.achado)
    .toSorted((a, b) => b.analisadaEm.localeCompare(a.analisadaEm))

  const naoLidas = notificacoes.filter((n) => !ultimaLeitura || n.analisadaEm > ultimaLeitura).length

  // Ao abrir, grava que o aluno viu tudo. O destaque de "nova" continua
  // na tela enquanto a caixa está aberta e só some quando ela fecha.
  function abrir() {
    marcarNotificacoesLidas(usuario.id)
    setAberto(true)
  }

  function fechar() {
    setAberto(false)
    setUltimaLeitura(lerUltimaLeitura(usuario.id))
  }

  // Fecha com Esc ou clicando fora da caixa.
  useEffect(() => {
    if (!aberto) return
    function fecharCaixa() {
      setAberto(false)
      setUltimaLeitura(lerUltimaLeitura(usuario.id))
    }
    function aoClicarFora(evento) {
      if (!caixa.current?.contains(evento.target)) fecharCaixa()
    }
    function aoApertarTecla(evento) {
      if (evento.key === 'Escape') fecharCaixa()
    }
    document.addEventListener('mousedown', aoClicarFora)
    document.addEventListener('keydown', aoApertarTecla)
    return () => {
      document.removeEventListener('mousedown', aoClicarFora)
      document.removeEventListener('keydown', aoApertarTecla)
    }
  }, [aberto, usuario.id])

  return (
    <div className="notificacoes" ref={caixa}>
      <button
        type="button"
        className="notificacoes-sino"
        onClick={aberto ? fechar : abrir}
        aria-expanded={aberto}
        aria-controls="lista-notificacoes"
        aria-label={naoLidas > 0 ? `Notificações, ${naoLidas} novas` : 'Notificações'}
      >
        <Icone nome="sino" />
        {naoLidas > 0 && <span className="notificacoes-contador">{naoLidas}</span>}
      </button>

      {aberto && (
        <div id="lista-notificacoes" className="notificacoes-caixa">
          <p className="notificacoes-titulo">Notificações</p>

          {notificacoes.length === 0 ? (
            <p className="notificacoes-vazio">
              Quando a secretaria responder um pedido seu, o aviso aparece aqui.
            </p>
          ) : (
            <ul>
              {notificacoes.slice(0, 5).map((n) => {
                const aprovada = n.status === STATUS_SOLICITACAO.APROVADA
                const nova = !ultimaLeitura || n.analisadaEm > ultimaLeitura
                return (
                  <li key={n.id} className={nova ? 'notificacao-nova' : undefined}>
                    <span className={`notificacao-icone ${aprovada ? 'notificacao-aprovada' : 'notificacao-recusada'}`}>
                      <Icone nome={aprovada ? 'check' : 'x'} tamanho={16} />
                    </span>
                    <span>
                      <strong>{aprovada ? 'Pedido aprovado' : 'Pedido recusado'}</strong>
                      {n.achado.descricao}
                      <small>{formatarData(n.analisadaEm)}</small>
                    </span>
                  </li>
                )
              })}
            </ul>
          )}

          <Link className="link notificacoes-ver" to="/minhas-solicitacoes" onClick={fechar}>
            Ver minhas solicitações
          </Link>
        </div>
      )}
    </div>
  )
}
