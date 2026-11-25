import { Link, useParams } from 'react-router-dom'
import { Badge } from '../../components/Badge'
import { EstadoVazio } from '../../components/EstadoVazio'
import { Icone } from '../../components/Icone'
import { IconeCategoria } from '../../components/IconeCategoria'
import { useAuth } from '../../context/useAuth'
import { useDados } from '../../context/useDados'
import { buscarCategoria } from '../../data/categorias'
import { buscarLocal } from '../../data/locais'
import { STATUS_ACHADO, STATUS_SOLICITACAO } from '../../services/storage'
import { formatarData, formatarNumero } from '../../utils/formatar'
import '../../styles/aluno-detalhe-achado.css'

export default function DetalheAchado() {
  const { id } = useParams()
  const { usuario } = useAuth()
  const { buscarAchado, solicitacoes } = useDados()
  const achado = buscarAchado(id)

  if (!achado || achado.status === STATUS_ACHADO.DEVOLVIDO) {
    return (
      <EstadoVazio
        titulo="Achado não encontrado"
        texto="Ele pode ter sido devolvido ou removido da lista."
      >
        <Link className="botao botao-primario" to="/achados">Ver achados</Link>
      </EstadoVazio>
    )
  }

  // O aluno já pediu este achado? Não deixa pedir de novo.
  const meuPedido = solicitacoes.find(
    (s) => s.achadoId === achado.id && s.alunoId === usuario.id && s.status !== STATUS_SOLICITACAO.RECUSADA,
  )

  return (
    <>
      <Link className="link link-voltar" to="/achados">
        <Icone nome="voltar" tamanho={16} />
        Voltar para achados
      </Link>

      <div className="detalhe">
        <article className="cartao detalhe-achado">
          <IconeCategoria categoria={achado.categoria} tamanho="grande" />
          <p className="detalhe-categoria">
            {buscarCategoria(achado.categoria)?.nome} ·{' '}
            <span className="numero-achado">{formatarNumero(achado.numero)}</span>
          </p>
          <h1>{achado.descricao}</h1>
          <Badge status={achado.status} />

          <dl className="detalhe-dados">
            <div>
              <dt><Icone nome="local" tamanho={16} /> Encontrado em</dt>
              <dd>{buscarLocal(achado.local)?.nome}</dd>
            </div>
            <div>
              <dt><Icone nome="calendario" tamanho={16} /> Data</dt>
              <dd>{formatarData(achado.dataEncontrado)}</dd>
            </div>
            <div>
              <dt><Icone nome="loja" tamanho={16} /> Onde está agora</dt>
              <dd>Secretaria da escola</dd>
            </div>
          </dl>

          <p className="detalhe-oculto-aviso">
            <Icone nome="cadeado" tamanho={16} />
            Um detalhe deste objeto fica escondido. Só o dono sabe qual é.
          </p>
        </article>

        <aside className="cartao detalhe-como">
          <h2>Como funciona a devolução</h2>
          <ol className="devolucao-passos">
            <li>
              <strong>Você descreve um detalhe</strong>
              <span>Algo que só o dono saberia: um adesivo, um nome escrito, o que tinha no bolso.</span>
            </li>
            <li>
              <strong>A secretaria confere</strong>
              <span>Ela compara sua descrição com o detalhe oculto que anotou no cadastro.</span>
            </li>
            <li>
              <strong>Você retira na secretaria</strong>
              <span>Se conferir, é só levar a carteirinha e buscar.</span>
            </li>
          </ol>

          {meuPedido ? (
            <>
              <div className="alerta alerta-info detalhe-aviso">
                <Icone nome="info" />
                <span>Você já pediu este objeto. A resposta aparece em Minhas solicitações.</span>
              </div>
              <Link className="botao botao-secundario botao-bloco" to="/minhas-solicitacoes">
                Ver minhas solicitações
              </Link>
            </>
          ) : (
            <Link className="botao botao-primario botao-bloco" to={`/achados/${achado.id}/solicitar`}>
              É meu, quero solicitar
            </Link>
          )}
        </aside>
      </div>
    </>
  )
}
