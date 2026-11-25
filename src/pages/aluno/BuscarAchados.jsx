import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Badge } from '../../components/Badge'
import { EstadoVazio } from '../../components/EstadoVazio'
import { Icone } from '../../components/Icone'
import { IconeCategoria } from '../../components/IconeCategoria'
import { useDados } from '../../context/useDados'
import { CATEGORIAS, buscarCategoria } from '../../data/categorias'
import { buscarLocal } from '../../data/locais'
import { STATUS_ACHADO } from '../../services/storage'
import { formatarData, formatarNumero, normalizar } from '../../utils/formatar'
import '../../styles/aluno-achados.css'

export default function BuscarAchados() {
  const { achados } = useDados()
  const [busca, setBusca] = useState('')
  const [categoria, setCategoria] = useState('')

  // O aluno não vê o que já foi devolvido.
  const termo = normalizar(busca)
  const visiveis = achados
    .filter((a) => a.status !== STATUS_ACHADO.DEVOLVIDO)
    .filter((a) => !categoria || a.categoria === categoria)
    .filter((a) => {
      if (!termo) return true
      const texto = normalizar(`${a.descricao} ${buscarLocal(a.local)?.nome} ${a.numero}`)
      return texto.includes(termo)
    })
    .sort((a, b) => b.criadoEm.localeCompare(a.criadoEm))

  function limparFiltros() {
    setBusca('')
    setCategoria('')
  }

  return (
    <>
      <header className="pagina-cabecalho">
        <h1>Achados</h1>
        <p>Perdeu algo? Veja se já chegou na secretaria.</p>
      </header>

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
      </form>

      <p className="resultado-contagem" aria-live="polite">
        {visiveis.length === 1 ? '1 achado esperando o dono' : `${visiveis.length} achados esperando o dono`}
      </p>

      {visiveis.length === 0 ? (
        <EstadoVazio
          titulo="Nenhum achado encontrado"
          texto="Tente outra palavra ou outra categoria. Objetos novos chegam todo dia."
        >
          <button className="botao botao-secundario" type="button" onClick={limparFiltros}>
            Limpar busca
          </button>
        </EstadoVazio>
      ) : (
        <ul className="achados-grade">
          {visiveis.map((achado) => (
            <li key={achado.id}>
              <Link className="cartao achado-card" to={`/achados/${achado.id}`}>
                <span className="achado-card-topo">
                  <IconeCategoria categoria={achado.categoria} />
                  <Badge status={achado.status} />
                </span>
                <span className="achado-card-categoria">
                  {buscarCategoria(achado.categoria)?.nome} ·{' '}
                  <span className="numero-achado">{formatarNumero(achado.numero)}</span>
                </span>
                <span className="achado-card-titulo">{achado.descricao}</span>
                <span className="achado-card-meta">
                  <span><Icone nome="local" tamanho={16} /> {buscarLocal(achado.local)?.nome}</span>
                  <span><Icone nome="calendario" tamanho={16} /> {formatarData(achado.dataEncontrado)}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
