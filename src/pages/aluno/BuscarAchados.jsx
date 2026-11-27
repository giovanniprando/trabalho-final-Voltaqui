import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { SeloStatus } from '../../components/SeloStatus'
import { EstadoVazio } from '../../components/EstadoVazio'
import { Icone } from '../../components/Icone'
import { useDados } from '../../context/useDados'
import { CATEGORIAS, buscarCategoria } from '../../data/categorias'
import { nomeDoLocal, sugestoesDeLocal } from '../../data/locais'
import { STATUS_ACHADO } from '../../services/storage'
import { formatarNumero, normalizar } from '../../utils/formatar'
import { formatarData, hojeISO, tempoRelativo } from '../../utils/datas'
import { ORDENS, ordenarAchados } from '../../utils/ordenar'
import { ordenarParecidos } from '../../utils/parecidos'
import { useTitulo } from '../../hooks/useTitulo'
import '../../styles/aluno-achados.css'

const ESPERA_DIGITACAO = 250

function textoParecido(pontos) {
  if (pontos >= 5) return 'Muito parecido'
  if (pontos >= 3) return 'Parecido'
  return 'Talvez'
}

function CartaoAchado({ achado, pontos }) {
  const categoria = buscarCategoria(achado.categoria)
  return (
    <Link className="achado-card" to={`/achados/${achado.id}`}>
      <span className="achado-card-imagem">
        {achado.foto
          ? <img src={achado.foto} alt="" />
          : <Icone nome={categoria?.icone ?? 'pacote'} tamanho={40} />}
      </span>

      <span className="achado-card-corpo">
        <span className="achado-card-topo">
          <span className="achado-card-categoria">
            <Icone nome={categoria?.icone ?? 'pacote'} tamanho={14} />
            {categoria?.nome}
          </span>
          <span className="achado-card-numero">{formatarNumero(achado.numero)}</span>
        </span>

        {pontos !== undefined && <span className="achado-card-parecido">{textoParecido(pontos)}</span>}
        <span className="achado-card-titulo">{achado.descricao}</span>

        <span className="achado-card-meta">
          <span><Icone nome="local" tamanho={16} />{nomeDoLocal(achado.local)}</span>
          <span>
            <Icone nome="calendario" tamanho={16} />
            {formatarData(achado.dataEncontrado)} ({tempoRelativo(achado.dataEncontrado)})
          </span>
        </span>

        <span className="achado-card-rodape">
          <SeloStatus status={achado.status} paraAluno />
        </span>
      </span>
    </Link>
  )
}

export default function BuscarAchados() {
  useTitulo('Achados')
  const { achados } = useDados()
  const [categoria, setCategoria] = useState('')
  const [ordem, setOrdem] = useState('recentes')
  const [filtrosAbertos, setFiltrosAbertos] = useState(false)

  const [campos, setCampos] = useState({ busca: '', onde: '', quando: '' })
  const [aplicado, setAplicado] = useState(campos)

  useEffect(() => {
    const espera = setTimeout(() => setAplicado(campos), ESPERA_DIGITACAO)
    return () => clearTimeout(espera)
  }, [campos])

  function mudarCampo(evento) {
    setCampos({ ...campos, [evento.target.name]: evento.target.value })
  }

  function aplicarAgora(evento) {
    evento.preventDefault()
    setAplicado(campos)
  }

  const termo = normalizar(aplicado.busca)
  const filtrados = achados
    .filter((a) => a.status !== STATUS_ACHADO.DEVOLVIDO)
    .filter((a) => !categoria || a.categoria === categoria)
    .filter((a) => {
      if (!termo) return true
      const texto = normalizar(`${a.descricao} ${nomeDoLocal(a.local)} ${a.numero}`)
      return texto.includes(termo)
    })
  const visiveis = ordenarAchados(filtrados, ordem)

  const procurando = aplicado.onde.trim() || aplicado.quando
    ? { categoria, local: aplicado.onde, data: aplicado.quando }
    : null
  const lista = procurando
    ? ordenarParecidos(visiveis, procurando)
    : visiveis.map((achado) => ({ achado }))

  const filtrosAtivos = (campos.onde.trim() ? 1 : 0) + (campos.quando ? 1 : 0)
  const temFiltro = Boolean(termo || categoria || procurando)

  function limparFiltros() {
    const vazio = { busca: '', onde: '', quando: '' }
    setCampos(vazio)
    setAplicado(vazio)
    setCategoria('')
  }

  let contagem = lista.length === 1 ? '1 achado esperando o dono' : `${lista.length} achados esperando o dono`
  if (procurando) {
    contagem = lista.length === 1
      ? '1 achado parecido com o que você perdeu'
      : `${lista.length} achados parecidos com o que você perdeu`
  }

  return (
    <>
      <header className="pagina-cabecalho">
        <h1>Achados</h1>
        <p>Tudo o que chegou na secretaria e ainda espera o dono.</p>
      </header>

      <search className="busca-aluno">
        <form className="busca-linha" onSubmit={aplicarAgora}>
          <div className="campo campo-busca">
            <label className="visualmente-oculto" htmlFor="busca">Buscar achado</label>
            <Icone nome="busca" />
            <input
              id="busca"
              name="busca"
              type="search"
              placeholder="Descreva o que perdeu, ex.: garrafa azul"
              value={campos.busca}
              onChange={mudarCampo}
            />
          </div>
          <button
            className="botao botao-secundario botao-filtros"
            type="button"
            aria-expanded={filtrosAbertos}
            aria-controls="filtros-painel"
            onClick={() => setFiltrosAbertos(!filtrosAbertos)}
          >
            <Icone nome="filtro" tamanho={18} />
            Filtros
            {filtrosAtivos > 0 && (
              <span className="botao-filtros-contador">
                {filtrosAtivos}
                <span className="visualmente-oculto"> ativos</span>
              </span>
            )}
          </button>

          <div id="filtros-painel" className="filtros-painel" hidden={!filtrosAbertos}>
            <div className="campo">
              <label htmlFor="filtro-onde">Onde</label>
              <input id="filtro-onde" name="onde" list="filtro-sugestoes" autoComplete="off"
                     placeholder="Ex.: Cantina" value={campos.onde} onChange={mudarCampo} />
              <datalist id="filtro-sugestoes">
                {sugestoesDeLocal(achados).map((nome) => <option key={nome} value={nome}>{nome}</option>)}
              </datalist>
            </div>
            <div className="campo">
              <label htmlFor="filtro-quando">Quando</label>
              <input id="filtro-quando" name="quando" type="date" max={hojeISO()}
                     value={campos.quando} onChange={mudarCampo} />
            </div>
          </div>
        </form>

        <fieldset className="chips">
          <legend className="visualmente-oculto">Categoria</legend>
          {[{ id: '', nome: 'Todas' }, ...CATEGORIAS].map((c) => (
            <label key={c.id || 'todas'} className="chip">
              <input
                type="radio"
                name="categoria"
                value={c.id}
                checked={categoria === c.id}
                onChange={() => setCategoria(c.id)}
              />
              {c.nome}
            </label>
          ))}
        </fieldset>
      </search>

      <div className="resultado-barra">
        <p className="resultado-contagem" aria-live="polite">{contagem}</p>
        {procurando ? (
          <button className="link botao-link" type="button" onClick={limparFiltros}>
            Limpar filtros
          </button>
        ) : (
          <div className="ordenar">
            <label htmlFor="ordem">Ordenar</label>
            <span className="select">
              <select id="ordem" value={ordem} onChange={(e) => setOrdem(e.target.value)}>
                {ORDENS.map((o) => <option key={o.id} value={o.id}>{o.nome}</option>)}
              </select>
              <Icone nome="seta_baixo" tamanho={16} />
            </span>
          </div>
        )}
      </div>

      {lista.length === 0 && !temFiltro && (
        <EstadoVazio
          icone="check_circulo"
          titulo="Nenhum achado por aqui"
          texto="A secretaria ainda não cadastrou nenhum objeto. Objetos novos chegam todo dia."
        />
      )}

      {lista.length === 0 && temFiltro && (
        <EstadoVazio
          titulo={procurando ? 'Nada parecido por enquanto' : 'Nenhum achado com essa busca'}
          texto={
            procurando
              ? 'Ainda não chegou nada parecido com o que você perdeu. Volte amanhã ou passe na secretaria.'
              : 'Tente outra palavra ou outra categoria. Objetos novos chegam todo dia.'
          }
        >
          <button className="botao botao-secundario" type="button" onClick={limparFiltros}>
            Limpar busca
          </button>
        </EstadoVazio>
      )}

      {lista.length > 0 && (
        <ul className="achados-grade">
          {lista.map(({ achado, pontos }) => (
            <li key={achado.id}>
              <CartaoAchado achado={achado} pontos={pontos} />
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
