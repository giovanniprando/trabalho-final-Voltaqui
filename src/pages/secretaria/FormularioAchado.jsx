import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Campo } from '../../components/Campo'
import { EstadoVazio } from '../../components/EstadoVazio'
import { Icone } from '../../components/Icone'
import { useAviso } from '../../context/useAviso'
import { useDados } from '../../context/useDados'
import { CATEGORIAS } from '../../data/categorias'
import { nomeDoLocal, padronizarLocal, sugestoesDeLocal } from '../../data/locais'
import { formatarNumero, hojeISO } from '../../utils/formatar'
import { ligarCampo } from '../../utils/campo'
import { reduzirImagem } from '../../utils/imagem'
import { temErros, validarAchado } from '../../utils/validacao'
import { useTitulo } from '../../hooks/useTitulo'
import '../../styles/secretaria-cadastrar-achado.css'

const VAZIO = { categoria: '', local: '', dataEncontrado: hojeISO(), descricao: '', detalheOculto: '', foto: '' }

// A mesma tela serve para cadastrar (/secretaria/novo)
// e para editar (/secretaria/editar/:id).
// A "key" faz o React começar o formulário do zero quando o id muda.
export default function FormularioAchado() {
  const { id } = useParams()
  useTitulo(id ? 'Editar achado' : 'Cadastrar achado')
  return <Formulario key={id ?? 'novo'} id={id} />
}

function Formulario({ id }) {
  const { achados, buscarAchado, cadastrarAchado, editarAchado } = useDados()
  const avisar = useAviso()
  const navigate = useNavigate()

  const editando = Boolean(id)
  const original = editando ? buscarAchado(id) : null

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
    evento.target.value = '' // deixa escolher a mesma foto de novo, se precisar
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

    // Se o armazenamento do navegador estiver cheio, o salvar falha.
    try {
      salvar(limpos)
    } catch {
      setErros({ foto: 'Não coube no armazenamento do navegador. Tente salvar sem a foto.' })
    }
  }

  function salvar(limpos) {
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

        <Campo id="local" rotulo="Local onde foi encontrado" erro={erros.local}
               ajuda="Escreva o lugar do jeito que a escola chama. Ex.: Bloco B, Quadra coberta.">
          <input {...ligarCampo('local', erros.local, true)} name="local" list="sugestoes-local"
                 maxLength={60} autoComplete="off" placeholder="Ex.: Cantina"
                 value={dados.local} onChange={aoMudar} />
          {/* datalist: o navegador mostra estas sugestões enquanto a pessoa digita */}
          <datalist id="sugestoes-local">
            {sugestoesDeLocal(achados).map((nome) => <option key={nome} value={nome} />)}
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
              {/* O input fica escondido; o label acima funciona como botão */}
              <input id="foto" className="visualmente-oculto" type="file" accept="image/*" onChange={aoEscolherFoto} />
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
