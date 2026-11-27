import { Link } from 'react-router'
import { SeloStatus } from '../../components/SeloStatus'
import { EstadoVazio } from '../../components/EstadoVazio'
import { Icone } from '../../components/Icone'
import { IconeCategoria } from '../../components/IconeCategoria'
import { useAuth } from '../../context/useAuth'
import { useDados } from '../../context/useDados'
import { STATUS_ACHADO } from '../../services/storage'
import { formatarNumero } from '../../utils/formatar'
import { formatarData } from '../../utils/datas'
import { useTitulo } from '../../hooks/useTitulo'
import '../../styles/aluno-minhas-solicitacoes.css'

function mensagem(solicitacao, achado) {
  if (solicitacao.status === 'pendente') {
    return { icone: 'relogio', classe: '', texto: 'A secretaria vai conferir o detalhe que você descreveu. Quando ela responder, o sino avisa.' }
  }
  if (solicitacao.status === 'recusada') {
    return {
      icone: 'x',
      classe: 'mensagem-recusada',
      texto: solicitacao.motivo === 'outro-aprovado'
        ? 'A secretaria confirmou outra pessoa como dona deste objeto. Se ele é seu, fale com a secretaria.'
        : 'Os detalhes não conferiram. Se o objeto é seu, fale com a secretaria.',
    }
  }
  if (achado.status === STATUS_ACHADO.DEVOLVIDO) {
    return {
      icone: 'check_circulo',
      classe: 'mensagem-aprovada',
      texto: `Retirado em ${formatarData(achado.devolvidoEm ?? achado.atualizadoEm)}.`,
    }
  }
  return {
    icone: 'check_circulo',
    classe: 'mensagem-aprovada',
    texto: 'Pode retirar na secretaria, de segunda a sexta, das 8h às 17h. Leve a carteirinha.',
  }
}

export default function MinhasSolicitacoes() {
  useTitulo('Minhas solicitações')
  const { usuario } = useAuth()
  const { solicitacoes, buscarAchado } = useDados()

  const minhas = solicitacoes
    .filter((s) => s.alunoId === usuario.id)
    .map((s) => ({ ...s, achado: buscarAchado(s.achadoId) }))
    .filter((s) => s.achado)
    .toSorted((a, b) => b.criadaEm.localeCompare(a.criadaEm))

  return (
    <>
      <header className="pagina-cabecalho">
        <h1>Minhas solicitações</h1>
        <p>Acompanhe a resposta da secretaria para cada pedido.</p>
      </header>

      {minhas.length === 0 ? (
        <EstadoVazio
          icone="prancheta"
          titulo="Sua mochila sente sua falta?"
          texto="Você ainda não pediu nenhuma devolução. Quando achar algo seu na lista, peça por lá."
        >
          <Link className="botao botao-primario" to="/achados">Buscar achados</Link>
        </EstadoVazio>
      ) : (
        <ul className="minhas">
          {minhas.map((s) => {
            const msg = mensagem(s, s.achado)
            return (
              <li key={s.id} className="cartao minha">
                <div className="minha-topo">
                  <IconeCategoria categoria={s.achado.categoria} />
                  <div className="minha-achado">
                    <h2>{s.achado.descricao}</h2>
                    <p>
                      Pedido em {formatarData(s.criadaEm)} ·{' '}
                      <span className="numero-achado">{formatarNumero(s.achado.numero)}</span>
                    </p>
                    <SeloStatus status={s.status} />
                  </div>
                </div>
                <p className={`mensagem ${msg.classe}`}>
                  <Icone nome={msg.icone} tamanho={16} />
                  {msg.texto}
                </p>
              </li>
            )
          })}
        </ul>
      )}
    </>
  )
}
