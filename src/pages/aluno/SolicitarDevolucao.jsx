import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { Campo } from '../../components/Campo'
import { Icone } from '../../components/Icone'
import { IconeCategoria } from '../../components/IconeCategoria'
import { useAuth } from '../../context/useAuth'
import { useAviso } from '../../context/useAviso'
import { useDados } from '../../context/useDados'
import { buscarLocal } from '../../data/locais'
import { STATUS_ACHADO, STATUS_SOLICITACAO } from '../../services/storage'
import { formatarData, formatarNumero } from '../../utils/formatar'
import { ligarCampo } from '../../utils/campo'
import { temErros, validarSolicitacao } from '../../utils/validacao'
import '../../styles/aluno-solicitar-devolucao.css'

const MAXIMO = 300

export default function SolicitarDevolucao() {
  const { id } = useParams()
  const { usuario } = useAuth()
  const { buscarAchado, solicitacoes, solicitarDevolucao } = useDados()
  const avisar = useAviso()
  const [descricaoDono, setDescricaoDono] = useState('')
  const [erros, setErros] = useState({})

  const [enviado, setEnviado] = useState(false)

  const achado = buscarAchado(id)
  const jaPediu = solicitacoes.some(
    (s) => s.achadoId === id && s.alunoId === usuario.id && s.status !== STATUS_SOLICITACAO.RECUSADA,
  )

  // Depois de enviar, vai para Minhas solicitações.
  if (enviado) return <Navigate to="/minhas-solicitacoes" replace />

  // Achado inexistente, devolvido ou já pedido: volta para o detalhe.
  if (!achado || achado.status === STATUS_ACHADO.DEVOLVIDO || jaPediu) {
    return <Navigate to={`/achados/${id}`} replace />
  }

  function aoEnviar(evento) {
    evento.preventDefault()
    const novosErros = validarSolicitacao({ descricaoDono })
    setErros(novosErros)
    if (temErros(novosErros)) {
      document.getElementById('descricaoDono').focus()
      return
    }

    solicitarDevolucao({
      achadoId: achado.id,
      alunoId: usuario.id,
      alunoNome: usuario.nome,
      descricaoDono: descricaoDono.trim(),
    })
    avisar('Solicitação enviada. A secretaria vai analisar.')
    setEnviado(true)
  }

  return (
    <>
      <Link className="link link-voltar" to={`/achados/${achado.id}`}>
        <Icone nome="voltar" tamanho={16} />
        Voltar para o achado
      </Link>

      <header className="pagina-cabecalho">
        <h1>Solicitar devolução</h1>
        <p>Conte um detalhe para a secretaria saber que o objeto é seu.</p>
      </header>

      <div className="solicitar">
        <div className="cartao resumo-achado">
          <IconeCategoria categoria={achado.categoria} />
          <div>
            <p className="resumo-titulo">{achado.descricao}</p>
            <p className="resumo-meta">
              {buscarLocal(achado.local)?.nome} · {formatarData(achado.dataEncontrado)} ·{' '}
              <span className="numero-achado">{formatarNumero(achado.numero)}</span>
            </p>
          </div>
        </div>

        <form className="cartao formulario-solicitar" onSubmit={aoEnviar} noValidate>
          <Campo
            id="descricaoDono"
            rotulo="Descreva um detalhe que só o dono saberia"
            erro={erros.descricaoDono}
            ajuda={`Pense em cor de um adesivo, um nome escrito, um arranhão ou o que estava dentro. ${descricaoDono.length}/${MAXIMO}`}
          >
            <textarea
              {...ligarCampo('descricaoDono', erros.descricaoDono, true)}
              maxLength={MAXIMO}
              placeholder="Ex.: tem um chaveiro de caveira no zíper e meu nome escrito na etiqueta"
              value={descricaoDono}
              onChange={(e) => setDescricaoDono(e.target.value)}
            />
          </Campo>

          <div className="alerta alerta-info">
            <Icone nome="info" />
            <span>
              A secretaria analisa os pedidos em até 1 dia útil. Você acompanha a resposta em{' '}
              <strong>Minhas solicitações</strong>.
            </span>
          </div>

          <div className="solicitar-acoes">
            <Link className="botao botao-secundario" to={`/achados/${achado.id}`}>Cancelar</Link>
            <button className="botao botao-primario" type="submit">
              <Icone nome="enviar" />
              Enviar solicitação
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
