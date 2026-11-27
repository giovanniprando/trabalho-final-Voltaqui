import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router'
import { Campo } from '../components/Campo'
import { BotaoTema } from '../components/BotaoTema'
import { InputSenha } from '../components/InputSenha'
import { PainelMarca } from '../components/PainelMarca'
import { useAuth } from '../context/useAuth'
import { useAviso } from '../context/useAviso'
import { paginaInicial } from '../data/usuarios'
import { ligarCampo } from '../utils/campo'
import { temErros, validarConta } from '../utils/validacao'
import { useTitulo } from '../hooks/useTitulo'
import '../styles/autenticacao.css'
import '../styles/criar-conta.css'

const VAZIO = {
  codigoEscola: '', matricula: '', curso: '', nome: '',
  email: '', senha: '', confirmarSenha: '', aceite: false,
}

const ETIQUETA = {
  numero: '0151', objeto: 'Garrafa térmica verde com adesivos',
  local: 'Encontrada no pátio, em 21/10', status: 'Em análise', classe: 'selo-analise',
}

export default function CriarConta() {
  useTitulo('Criar conta')
  const { usuario, cadastrar, emailJaExiste } = useAuth()
  const avisar = useAviso()
  const navigate = useNavigate()
  const [dados, setDados] = useState(VAZIO)
  const [erros, setErros] = useState({})

  if (usuario) return <Navigate to={paginaInicial(usuario)} replace />

  function aoMudar(evento) {
    const { name, value, type, checked } = evento.target
    setDados({ ...dados, [name]: type === 'checkbox' ? checked : value })
  }

  function aoEnviar(evento) {
    evento.preventDefault()
    const novosErros = validarConta(dados, emailJaExiste(dados.email))
    setErros(novosErros)

    if (temErros(novosErros)) {
      const primeiro = Object.keys(novosErros)[0]
      document.querySelector(`[name="${primeiro}"]`)?.focus()
      return
    }

    let conta
    try {
      conta = cadastrar(dados)
    } catch {
      avisar('Não deu para criar a conta: o armazenamento do navegador está cheio.', 'erro')
      return
    }
    avisar(`Conta criada. Olá, ${conta.nome.split(' ')[0]}.`)
    navigate(paginaInicial(conta))
  }

  return (
    <div className="autenticacao">
      <PainelMarca
        etiqueta={ETIQUETA}
        descricao="Crie sua conta para acompanhar os achados da sua escola e pedir a devolução do que é seu."
      />

      <main className="autenticacao-conteudo">
        <form className="formulario formulario-largo" onSubmit={aoEnviar} noValidate>
          <div className="formulario-topo">
            <Link className="link formulario-voltar" to="/">← Voltar ao início</Link>
            <BotaoTema />
          </div>

          <header className="formulario-cabecalho">
            <h1>Criar conta</h1>
            <p>Para alunos. Tenha em mãos o código da sua escola.</p>
          </header>

          <fieldset className="grupo">
            <legend>Sua escola</legend>

            <div className="linha-campos">
              <Campo id="codigoEscola" rotulo="Código da escola" erro={erros.codigoEscola}
                     ajuda="Peça o código à secretaria da escola.">
                <input
                  {...ligarCampo('codigoEscola', erros.codigoEscola, true)}
                  name="codigoEscola" type="text" maxLength={6}
                  autoCapitalize="characters" spellCheck="false" autoComplete="off"
                  placeholder="SN7K2P" value={dados.codigoEscola} onChange={aoMudar}
                />
              </Campo>

              <Campo id="matricula" rotulo="Matrícula" erro={erros.matricula}
                     ajuda="O número da sua carteirinha.">
                <input
                  {...ligarCampo('matricula', erros.matricula, true)}
                  name="matricula" type="text" inputMode="numeric" autoComplete="off"
                  value={dados.matricula} onChange={aoMudar}
                />
              </Campo>
            </div>

            <Campo id="curso" rotulo={<>Curso <small>(opcional)</small></>}>
              <input
                id="curso" name="curso" type="text"
                placeholder="Ex.: Desenvolvimento de Sistemas"
                value={dados.curso} onChange={aoMudar}
              />
            </Campo>
          </fieldset>

          <fieldset className="grupo">
            <legend>Seus dados</legend>

            <Campo id="nome" rotulo="Nome completo" erro={erros.nome}>
              <input
                {...ligarCampo('nome', erros.nome)}
                name="nome" type="text" autoComplete="name"
                value={dados.nome} onChange={aoMudar}
              />
            </Campo>

            <Campo id="email" rotulo="E-mail" erro={erros.email}>
              <input
                {...ligarCampo('email', erros.email)}
                name="email" type="email" autoComplete="email" placeholder="nome@escola.com.br"
                value={dados.email} onChange={aoMudar}
              />
            </Campo>

            <div className="linha-campos">
              <Campo id="senha" rotulo="Senha" erro={erros.senha} ajuda="Mínimo de 6 caracteres.">
                <InputSenha
                  {...ligarCampo('senha', erros.senha, true)}
                  name="senha" autoComplete="new-password"
                  value={dados.senha} onChange={aoMudar}
                />
              </Campo>

              <Campo id="confirmarSenha" rotulo="Confirmar senha" erro={erros.confirmarSenha}>
                <InputSenha
                  {...ligarCampo('confirmarSenha', erros.confirmarSenha)}
                  name="confirmarSenha" autoComplete="new-password"
                  value={dados.confirmarSenha} onChange={aoMudar}
                />
              </Campo>
            </div>
          </fieldset>

          <div className="aceite">
            <label className="caixa-selecao">
              <input
                name="aceite" type="checkbox" checked={dados.aceite} onChange={aoMudar}
                aria-invalid={erros.aceite ? true : undefined}
                aria-describedby={erros.aceite ? 'aceite-erro' : undefined}
              />
              <span>
                Li e aceito os <Link className="link" to="/termos" target="_blank">termos de uso</Link>{' '}
                e a <Link className="link" to="/termos#privacidade" target="_blank">política de privacidade</Link>.
              </span>
            </label>
            {erros.aceite && <p className="campo-erro" id="aceite-erro">{erros.aceite}</p>}
          </div>

          <button className="botao botao-primario botao-bloco" type="submit">Criar conta</button>

          <p className="formulario-rodape">
            Já tem conta? <Link className="link" to="/login">Entrar</Link>
          </p>

          <p className="aviso-secretaria">
            É da secretaria? Sua conta é criada pela escola.
            Fale com o responsável pelo voltAqui na sua instituição.
          </p>
        </form>
      </main>
    </div>
  )
}
