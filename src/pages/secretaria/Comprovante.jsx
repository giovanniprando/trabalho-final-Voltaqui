import { Link, useParams } from 'react-router'
import { EstadoVazio } from '../../components/EstadoVazio'
import { Icone } from '../../components/Icone'
import { Logo } from '../../components/Logo'
import { useDados } from '../../context/useDados'
import { buscarCategoria } from '../../data/categorias'
import { USUARIOS } from '../../data/usuarios'
import { useTitulo } from '../../hooks/useTitulo'
import { listarContas, STATUS_ACHADO } from '../../services/storage'
import { formatarNumero } from '../../utils/formatar'
import { formatarData, formatarHora, protocoloDevolucao } from '../../utils/datas'

// Comprovante de devolução: aparece depois de "Marcar como devolvido".
// A secretaria imprime ou salva em PDF pelo próprio navegador (Ctrl + P).
export default function Comprovante() {
  useTitulo('Comprovante de devolução')
  const { id } = useParams()
  const { solicitacoes, buscarAchado } = useDados()

  const solicitacao = solicitacoes.find((s) => s.id === id)
  const achado = solicitacao ? buscarAchado(solicitacao.achadoId) : null

  if (!achado || achado.status !== STATUS_ACHADO.DEVOLVIDO) {
    return (
      <EstadoVazio icone="prancheta" titulo="Comprovante não encontrado"
                   texto="Ele só existe depois que o achado é marcado como devolvido.">
        <Link className="botao botao-primario" to="/secretaria/solicitacoes">Ver solicitações</Link>
      </EstadoVazio>
    )
  }

  // Achados devolvidos antes desta versão não têm devolvidoEm.
  const entregueEm = achado.devolvidoEm ?? achado.atualizadoEm
  const aluno = [...USUARIOS, ...listarContas()].find((c) => c.id === solicitacao.alunoId)

  return (
    <>
      <Link className="link link-voltar" to="/secretaria/solicitacoes">
        <Icone nome="voltar" tamanho={16} />
        Voltar para solicitações
      </Link>

      <header className="pagina-cabecalho">
        <h1>Comprovante de devolução</h1>
        <p>Imprima ou salve em PDF para guardar o registro da entrega.</p>
      </header>

      <article className="comprovante">
        <header className="comprovante-topo">
          <Logo alt="voltAqui" />
          <div className="comprovante-protocolo">
            <span>Protocolo</span>
            <strong>{protocoloDevolucao(achado.numero, entregueEm)}</strong>
          </div>
        </header>

        <div className="comprovante-selo">
          <Icone nome="check_circulo" tamanho={28} />
          <div>
            <p className="comprovante-selo-titulo">Devolvido ao dono</p>
            <p>Entregue em {formatarData(entregueEm)}, às {formatarHora(entregueEm)}.</p>
          </div>
        </div>

        <dl className="comprovante-dados">
          <div>
            <dt>Objeto</dt>
            <dd>{achado.descricao}</dd>
          </div>
          <div>
            <dt>Número do achado</dt>
            <dd>{formatarNumero(achado.numero)}</dd>
          </div>
          <div>
            <dt>Categoria</dt>
            <dd>{buscarCategoria(achado.categoria)?.nome}</dd>
          </div>
          <div>
            <dt>Encontrado em</dt>
            <dd>{formatarData(achado.dataEncontrado)}</dd>
          </div>
          <div>
            <dt>Entregue para</dt>
            <dd>{solicitacao.alunoNome}</dd>
          </div>
          <div>
            <dt>Matrícula</dt>
            <dd>{aluno?.matricula || 'Não informada'}</dd>
          </div>
        </dl>

        <div className="comprovante-assinaturas">
          <p>Assinatura da secretaria</p>
          <p>Assinatura do aluno</p>
        </div>

        <p className="comprovante-rodape">Se é seu, merece voltar.</p>
      </article>

      <div className="comprovante-acoes">
        <button className="botao botao-primario" type="button" onClick={() => window.print()}>
          <Icone nome="impressora" />
          Imprimir ou salvar PDF
        </button>
        <Link className="botao botao-secundario" to="/secretaria/solicitacoes">Concluir</Link>
      </div>
    </>
  )
}
