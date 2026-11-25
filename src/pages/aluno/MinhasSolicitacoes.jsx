import { Link } from 'react-router-dom'
import { Badge } from '../../components/Badge'
import { EstadoVazio } from '../../components/EstadoVazio'
import { Icone } from '../../components/Icone'
import { IconeCategoria } from '../../components/IconeCategoria'
import { useAuth } from '../../context/useAuth'
import { useDados } from '../../context/useDados'
import { STATUS_ACHADO } from '../../services/storage'
import { formatarData, formatarNumero } from '../../utils/formatar'
import '../../styles/aluno-minhas-solicitacoes.css'

// A mensagem muda conforme a resposta da secretaria.
function mensagem(solicitacao, achado) {
  if (solicitacao.status === 'pendente') {
    return { icone: 'relogio', classe: '', texto: 'Esperando a secretaria analisar.' }
  }
  if (solicitacao.status === 'recusada') {
    return {
      icone: 'x',
      classe: 'mensagem-recusada',
      texto: 'Os detalhes não conferiram. Se ele for seu mesmo, fale com a secretaria.',
    }
  }
  if (achado.status === STATUS_ACHADO.DEVOLVIDO) {
    return {
      icone: 'check_circulo',
      classe: 'mensagem-aprovada',
      texto: `Retirado em ${formatarData(achado.atualizadoEm)}. Que bom que voltou!`,
    }
  }
  return {
    icone: 'check_circulo',
    classe: 'mensagem-aprovada',
    texto: 'Pode retirar! Vá à secretaria, de segunda a sexta, das 8h às 17h, com a carteirinha.',
  }
}

export default function MinhasSolicitacoes() {
  const { usuario } = useAuth()
  const { solicitacoes, buscarAchado } = useDados()

  const minhas = solicitacoes
    .filter((s) => s.alunoId === usuario.id)
    .map((s) => ({ ...s, achado: buscarAchado(s.achadoId) }))
    .filter((s) => s.achado)
    .sort((a, b) => b.criadaEm.localeCompare(a.criadaEm))

  return (
    <>
      <header className="pagina-cabecalho">
        <h1>Minhas solicitações</h1>
        <p>Acompanhe a resposta da secretaria para cada pedido.</p>
      </header>

      {minhas.length === 0 ? (
        <EstadoVazio
          icone="prancheta"
          titulo="Você ainda não fez nenhuma solicitação"
          texto="Quando achar algo seu na lista, peça a devolução por lá."
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
                  </div>
                  <Badge status={s.status} />
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
