import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge } from '../../components/Badge'
import { DiasParado } from '../../components/DiasParado'
import { EstadoVazio } from '../../components/EstadoVazio'
import { Icone } from '../../components/Icone'
import { IconeCategoria } from '../../components/IconeCategoria'
import { useDados } from '../../context/useDados'
import { CATEGORIAS, buscarCategoria } from '../../data/categorias'
import { nomeDoLocal, sugestoesDeLocal } from '../../data/locais'
import { STATUS_ACHADO } from '../../services/storage'
import { formatarData, formatarNumero, hojeISO, normalizar } from '../../utils/formatar'
import { ORDENS, ordenarAchados } from '../../utils/ordenar'
import { ordenarParecidos } from '../../utils/parecidos'
import { useTitulo } from '../../hooks/useTitulo'
import '../../styles/aluno-achados.css'

const PERDIDO_VAZIO = { categoria: '', local: '', data: '' }

// Selo do "Perdeu algo?": quanto mais pontos, mais parecido.
function SeloParecido({ pontos }) {
  if (pontos >= 5) return <span className="parecido parecido-muito">Muito parecido</span>
  if (pontos >= 3) return <span className="parecido">Parecido</span>
  return <span className="parecido parecido-talvez">Talvez</span>
}

// Um cartão de achado em forma de etiqueta.
// "pontos" só existe quando o aluno usou o "Perdeu algo?".
function CartaoAchado({ achado, pontos }) {
  return (
    <Link className="achado-card" to={`/achados/${achado.id}`} data-categoria={achado.categoria}>
      {/* Faixa colorida da categoria, com o furo da etiqueta */}
      <span className="achado-card-faixa">
        <IconeCategoria categoria={achado.categoria} tamanho="pequeno" />
        {buscarCategoria(achado.categoria)?.nome}
        <span className="achado-card-furo" aria-hidden="true" />
      </span>
      <span className="achado-card-corpo">
        {pontos !== undefined && <SeloParecido pontos={pontos} />}
        <span className="achado-card-cabeca">
          <span>
            <span className="achado-card-numero">{formatarNumero(achado.numero)}</span>
            <span className="achado-card-titulo">{achado.descricao}</span>
          </span>
          {achado.foto && <img className="foto-achado foto-medio" src={achado.foto} alt="" />}
        </span>
        <span className="achado-card-meta">
          <span><Icone nome="local" tamanho={16} /> {nomeDoLocal(achado.local)}</span>
          <span><Icone nome="calendario" tamanho={16} /> {formatarData(achado.dataEncontrado)}</span>
        </span>
        <span className="achado-card-rodape">
          <Badge status={achado.status} />
          <DiasParado data={achado.dataEncontrado} />
        </span>
      </span>
    </Link>
  )
}

export default function BuscarAchados() {
  useTitulo('Achados')
  const { achados } = useDados()
  const [busca, setBusca] = useState('')
  const [categoria, setCategoria] = useState('')
  const [ordem, setOrdem] = useState('recentes')

  // "perdido" é o que está nos campos; "procurando" só muda ao clicar no botão.
  const [perdido, setPerdido] = useState(PERDIDO_VAZIO)
  const [procurando, setProcurando] = useState(null)

  // O aluno não vê o que já foi devolvido.
  const termo = normalizar(busca)
  const filtrados = achados
    .filter((a) => a.status !== STATUS_ACHADO.DEVOLVIDO)
    .filter((a) => !categoria || a.categoria === categoria)
    .filter((a) => {
      if (!termo) return true
      const texto = normalizar(`${a.descricao} ${nomeDoLocal(a.local)} ${a.numero}`)
      return texto.includes(termo)
    })
  const visiveis = ordenarAchados(filtrados, ordem)

  // Com o "Perdeu algo?" ativo, a lista vira os parecidos, do mais para o menos.
  const lista = procurando
    ? ordenarParecidos(visiveis, procurando)
    : visiveis.map((achado) => ({ achado }))

  // Tem algum filtro ligado? Muda a mensagem quando a lista fica vazia.
  const temFiltro = Boolean(termo || categoria || procurando)

  const preencheuAlgo = perdido.categoria || perdido.local.trim() || perdido.data

  function mudarPerdido(evento) {
    setPerdido({ ...perdido, [evento.target.name]: evento.target.value })
  }

  function procurarParecidos(evento) {
    evento.preventDefault()
    if (preencheuAlgo) setProcurando(perdido)
  }

  function verTodos() {
    setProcurando(null)
    setPerdido(PERDIDO_VAZIO)
  }

  function limparFiltros() {
    setBusca('')
    setCategoria('')
    verTodos()
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

      <section className="perdi" aria-labelledby="titulo-perdi">
        <div className="perdi-texto">
          <h2 id="titulo-perdi">Perdeu algo?</h2>
          <p>Conte o que era, onde e quando. Os achados mais parecidos aparecem primeiro.</p>
        </div>

        <form className="perdi-form" onSubmit={procurarParecidos}>
          <div className="campo">
            <label htmlFor="perdi-categoria">O que era</label>
            <select id="perdi-categoria" name="categoria" value={perdido.categoria} onChange={mudarPerdido}>
              <option value="">Qualquer coisa</option>
              {CATEGORIAS.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          </div>
          <div className="campo">
            <label htmlFor="perdi-local">Onde</label>
            <input id="perdi-local" name="local" list="perdi-sugestoes" autoComplete="off"
                   placeholder="Ex.: Cantina" value={perdido.local} onChange={mudarPerdido} />
            <datalist id="perdi-sugestoes">
              {sugestoesDeLocal(achados).map((nome) => <option key={nome} value={nome} />)}
            </datalist>
          </div>
          <div className="campo">
            <label htmlFor="perdi-data">Quando</label>
            <input id="perdi-data" name="data" type="date" max={hojeISO()}
                   value={perdido.data} onChange={mudarPerdido} />
          </div>
          <button className="botao botao-primario" type="submit" disabled={!preencheuAlgo}>
            <Icone nome="busca" />
            Mostrar parecidos
          </button>
        </form>
      </section>

      <form className="busca-aluno" role="search" onSubmit={(e) => e.preventDefault()}>
        <div className="campo campo-busca">
          <label className="visualmente-oculto" htmlFor="busca">Buscar achado</label>
          <Icone nome="busca" />
          <input
            id="busca"
            type="search"
            placeholder="Buscar pela descrição, ex.: garrafa azul"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        <fieldset className="chips">
          <legend className="visualmente-oculto">Categoria</legend>
          {[{ id: '', nome: 'Todas' }, ...CATEGORIAS].map((c) => (
            <label key={c.id || 'todas'} className="chip" data-categoria={c.id || undefined}>
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
      </form>

      <div className="resultado-barra">
        <p className="resultado-contagem" aria-live="polite">{contagem}</p>
        {procurando ? (
          <button className="link botao-link" type="button" onClick={verTodos}>
            Ver todos os achados
          </button>
        ) : (
          // Com os parecidos, a ordem é pelos pontos; por isso só aparece na lista normal.
          <div className="ordenar">
            <label htmlFor="ordem">Ordenar</label>
            <select id="ordem" value={ordem} onChange={(e) => setOrdem(e.target.value)}>
              {ORDENS.map((o) => <option key={o.id} value={o.id}>{o.nome}</option>)}
            </select>
          </div>
        )}
      </div>

      {lista.length === 0 && !temFiltro && (
        <EstadoVazio
          icone="check_circulo"
          titulo="Nenhum achado por aqui"
          texto="Que bom que ninguém perdeu nada! Se você perdeu, volte amanhã: objetos novos chegam todo dia."
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
