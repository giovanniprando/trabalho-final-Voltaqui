import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Campo } from '../../components/Campo'
import { EstadoVazio } from '../../components/EstadoVazio'
import { Icone } from '../../components/Icone'
import { useAviso } from '../../context/useAviso'
import { useDados } from '../../context/useDados'
import { CATEGORIAS } from '../../data/categorias'
import { LOCAIS } from '../../data/locais'
import { formatarNumero, hojeISO } from '../../utils/formatar'
import { ligarCampo } from '../../utils/campo'
import { temErros, validarAchado } from '../../utils/validacao'
import '../../styles/secretaria-cadastrar-achado.css'

const VAZIO = { categoria: '', local: '', dataEncontrado: hojeISO(), descricao: '', detalheOculto: '' }

// A mesma tela serve para cadastrar (/secretaria/novo)
// e para editar (/secretaria/editar/:id).
// A "key" faz o React começar o formulário do zero quando o id muda.
export default function FormularioAchado() {
  const { id } = useParams()
  return <Formulario key={id ?? 'novo'} id={id} />
}

function Formulario({ id }) {
  const { buscarAchado, cadastrarAchado, editarAchado } = useDados()
  const avisar = useAviso()
  const navigate = useNavigate()

  const editando = Boolean(id)
  const original = editando ? buscarAchado(id) : null

  const [dados, setDados] = useState(() =>
    original
      ? {
          categoria: original.categoria,
          local: original.local,
          dataEncontrado: original.dataEncontrado,
          descricao: original.descricao,
          detalheOculto: original.detalheOculto,
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

    const limpos = { ...dados, descricao: dados.descricao.trim(), detalheOculto: dados.detalheOculto.trim() }

    if (editando) {
      editarAchado(id, limpos)
      avisar(`Alterações de ${formatarNumero(original.numero)} salvas.`)
      navigate('/secretaria/achados')
    } else {
      const novo = cadastrarAchado(limpos)
      navigate(`/secretaria/etiqueta/${novo.id}?novo=1`)
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

        <Campo id="local" rotulo="Local onde foi encontrado" erro={erros.local}>
          <select {...ligarCampo('local', erros.local)} name="local" value={dados.local} onChange={aoMudar}>
            <option value="">Selecione</option>
            {LOCAIS.map((l) => <option key={l.id} value={l.id}>{l.nome}</option>)}
          </select>
        </Campo>

        <Campo id="descricao" rotulo="Descrição pública" erro={erros.descricao}
               ajuda="Todo mundo vê este texto. Diga o que é, a cor e a marca, sem entregar detalhes únicos.">
          <textarea {...ligarCampo('descricao', erros.descricao, true)} name="descricao" maxLength={120}
                    placeholder="Ex.: Garrafa térmica azul, 500 ml" value={dados.descricao} onChange={aoMudar} />
        </Campo>

        <Campo
          id="detalheOculto"
          className="campo-oculto"
          rotulo={<><Icone nome="cadeado" tamanho={16} /> Detalhe oculto</>}
          erro={erros.detalheOculto}
          ajuda="Só a secretaria vê. Na hora da devolução, o aluno precisa descrever este detalhe para provar que é o dono."
        >
          <textarea {...ligarCampo('detalheOculto', erros.detalheOculto, true)} name="detalheOculto" maxLength={160}
                    placeholder="Ex.: adesivo de banda na base" value={dados.detalheOculto} onChange={aoMudar} />
        </Campo>

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
