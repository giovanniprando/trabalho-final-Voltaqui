import { useState } from 'react'
import { Link, NavLink, Navigate, useNavigate } from 'react-router-dom'
import { Campo } from '../components/Campo'
import { InputSenha } from '../components/InputSenha'
import { Icone } from '../components/Icone'
import { PainelMarca } from '../components/PainelMarca'
import { useAuth } from '../context/useAuth'
import { PERFIS, USUARIOS, paginaInicial } from '../data/usuarios'
import { ligarCampo } from '../utils/campo'
import { temErros, validarLogin } from '../utils/validacao'
import { useTitulo } from '../hooks/useTitulo'
import '../styles/autenticacao.css'

const TEXTOS = {
  [PERFIS.ALUNO]: {
    titulo: 'Entrar',
    subtitulo: 'Use o e-mail e a senha da sua conta.',
    placeholder: 'nome@escola.com.br',
    botao: 'Entrar',
    erroPerfil: 'Esta conta é da secretaria. Use a aba Secretaria para entrar.',
    etiqueta: {
      numero: '0142', objeto: 'Mochila preta com chaveiro de dinossauro',
      local: 'Encontrada no Bloco B, em 14/10', status: 'Devolvido', classe: 'badge-devolvido',
    },
    descricao: 'Os achados e perdidos da sua escola em um só lugar. Procure o que você perdeu e peça a devolução direto pela plataforma.',
  },
  [PERFIS.SECRETARIA]: {
    titulo: 'Área da secretaria',
    subtitulo: 'Use o e-mail e a senha que a escola criou para você.',
    placeholder: 'secretaria@escola.com.br',
    botao: 'Entrar no painel',
    erroPerfil: 'Esta conta é de aluno. Use a aba Aluno para entrar.',
    etiqueta: {
      numero: '0158', objeto: 'Garrafa térmica azul, 500 ml',
      local: 'Encontrada na cantina, em 02/11', status: 'Em análise', classe: 'badge-analise',
    },
    descricao: 'Cadastre o que chega na secretaria, confira quem é o dono e organize as devoluções.',
  },
}

export default function Login({ perfil }) {
  useTitulo(perfil === PERFIS.SECRETARIA ? 'Entrar na secretaria' : 'Entrar')
  const { usuario, entrar } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erros, setErros] = useState({})
  const [erroGeral, setErroGeral] = useState('')

  if (usuario) return <Navigate to={paginaInicial(usuario)} replace />

  const texto = TEXTOS[perfil]
  const contasTeste = USUARIOS.filter((u) => u.perfil === perfil)

  function fazerLogin(emailDigitado, senhaDigitada) {
    const resultado = entrar(emailDigitado, senhaDigitada, perfil)
    if (resultado.ok) {
      navigate(paginaInicial(resultado.usuario))
      return
    }
    setErroGeral(
      resultado.motivo === 'perfil'
        ? texto.erroPerfil
        : 'E-mail ou senha não conferem. Confira os dados e tente de novo.',
    )
  }

  function aoEnviar(evento) {
    evento.preventDefault()
    setErroGeral('')

    const novosErros = validarLogin({ email, senha })
    setErros(novosErros)
    if (temErros(novosErros)) return

    fazerLogin(email, senha)
  }

  return (
    <div className="autenticacao">
      <PainelMarca etiqueta={texto.etiqueta} descricao={texto.descricao} />

      <main className="autenticacao-conteudo">
        <form className="formulario" onSubmit={aoEnviar} noValidate>
          <Link className="link formulario-voltar" to="/">← Voltar ao início</Link>

          <nav className="acesso-abas" aria-label="Tipo de acesso">
            <NavLink className="acesso-aba" to="/login" end>Aluno</NavLink>
            <NavLink className="acesso-aba" to="/login/secretaria">Secretaria</NavLink>
          </nav>

          <header className="formulario-cabecalho">
            <h1>{texto.titulo}</h1>
            <p>{texto.subtitulo}</p>
          </header>

          {erroGeral && (
            <div className="alerta alerta-erro" role="alert">
              <Icone nome="alerta_circulo" />
              <span>{erroGeral}</span>
            </div>
          )}

          <Campo id="email" rotulo="E-mail" erro={erros.email}>
            <input
              {...ligarCampo('email', erros.email)}
              type="email"
              autoComplete="email"
              placeholder={texto.placeholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Campo>

          <Campo id="senha" rotulo="Senha" erro={erros.senha}>
            <InputSenha
              {...ligarCampo('senha', erros.senha)}
              autoComplete="current-password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </Campo>

          <button className="botao botao-primario botao-bloco" type="submit">{texto.botao}</button>

          {perfil === PERFIS.ALUNO ? (
            <p className="formulario-rodape">
              Ainda não tem conta? <Link className="link" to="/criar-conta">Criar conta</Link>
            </p>
          ) : (
            <p className="formulario-rodape">Não tem acesso? Peça à coordenação da sua escola.</p>
          )}

          <details className="contas-teste">
            <summary>Contas de teste (senha 123456)</summary>
            <ul>
              {contasTeste.map((conta) => (
                <li key={conta.id}>
                  <button type="button" onClick={() => fazerLogin(conta.email, conta.senha)}>
                    Entrar como {conta.nome}
                  </button>{' '}
                  · {conta.email}
                </li>
              ))}
            </ul>
          </details>
        </form>
      </main>
    </div>
  )
}
