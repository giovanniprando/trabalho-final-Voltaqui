import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { PERFIS } from '../data/usuarios'

export default function Login() {
  const { usuario, entrar } = useAuth()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')

  if (usuario) {
    const destino = usuario.perfil === PERFIS.SECRETARIA ? '/secretaria' : '/achados'
    return <Navigate to={destino} replace />
  }

  function handleSubmit(evento) {
    evento.preventDefault()
    if (!entrar(email, senha)) {
      setErro('E-mail ou senha incorretos.')
    }
  }

  return (
    <form className="login" onSubmit={handleSubmit}>
      <h1>Voltaqui</h1>
      <p>Se é seu, merece voltar.</p>

      <label htmlFor="email">E-mail</label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <label htmlFor="senha">Senha</label>
      <input
        id="senha"
        type="password"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        required
      />

      {erro && <p className="erro">{erro}</p>}

      <button type="submit">Entrar</button>

      <div className="acesso-rapido">
        <p>Acesso rápido (provisório)</p>
        <button type="button" onClick={() => entrar('secretaria@senai.br', '123456')}>
          Entrar como secretaria
        </button>
        <button type="button" onClick={() => entrar('ana@aluno.senai.br', '123456')}>
          Entrar como aluno
        </button>
      </div>
    </form>
  )
}
