import { useState } from 'react'
import { Link } from 'react-router'
import { SeloStatus } from '../../components/SeloStatus'
import { DiasParado } from '../../components/DiasParado'
import { Icone } from '../../components/Icone'
import { IconeCategoria } from '../../components/IconeCategoria'
import { Modal } from '../../components/Modal'
import { useAviso } from '../../context/useAviso'
import { useDados } from '../../context/useDados'
import { nomeDoLocal } from '../../data/locais'
import { STATUS_ACHADO, STATUS_SOLICITACAO } from '../../services/storage'
import { formatarNumero, normalizar } from '../../utils/formatar'
import { formatarData } from '../../utils/datas'
import { useTitulo } from '../../hooks/useTitulo'
import '../../styles/secretaria-painel.css'

// { nome: 'Cantina', quantidade: 3 }, ... ignorando acento e maiúscula no nome.
function contarPorLocal(achados) {
  const contagem = {}
  for (const achado of achados) {
    const nome = nomeDoLocal(achado.local)
    const chave = normalizar(nome)
    if (!contagem[chave]) contagem[chave] = { nome, chave, quantidade: 0 }
    contagem[chave].quantidade += 1
  }
  return Object.values(contagem).toSorted((a, b) => b.quantidade - a.quantidade).slice(0, 6)
}

export default function Painel() {
  useTitulo('Painel')
  const { achados, solicitacoes, buscarAchado, restaurarExemplos } = useDados()
  const avisar = useAviso()
  const [confirmarRestauro, setConfirmarRestauro] = useState(false)

  function restaurar() {
    setConfirmarRestauro(false)
    if (restaurarExemplos()) avisar('Dados de exemplo restaurados.')
  }

  const contar = (status) => achados.filter((a) => a.status === status).length
  const pendentes = solicitacoes
    .filter((s) => s.status === STATUS_SOLICITACAO.PENDENTE)
    .toSorted((a, b) => a.criadaEm.localeCompare(b.criadaEm))
  const ultimos = achados.toSorted((a, b) => b.criadoEm.localeCompare(a.criadoEm)).slice(0, 4)

  // Itens que ainda estão na secretaria, do que chegou há mais tempo para o mais novo.
  const parados = achados
    .filter((a) => a.status === STATUS_ACHADO.DISPONIVEL)
    .toSorted((a, b) => a.dataEncontrado.localeCompare(b.dataEncontrado))
    .slice(0, 4)

  // Quantos achados apareceram em cada local, do maior para o menor.
  const porLocal = contarPorLocal(achados)
  const maiorQuantidade = porLocal[0]?.quantidade ?? 1

  const indicadores = [
    // "tom" escolhe a cor do cartão (veja secretaria-painel.css).
    { icone: 'pacote', numero: contar(STATUS_ACHADO.DISPONIVEL), rotulo: 'Achados disponíveis', tom: 'verde', para: '/secretaria/achados' },
    { icone: 'relogio', numero: contar(STATUS_ACHADO.EM_ANALISE), rotulo: 'Em análise', tom: 'azul', para: '/secretaria/achados' },
    { icone: 'caixa_entrada', numero: pendentes.length, rotulo: 'Pedidos pendentes', tom: 'laranja', para: '/secretaria/solicitacoes' },
    { icone: 'check_circulo', numero: contar(STATUS_ACHADO.DEVOLVIDO), rotulo: 'Devolvidos', tom: 'cinza', para: '/secretaria/achados' },
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
          <li key={item.rotulo}>
            <Link className={`cartao indicador indicador-${item.tom}`} to={item.para}>
              <span className="indicador-icone">
                <Icone nome={item.icone} tamanho={20} />
              </span>
              <span className="indicador-numero">{item.numero}</span>
              <span className="indicador-rotulo">{item.rotulo}</span>
            </Link>
          </li>
        ))}
      </ul>

      {/* Grade 2 x 2: os blocos da mesma linha ficam com a mesma altura. */}
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
            <p className="recente-meta">Nenhum pedido esperando análise.</p>
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
                    <SeloStatus status={s.status} />
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        <section className="cartao painel-bloco" aria-labelledby="titulo-parados">
          <header className="painel-bloco-topo">
            <h2 id="titulo-parados">Há mais tempo na secretaria</h2>
          </header>
          {parados.length === 0 ? (
            <p className="recente-meta">Nenhum achado esperando o dono agora.</p>
          ) : (
            <ul className="recentes">
              {parados.map((achado) => (
                <li key={achado.id} className="recente">
                  <IconeCategoria categoria={achado.categoria} tamanho="pequeno" />
                  <div className="recente-achado">
                    <p className="recente-titulo">{achado.descricao}</p>
                    <DiasParado data={achado.dataEncontrado} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="cartao painel-bloco" aria-labelledby="titulo-locais">
          <header className="painel-bloco-topo">
            <h2 id="titulo-locais">Onde mais se perde</h2>
          </header>
          <p className="painel-bloco-texto">Clique num local para ver os achados de lá.</p>
          <ul className="locais-barras">
            {porLocal.map((local) => (
              <li key={local.chave}>
                <Link to={`/secretaria/achados?local=${local.chave}`}>
                  <span className="locais-barras-nome">{local.nome}</span>
                  {/* A barra tem largura proporcional ao local com mais achados */}
                  <span className="locais-barras-trilho" aria-hidden="true">
                    <span style={{ width: `${(local.quantidade / maiorQuantidade) * 100}%` }} />
                  </span>
                  <span className="locais-barras-numero">
                    {local.quantidade} {local.quantidade === 1 ? 'achado' : 'achados'}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
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
                    {nomeDoLocal(achado.local)} · {formatarData(achado.dataEncontrado)}
                  </p>
                </div>
                <SeloStatus status={achado.status} />
              </li>
            ))}
          </ul>
        </section>
      </div>

      <p className="painel-rodape">
        Vai apresentar ou testar do zero?{' '}
        <button className="link botao-link" type="button" onClick={() => setConfirmarRestauro(true)}>
          Restaurar dados de exemplo
        </button>
      </p>

      {confirmarRestauro && (
        <Modal
          titulo="Restaurar dados de exemplo?"
          textoConfirmar="Restaurar"
          iconeConfirmar={null}
          onConfirmar={restaurar}
          onFechar={() => setConfirmarRestauro(false)}
        >
          Os achados e as solicitações voltam a ser os 7 achados e os 4 pedidos de exemplo. Tudo o
          que foi cadastrado, editado ou excluído depois disso se perde. As contas de aluno criadas
          e o seu login continuam. Os próximos números de achado seguem a contagem, sem repetir.
        </Modal>
      )}
    </>
  )
}
