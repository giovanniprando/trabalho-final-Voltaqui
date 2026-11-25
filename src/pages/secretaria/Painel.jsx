import { Link } from 'react-router-dom'
import { Badge } from '../../components/Badge'
import { Icone } from '../../components/Icone'
import { IconeCategoria } from '../../components/IconeCategoria'
import { useDados } from '../../context/useDados'
import { buscarLocal } from '../../data/locais'
import { STATUS_ACHADO, STATUS_SOLICITACAO } from '../../services/storage'
import { formatarData, formatarNumero } from '../../utils/formatar'
import '../../styles/secretaria-painel.css'

export default function Painel() {
  const { achados, solicitacoes, buscarAchado } = useDados()

  const contar = (status) => achados.filter((a) => a.status === status).length
  const pendentes = solicitacoes
    .filter((s) => s.status === STATUS_SOLICITACAO.PENDENTE)
    .sort((a, b) => a.criadaEm.localeCompare(b.criadaEm))
  const ultimos = [...achados].sort((a, b) => b.criadoEm.localeCompare(a.criadoEm)).slice(0, 4)

  const indicadores = [
    { icone: 'pacote', numero: contar(STATUS_ACHADO.DISPONIVEL), rotulo: 'Achados disponíveis' },
    { icone: 'relogio', numero: contar(STATUS_ACHADO.EM_ANALISE), rotulo: 'Em análise' },
    { icone: 'caixa_entrada', numero: pendentes.length, rotulo: 'Solicitações pendentes' },
    { icone: 'check_circulo', numero: contar(STATUS_ACHADO.DEVOLVIDO), rotulo: 'Devolvidos' },
  ]

  return (
    <>
      <header className="pagina-cabecalho pagina-cabecalho-com-acao">
        <div>
          <h1>Painel</h1>
          <p>Resumo dos achados e das solicitações.</p>
        </div>
        <Link className="botao botao-primario" to="/secretaria/novo">
          <Icone nome="mais" />
          Cadastrar achado
        </Link>
      </header>

      <ul className="indicadores" aria-label="Resumo">
        {indicadores.map((item) => (
          <li key={item.rotulo} className="cartao indicador">
            <span className="icone-categoria icone-categoria-sm">
              <Icone nome={item.icone} tamanho={18} />
            </span>
            <p className="indicador-numero">{item.numero}</p>
            <p className="indicador-rotulo">{item.rotulo}</p>
          </li>
        ))}
      </ul>

      <div className="painel-colunas">
        <section className="cartao painel-bloco" aria-labelledby="titulo-pendentes">
          <header className="painel-bloco-topo">
            <h2 id="titulo-pendentes">Esperando análise</h2>
            <Link className="link link-com-icone" to="/secretaria/solicitacoes">
              Ver todas
              <Icone nome="seta" tamanho={16} />
            </Link>
          </header>

          {pendentes.length === 0 ? (
            <p className="recente-meta">Nenhum pedido esperando. Tudo em dia!</p>
          ) : (
            <ul className="recentes">
              {pendentes.slice(0, 4).map((s) => {
                const achado = buscarAchado(s.achadoId)
                if (!achado) return null
                return (
                  <li key={s.id} className="recente">
                    <IconeCategoria categoria={achado.categoria} tamanho="pequeno" />
                    <div className="recente-achado">
                      <p className="recente-titulo">{achado.descricao}</p>
                      <p className="recente-meta">
                        <strong>{s.alunoNome}</strong> · pediu em {formatarData(s.criadaEm)} ·{' '}
                        <span className="numero-achado">{formatarNumero(achado.numero)}</span>
                      </p>
                    </div>
                    <Badge status={s.status} />
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        <section className="cartao painel-bloco" aria-labelledby="titulo-ultimos">
          <header className="painel-bloco-topo">
            <h2 id="titulo-ultimos">Últimos cadastrados</h2>
            <Link className="link link-com-icone" to="/secretaria/achados">
              Ver achados
              <Icone nome="seta" tamanho={16} />
            </Link>
          </header>

          <ul className="recentes">
            {ultimos.map((achado) => (
              <li key={achado.id} className="recente">
                <IconeCategoria categoria={achado.categoria} tamanho="pequeno" />
                <div className="recente-achado">
                  <p className="recente-titulo">{achado.descricao}</p>
                  <p className="recente-meta">
                    {buscarLocal(achado.local)?.nome} · {formatarData(achado.dataEncontrado)}
                  </p>
                </div>
                <Badge status={achado.status} />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  )
}
