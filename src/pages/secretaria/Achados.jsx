import { useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { SeloStatus } from '../../components/SeloStatus'
import { DiasParado } from '../../components/DiasParado'
import { Icone } from '../../components/Icone'
import { FotoOuIcone } from '../../components/FotoOuIcone'
import { Modal } from '../../components/Modal'
import { useAviso } from '../../context/useAviso'
import { useDados } from '../../context/useDados'
import { CATEGORIAS, buscarCategoria } from '../../data/categorias'
import { NOMES_STATUS } from '../../data/status'
import { STATUS_ACHADO, STATUS_SOLICITACAO } from '../../services/storage'
import { ORDENS, ordenarAchados } from '../../utils/ordenar'
import { locaisUsados, nomeDoLocal } from '../../data/locais'
import { formatarNumero, normalizar } from '../../utils/formatar'
import { formatarData } from '../../utils/datas'
import { useTitulo } from '../../hooks/useTitulo'
import '../../styles/secretaria-achados.css'

export default function Achados() {
  useTitulo('Achados')
  const { achados, solicitacoes, removerAchado } = useDados()
  const avisar = useAviso()
  // O painel pode abrir esta página já filtrada: /secretaria/achados?local=cantina
  const [parametros] = useSearchParams()
  const [filtros, setFiltros] = useState({ busca: '', categoria: '', local: parametros.get('local') ?? '', status: '' })
  const [ordem, setOrdem] = useState('recentes')
  const [paraExcluir, setParaExcluir] = useState(null)

  function mudarFiltro(evento) {
    setFiltros({ ...filtros, [evento.target.name]: evento.target.value })
  }

  const termo = normalizar(filtros.busca)
  const filtrados = achados
    .filter((a) => !filtros.categoria || a.categoria === filtros.categoria)
    .filter((a) => !filtros.local || normalizar(nomeDoLocal(a.local)) === filtros.local)
    .filter((a) => !filtros.status || a.status === filtros.status)
    .filter((a) => !termo || normalizar(`${a.descricao} ${a.numero} ${formatarNumero(a.numero)}`).includes(termo))
  const lista = ordenarAchados(filtrados, ordem)

  const temFiltro = Object.values(filtros).some(Boolean)

  // Achado com pedido aprovado tem um aluno esperando para retirar: o modal avisa.
  const aprovadoDoExcluido = paraExcluir
    ? solicitacoes.find((s) => s.achadoId === paraExcluir.id && s.status === STATUS_SOLICITACAO.APROVADA)
    : null

  function confirmarExclusao() {
    if (removerAchado(paraExcluir.id)) avisar(`${formatarNumero(paraExcluir.numero)} excluído.`)
    setParaExcluir(null)
  }

  return (
    <>
      <header className="pagina-cabecalho pagina-cabecalho-com-acao">
        <div>
          <h1>Achados</h1>
          <p>Tudo o que chegou na secretaria.</p>
        </div>
        <Link className="botao botao-primario" to="/secretaria/novo">
          <Icone nome="mais" />
          Cadastrar achado
        </Link>
      </header>

      <search className="filtros">
        <div className="campo campo-busca">
          <label className="visualmente-oculto" htmlFor="busca">Buscar achado</label>
          <Icone nome="busca" />
          <input
            id="busca" name="busca" type="search"
            placeholder="Buscar pela descrição ou pelo número"
            value={filtros.busca} onChange={mudarFiltro}
          />
        </div>
        <div className="campo">
          <label className="visualmente-oculto" htmlFor="filtro-categoria">Categoria</label>
          <select id="filtro-categoria" name="categoria" value={filtros.categoria} onChange={mudarFiltro}>
            <option value="">Todas as categorias</option>
            {CATEGORIAS.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </select>
        </div>
        <div className="campo">
          <label className="visualmente-oculto" htmlFor="filtro-local">Local</label>
          <select id="filtro-local" name="local" value={filtros.local} onChange={mudarFiltro}>
            <option value="">Todos os locais</option>
            {locaisUsados(achados).map((nome) => <option key={nome} value={normalizar(nome)}>{nome}</option>)}
          </select>
        </div>
        <div className="campo">
          <label className="visualmente-oculto" htmlFor="filtro-status">Status</label>
          <select id="filtro-status" name="status" value={filtros.status} onChange={mudarFiltro}>
            <option value="">Todos os status</option>
            {Object.entries(NOMES_STATUS).map(([valor, nome]) => (
              <option key={valor} value={valor}>{nome}</option>
            ))}
          </select>
        </div>
      </search>

      <div className="ordenar ordenar-tabela">
        <label htmlFor="ordem">Ordenar</label>
        <select id="ordem" value={ordem} onChange={(e) => setOrdem(e.target.value)}>
          {ORDENS.map((o) => <option key={o.id} value={o.id}>{o.nome}</option>)}
        </select>
      </div>

      <div className="cartao tabela-rolagem">
        <table className="tabela">
          <caption className="visualmente-oculto">Achados cadastrados</caption>
          <thead>
            <tr>
              <th scope="col">Categoria</th>
              <th scope="col">Descrição</th>
              <th scope="col">Local</th>
              <th scope="col">Encontrado em</th>
              <th scope="col">Status</th>
              <th scope="col"><span className="visualmente-oculto">Ações</span></th>
            </tr>
          </thead>
          <tbody>
            {lista.length === 0 && (
              <tr className="tabela-vazia">
                <td colSpan={6}>Nenhum achado com esses filtros.</td>
              </tr>
            )}
            {lista.map((achado) => (
              <tr key={achado.id}>
                <td>
                  <span className="tabela-categoria">
                    <FotoOuIcone achado={achado} tamanho="pequeno" />
                    {buscarCategoria(achado.categoria)?.nome}
                  </span>
                </td>
                <td>
                  <p className="tabela-descricao">{achado.descricao}</p>
                  <p className="numero-achado tabela-numero">{formatarNumero(achado.numero)}</p>
                </td>
                <td>{nomeDoLocal(achado.local)}</td>
                <td>
                  {formatarData(achado.dataEncontrado)}
                  {/* Devolvido já saiu da secretaria: não conta mais os dias */}
                  {achado.status !== STATUS_ACHADO.DEVOLVIDO && <DiasParado data={achado.dataEncontrado} />}
                </td>
                <td><SeloStatus status={achado.status} /></td>
                <td>
                  <div className="tabela-acoes">
                    <Link className="botao-icone" to={`/secretaria/etiqueta/${achado.id}`}
                          aria-label={`Imprimir etiqueta de ${achado.descricao}`} title="Imprimir etiqueta">
                      <Icone nome="impressora" tamanho={18} />
                    </Link>
                    <Link className="botao-icone" to={`/secretaria/editar/${achado.id}`}
                          aria-label={`Editar ${achado.descricao}`} title="Editar">
                      <Icone nome="lapis" tamanho={18} />
                    </Link>
                    <button className="botao-icone botao-icone-perigo" type="button"
                            onClick={() => setParaExcluir(achado)}
                            aria-label={`Excluir ${achado.descricao}`} title="Excluir">
                      <Icone nome="lixeira" tamanho={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="tabela-rodape">
        Mostrando {lista.length} de {achados.length} achados
        {temFiltro && (
          <>
            {' · '}
            <button className="link botao-link" type="button"
                    onClick={() => setFiltros({ busca: '', categoria: '', local: '', status: '' })}>
              Limpar filtros
            </button>
          </>
        )}
      </p>

      {paraExcluir && (
        <Modal
          titulo="Excluir achado?"
          textoConfirmar="Excluir"
          onConfirmar={confirmarExclusao}
          onFechar={() => setParaExcluir(null)}
        >
          {paraExcluir.descricao} ({formatarNumero(paraExcluir.numero)}) será apagado, junto com as
          solicitações dele. Não dá para desfazer.
          {aprovadoDoExcluido && (
            <strong className="modal-alerta">
              {' '}O pedido de {aprovadoDoExcluido.alunoNome} já foi aprovado e o aluno ainda não retirou.
            </strong>
          )}
        </Modal>
      )}
    </>
  )
}
