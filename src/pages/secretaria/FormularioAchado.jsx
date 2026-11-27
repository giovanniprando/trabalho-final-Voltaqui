import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { Campo } from '../../components/Campo'
import { EstadoVazio } from '../../components/EstadoVazio'
import { Icone } from '../../components/Icone'
import { useAviso } from '../../context/useAviso'
import { useDados } from '../../context/useDados'
import { CATEGORIAS } from '../../data/categorias'
import { STATUS_ACHADO, STATUS_SOLICITACAO } from '../../services/storage'
import { nomeDoLocal, padronizarLocal, sugestoesDeLocal } from '../../data/locais'
import { formatarNumero } from '../../utils/formatar'
import { hojeISO } from '../../utils/datas'
import { ligarCampo } from '../../utils/campo'
import { reduzirImagem } from '../../utils/imagem'
import { temErros, validarAchado } from '../../utils/validacao'
import { useTitulo } from '../../hooks/useTitulo'
import '../../styles/secretaria-cadastrar-achado.css'

const VAZIO = { categoria: '', local: '', descricao: '', detalheOculto: '', foto: '' }

export default function FormularioAchado() {
  const { id } = useParams()
  useTitulo(id ? 'Editar achado' : 'Cadastrar achado')
  return <Formulario key={id ?? 'novo'} id={id} />
}

function Formulario({ id }) {
  const { achados, solicitacoes, buscarAchado, cadastrarAchado, editarAchado } = useDados()
  const avisar = useAviso()
  const navigate = useNavigate()

  const editando = Boolean(id)
  const original = editando ? buscarAchado(id) : null
  const aprovado = editando
    ? solicitacoes.find((s) => s.achadoId === id && s.status === STATUS_SOLICITACAO.APROVADA)
    : null

  const [dados, setDados] = useState(() =>
    original
      ? {
          categoria: original.categoria,
          local: nomeDoLocal(original.local),
          dataEncontrado: original.dataEncontrado,
          descricao: original.descricao,
          detalheOculto: original.detalheOculto,
          foto: original.foto ?? '',
        }
      : { ...VAZIO, dataEncontrado: hojeISO() },
  )
  const [erros, setErros] = useState({})

  if (editando && !original) {
    return (
      <EstadoVazio icone="pacote" titulo="Achado não encontrado" texto="Ele pode ter sido excluído.">
        <Link className="botao botao-primario" to="/secretaria/achados">Ver achados</Link>
      </EstadoVazio>
    )
  }

  async function aoEscolherFoto(evento) {
    const arquivo = evento.target.files[0]
    evento.target.value = ''
    if (!arquivo) return
    try {
      const foto = await reduzirImagem(arquivo)
      setDados((atual) => ({ ...atual, foto }))
      setErros((atual) => ({ ...atual, foto: undefined }))
    } catch (erro) {
      setErros((atual) => ({ ...atual, foto: erro.message }))
    }
  }

  function aoMudar(evento) {
    setDados({ ...dados, [evento.target.name]: evento.target.value })
  }

  function aoEnviar(evento) {
    evento.preventDefault()
    const novosErros = validarAchado(dados)
    setErros(novosErros)

    if (temErros(novosErros)) {
      const primeiro = Object.keys(novosErros)[0]
      document.querySelector(`[name="${primeiro}"]`)?.focus()
      return
    }

    const limpos = {
      ...dados,
      local: padronizarLocal(dados.local, achados),
      descricao: dados.descricao.trim(),
      detalheOculto: dados.detalheOculto.trim(),
    }

    if (editando) {
      if (!editarAchado(id, limpos)) return
      avisar(`Alterações de ${formatarNumero(original.numero)} salvas.`)
      navigate('/secretaria/achados')
    } else {
      const novo = cadastrarAchado(limpos)
      if (novo) navigate(`/secretaria/etiqueta/${novo.id}?novo=1`)
    }
  }

  return (
    <>
      <Link className="link link-voltar" to="/secretaria/achados">
        <Icone nome="voltar" tamanho={16} />
        Voltar para achados
      </Link>

      <header className="pagina-cabecalho">
        <h1>{editando ? 'Editar achado' : 'Cadastrar achado'}</h1>
        <p>
          {editando
            ? `Atualize os dados do ${formatarNumero(original.numero)}.`
            : 'Registre o objeto assim que ele chegar na secretaria.'}
        </p>
      </header>

      {aprovado && original.status !== STATUS_ACHADO.DEVOLVIDO && (
        <div className="alerta alerta-info formulario-aviso">
          <Icone nome="info" />
          <span>
            O pedido de {aprovado.alunoNome} já foi aprovado e o aluno ainda vai retirar. Se mudar a
            descrição, confira o objeto na hora da entrega.
          </span>
        </div>
      )}

      <form className="cartao formulario-achado" onSubmit={aoEnviar} noValidate>
        <div className="formulario-grade">
          <Campo id="categoria" rotulo="Categoria" erro={erros.categoria}>
            <select {...ligarCampo('categoria', erros.categoria)} name="categoria"
                    value={dados.categoria} onChange={aoMudar}>
              <option value="">Selecione</option>
              {CATEGORIAS.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          </Campo>

          <Campo id="dataEncontrado" rotulo="Encontrado em" erro={erros.dataEncontrado}>
            <input {...ligarCampo('dataEncontrado', erros.dataEncontrado)} name="dataEncontrado"
                   type="date" max={hojeISO()} value={dados.dataEncontrado} onChange={aoMudar} />
          </Campo>
        </div>

        <Campo id="local" rotulo="Local onde foi encontrado" erro={erros.local}
               ajuda="Escreva o lugar do jeito que a escola chama. Ex.: Bloco B, Quadra coberta.">
          <input {...ligarCampo('local', erros.local, true)} name="local" list="sugestoes-local"
                 maxLength={60} autoComplete="off" placeholder="Ex.: Cantina"
                 value={dados.local} onChange={aoMudar} />
          <datalist id="sugestoes-local">
            {sugestoesDeLocal(achados).map((nome) => <option key={nome} value={nome}>{nome}</option>)}
          </datalist>
        </Campo>

        <Campo id="descricao" rotulo="Descrição pública" erro={erros.descricao}
               limite={120} valor={dados.descricao}
               ajuda="Todo mundo vê este texto. Diga o que é, a cor e a marca, sem entregar detalhes únicos.">
          <textarea {...ligarCampo('descricao', erros.descricao, true)} name="descricao" maxLength={120}
                    placeholder="Ex.: Garrafa térmica azul, 500 ml" value={dados.descricao} onChange={aoMudar} />
        </Campo>

        <Campo
          id="detalheOculto"
          className="campo-oculto"
          rotulo={<><Icone nome="cadeado" tamanho={16} /> Detalhe oculto</>}
          erro={erros.detalheOculto}
          limite={160}
          valor={dados.detalheOculto}
          ajuda="Só a secretaria vê. Na hora da devolução, o aluno precisa descrever este detalhe para provar que é o dono."
        >
          <textarea {...ligarCampo('detalheOculto', erros.detalheOculto, true)} name="detalheOculto" maxLength={160}
                    placeholder="Ex.: adesivo de banda na base" value={dados.detalheOculto} onChange={aoMudar} />
        </Campo>

        <div className="campo campo-foto">
          <span className="campo-foto-rotulo">Foto (opcional)</span>
          <div className="campo-foto-linha">
            {dados.foto ? (
              <img className="foto-achado foto-grande" src={dados.foto} alt="Prévia da foto do achado" />
            ) : (
              <span className="campo-foto-vazio" aria-hidden="true"><Icone nome="camera" tamanho={28} /></span>
            )}
            <div className="campo-foto-acoes">
              <label className="botao botao-secundario" htmlFor="foto">
                <Icone nome="camera" />
                {dados.foto ? 'Trocar foto' : 'Escolher foto'}
              </label>
              <input id="foto" className="visualmente-oculto" type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={aoEscolherFoto} />
              {dados.foto && (
                <button className="link botao-link" type="button" onClick={() => setDados({ ...dados, foto: '' })}>
                  Remover foto
                </button>
              )}
              <p className="campo-ajuda">Fotografe o objeto inteiro, sem mostrar o detalhe oculto.</p>
              {erros.foto && <p className="campo-erro campo-erro-visivel" role="alert">{erros.foto}</p>}
            </div>
          </div>
        </div>

        <div className="formulario-acoes">
          <Link className="botao botao-secundario" to="/secretaria/achados">Cancelar</Link>
          <button className="botao botao-primario" type="submit">
            <Icone nome="salvar" />
            {editando ? 'Salvar alterações' : 'Salvar achado'}
          </button>
        </div>
      </form>
    </>
  )
}
