import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { SeloStatus } from '../../components/SeloStatus'
import { EstadoVazio } from '../../components/EstadoVazio'
import { Icone } from '../../components/Icone'
import { IconeCategoria } from '../../components/IconeCategoria'
import { Modal } from '../../components/Modal'
import { Semelhanca, TextoDestacado } from '../../components/Semelhanca'
import { useAviso } from '../../context/useAviso'
import { useDados } from '../../context/useDados'
import { buscarCategoria } from '../../data/categorias'
import { nomeDoLocal } from '../../data/locais'
import { STATUS_ACHADO, STATUS_SOLICITACAO } from '../../services/storage'
import { formatarNumero } from '../../utils/formatar'
import { formatarData } from '../../utils/datas'
import { compararDescricoes } from '../../utils/semelhanca'
import { useTitulo } from '../../hooks/useTitulo'
import '../../styles/secretaria-solicitacoes.css'

const ABAS = [
  { status: STATUS_SOLICITACAO.PENDENTE, nome: 'Pendentes', titulo: 'Tudo em dia', vazio: 'Nenhum pedido esperando análise. Quando um aluno pedir algo, ele aparece aqui.' },
  { status: STATUS_SOLICITACAO.APROVADA, nome: 'Aprovadas', titulo: 'Nada aprovado ainda', vazio: 'Os pedidos que você aprovar ficam aqui até o aluno retirar.' },
  { status: STATUS_SOLICITACAO.RECUSADA, nome: 'Recusadas', titulo: 'Nenhum pedido recusado', vazio: 'Ótimo sinal: até agora todo mundo pediu só o que era seu.' },
]

function CardSolicitacao({ solicitacao, achado, onAprovar, onRecusar, onDevolver }) {
  const devolvido = achado.status === STATUS_ACHADO.DEVOLVIDO
  const comparacao = compararDescricoes(solicitacao.descricaoDono, achado.detalheOculto, achado.descricao)

  return (
    <article className="cartao solicitacao">
      <header className="solicitacao-topo">
        <IconeCategoria categoria={achado.categoria} />
        <div className="solicitacao-achado">
          <h3>{achado.descricao}</h3>
          <p>
            {buscarCategoria(achado.categoria)?.nome} · {nomeDoLocal(achado.local)} ·{' '}
            <span className="numero-achado">{formatarNumero(achado.numero)}</span>
          </p>
        </div>
        <SeloStatus status={solicitacao.status} />
      </header>

      <p className="solicitacao-pedido">
        <span><Icone nome="capelo" tamanho={16} /> <strong>{solicitacao.alunoNome}</strong></span>
        <span><Icone nome="calendario" tamanho={16} /> Pedido em {formatarData(solicitacao.criadaEm)}</span>
      </p>

      <div className="conferencia">
        <div className="conferencia-bloco">
          <h4>O que o aluno descreveu</h4>
          <p><TextoDestacado texto={solicitacao.descricaoDono} emComum={comparacao.emComum} /></p>
        </div>
        <div className="conferencia-bloco conferencia-oculto">
          <h4><Icone nome="cadeado" tamanho={16} /> Detalhe oculto</h4>
          <p><TextoDestacado texto={achado.detalheOculto} emComum={comparacao.emComum} /></p>
        </div>
      </div>

      <Semelhanca resultado={comparacao} />

      <div className="solicitacao-acoes">
        {solicitacao.status === STATUS_SOLICITACAO.PENDENTE && (
          <>
            <button className="botao botao-perigo" type="button" onClick={() => onRecusar(solicitacao)}>
              <Icone nome="x" />
              Recusar
            </button>
            <button className="botao botao-primario" type="button" onClick={() => onAprovar(solicitacao)}>
              <Icone nome="check" />
              Aprovar
            </button>
          </>
        )}

        {solicitacao.status === STATUS_SOLICITACAO.APROVADA && !devolvido && (
          <>
            <p className="solicitacao-nota">
              Aprovada em {formatarData(solicitacao.analisadaEm)}. Esperando o aluno retirar.
            </p>
            <button className="botao botao-primario" type="button" onClick={() => onDevolver(solicitacao, achado)}>
              <Icone nome="check_circulo" />
              Marcar como devolvido
            </button>
          </>
        )}

        {solicitacao.status === STATUS_SOLICITACAO.APROVADA && devolvido && (
          <>
            <p className="solicitacao-nota">
              Entregue ao aluno em {formatarData(achado.devolvidoEm ?? achado.atualizadoEm)}.
            </p>
            <Link className="botao botao-secundario" to={`/secretaria/comprovante/${solicitacao.id}`}>
              <Icone nome="impressora" />
              Ver comprovante
            </Link>
          </>
        )}

        {solicitacao.status === STATUS_SOLICITACAO.RECUSADA && (
          <p className="solicitacao-nota">Recusada em {formatarData(solicitacao.analisadaEm)}.</p>
        )}
      </div>
    </article>
  )
}

export default function Solicitacoes() {
  useTitulo('Solicitações')
  const { solicitacoes, buscarAchado, aprovar, recusar, marcarDevolvido } = useDados()
  const avisar = useAviso()
  const navigate = useNavigate()
  const [aba, setAba] = useState(STATUS_SOLICITACAO.PENDENTE)
  const [paraRecusar, setParaRecusar] = useState(null)

  const comAchado = solicitacoes
    .map((s) => ({ solicitacao: s, achado: buscarAchado(s.achadoId) }))
    .filter((item) => item.achado)

  const contar = (status) => comAchado.filter((item) => item.solicitacao.status === status).length
  const abaAtual = ABAS.find((a) => a.status === aba)
  const lista = comAchado
    .filter((item) => item.solicitacao.status === aba)
    .toSorted((a, b) => b.solicitacao.criadaEm.localeCompare(a.solicitacao.criadaEm))

  function aoAprovar(solicitacao) {
    const outros = solicitacoes.filter(
      (s) => s.achadoId === solicitacao.achadoId && s.id !== solicitacao.id && s.status === STATUS_SOLICITACAO.PENDENTE,
    ).length
    if (!aprovar(solicitacao.id)) {
      avisar('Este achado já tem um pedido aprovado.', 'erro')
      return
    }
    const extra = outros === 1 ? ' O outro pedido deste achado foi recusado.'
      : outros > 1 ? ` Os outros ${outros} pedidos deste achado foram recusados.` : ''
    avisar(`Pedido de ${solicitacao.alunoNome} aprovado.${extra}`)
  }

  function confirmarRecusa() {
    if (recusar(paraRecusar.id)) avisar(`Pedido de ${paraRecusar.alunoNome} recusado.`)
    setParaRecusar(null)
  }

  function aoDevolver(solicitacao, achado) {
    if (!marcarDevolvido(achado.id)) return
    avisar(`${formatarNumero(achado.numero)} entregue para ${solicitacao.alunoNome}.`)
    navigate(`/secretaria/comprovante/${solicitacao.id}`)
  }

  function aoApertarTecla(evento) {
    const indice = ABAS.findIndex((a) => a.status === aba)
    let novo = null
    if (evento.key === 'ArrowRight') novo = (indice + 1) % ABAS.length
    if (evento.key === 'ArrowLeft') novo = (indice - 1 + ABAS.length) % ABAS.length
    if (novo === null) return
    setAba(ABAS[novo].status)
    document.getElementById(`aba-${ABAS[novo].status}`)?.focus()
  }

  return (
    <>
      <header className="pagina-cabecalho">
        <h1>Solicitações</h1>
        <p>Compare o que o aluno descreveu com o detalhe oculto antes de aprovar.</p>
      </header>

      <div className="abas" role="tablist" aria-label="Situação dos pedidos">
        {ABAS.map((a) => (
          <button
            key={a.status}
            id={`aba-${a.status}`}
            className="aba"
            type="button"
            role="tab"
            aria-selected={aba === a.status}
            aria-controls="painel-solicitacoes"
            tabIndex={aba === a.status ? 0 : -1}
            onClick={() => setAba(a.status)}
            onKeyDown={aoApertarTecla}
          >
            {a.nome} <span className="aba-contagem">{contar(a.status)}</span>
          </button>
        ))}
      </div>

      <section id="painel-solicitacoes" className="abas-painel" role="tabpanel" aria-labelledby={`aba-${aba}`}>
        {lista.length === 0 ? (
          <EstadoVazio icone="caixa_entrada" titulo={abaAtual.titulo} texto={abaAtual.vazio} />
        ) : (
          lista.map(({ solicitacao, achado }) => (
            <CardSolicitacao
              key={solicitacao.id}
              solicitacao={solicitacao}
              achado={achado}
              onAprovar={aoAprovar}
              onRecusar={setParaRecusar}
              onDevolver={aoDevolver}
            />
          ))
        )}
      </section>

      {paraRecusar && (
        <Modal
          titulo="Recusar o pedido?"
          textoConfirmar="Recusar"
          iconeConfirmar="x"
          onConfirmar={confirmarRecusa}
          onFechar={() => setParaRecusar(null)}
        >
          {paraRecusar.alunoNome} não vai poder pedir este achado de novo. Se for mesmo o dono,
          vai precisar falar com a secretaria.
        </Modal>
      )}
    </>
  )
}
