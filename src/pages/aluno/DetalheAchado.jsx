import { Link, useParams } from 'react-router'
import { SeloStatus } from '../../components/SeloStatus'
import { EstadoVazio } from '../../components/EstadoVazio'
import { Icone } from '../../components/Icone'
import { useAuth } from '../../context/useAuth'
import { useDados } from '../../context/useDados'
import { buscarCategoria } from '../../data/categorias'
import { nomeDoLocal } from '../../data/locais'
import { motivoParaNaoPedir, STATUS_ACHADO } from '../../services/storage'
import { formatarNumero } from '../../utils/formatar'
import { formatarData } from '../../utils/datas'
import { useTitulo } from '../../hooks/useTitulo'
import '../../styles/aluno-detalhe-achado.css'

export default function DetalheAchado() {
  useTitulo('Detalhe do achado')
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

  // Pode pedir? As regras ficam em services/storage.js (motivoParaNaoPedir).
  const motivo = motivoParaNaoPedir(achado, solicitacoes, usuario.id)
  const meuPedido = solicitacoes.find((s) => s.achadoId === achado.id && s.alunoId === usuario.id)

  return (
    <>
      <Link className="link link-voltar" to="/achados">
        <Icone nome="voltar" tamanho={16} />
        Voltar para achados
      </Link>

      <div className="detalhe">
        <article className="cartao detalhe-achado">
          {/* Igual ao cartão da lista: foto ou o ícone da categoria em cinza */}
          <span className="detalhe-imagem">
            {achado.foto
              ? <img src={achado.foto} alt="" />
              : <Icone nome={buscarCategoria(achado.categoria)?.icone ?? 'pacote'} tamanho={40} />}
          </span>
          <p className="detalhe-categoria">
            {buscarCategoria(achado.categoria)?.nome} ·{' '}
            <span className="numero-achado">{formatarNumero(achado.numero)}</span>
          </p>
          <h1>{achado.descricao}</h1>
          <SeloStatus status={achado.status} paraAluno />

          <dl className="detalhe-dados">
            <div>
              <dt><Icone nome="local" tamanho={16} /> Encontrado em</dt>
              <dd>{nomeDoLocal(achado.local)}</dd>
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

          {motivo === null && (
            <Link className="botao botao-primario botao-bloco" to={`/achados/${achado.id}/solicitar`}>
              Pedir devolução
            </Link>
          )}

          {motivo === 'ja-pediu' && (
            <>
              <div className="alerta alerta-info detalhe-aviso">
                <Icone nome="info" />
                <span>
                  {meuPedido.status === 'recusada'
                    ? 'Seu pedido deste objeto foi recusado. Se ele é seu, fale com a secretaria.'
                    : 'Você já pediu este objeto. A resposta aparece em Minhas solicitações.'}
                </span>
              </div>
              <Link className="botao botao-secundario botao-bloco" to="/minhas-solicitacoes">
                Ver minhas solicitações
              </Link>
            </>
          )}

          {motivo === 'reservado' && (
            <div className="alerta alerta-info detalhe-aviso">
              <Icone nome="info" />
              <span>A secretaria já aprovou o pedido do dono. O objeto está esperando a retirada.</span>
            </div>
          )}
        </aside>
      </div>
    </>
  )
}
