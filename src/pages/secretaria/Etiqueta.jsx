import { Link, useParams, useSearchParams } from 'react-router-dom'
import { EstadoVazio } from '../../components/EstadoVazio'
import { Icone } from '../../components/Icone'
import { useDados } from '../../context/useDados'
import { buscarCategoria } from '../../data/categorias'
import { nomeDoLocal } from '../../data/locais'
import { formatarData, formatarNumero } from '../../utils/formatar'
import { useTitulo } from '../../hooks/useTitulo'

// Etiqueta para imprimir e colar no objeto. Aparece logo depois do cadastro
// e também pelo botão de impressora na lista de achados.
export default function Etiqueta() {
  useTitulo('Etiqueta')
  const { id } = useParams()
  const [parametros] = useSearchParams()
  const { buscarAchado } = useDados()
  const achado = buscarAchado(id)
  const acabouDeCadastrar = parametros.get('novo') === '1'

  if (!achado) {
    return (
      <EstadoVazio icone="pacote" titulo="Achado não encontrado" texto="Ele pode ter sido excluído.">
        <Link className="botao botao-primario" to="/secretaria/achados">Ver achados</Link>
      </EstadoVazio>
    )
  }

  return (
    <>
      <Link className="link link-voltar" to="/secretaria/achados">
        <Icone nome="voltar" tamanho={16} />
        Voltar para achados
      </Link>

      <header className="pagina-cabecalho">
        <h1>Etiqueta do achado</h1>
        <p>Imprima, recorte na linha tracejada e prenda no objeto.</p>
      </header>

      <div className="etiqueta-pagina">
        {acabouDeCadastrar && (
          <div className="alerta alerta-info etiqueta-sucesso" role="status">
            <Icone nome="check_circulo" />
            <span>
              <strong>Achado cadastrado.</strong> Ele já aparece para os alunos como{' '}
              {formatarNumero(achado.numero)}.
            </span>
          </div>
        )}

        <div className="etiqueta-impressao">
          <div className="etiqueta-impressao-topo">
            <img src="/img/logo-horizontal.svg" alt="Voltaqui" width="91" height="32" />
            <span className="badge badge-devolvido">Achados e perdidos</span>
          </div>
          <p className="etiqueta-impressao-numero">{formatarNumero(achado.numero)}</p>
          <p className="etiqueta-impressao-objeto">{achado.descricao}</p>
          <dl>
            <dt>Categoria</dt>
            <dd>{buscarCategoria(achado.categoria)?.nome}</dd>
            <dt>Encontrado</dt>
            <dd>{nomeDoLocal(achado.local)}, {formatarData(achado.dataEncontrado)}</dd>
          </dl>
          <p className="etiqueta-impressao-rodape">
            É seu? Entre no Voltaqui e peça a devolução. Se é seu, merece voltar.
          </p>
        </div>

        <div className="etiqueta-acoes">
          <button className="botao botao-primario" type="button" onClick={() => window.print()}>
            <Icone nome="impressora" />
            Imprimir etiqueta
          </button>
          {acabouDeCadastrar ? (
            <Link className="botao botao-secundario" to="/secretaria/novo">Cadastrar outro</Link>
          ) : (
            <Link className="botao botao-secundario" to={`/secretaria/editar/${achado.id}`}>Editar achado</Link>
          )}
        </div>
      </div>
    </>
  )
}
