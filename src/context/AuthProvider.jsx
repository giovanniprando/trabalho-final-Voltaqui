import { useState } from 'react'
import { PERFIS, USUARIOS } from '../data/usuarios'
import { criarConta, lerSessao, limparSessao, listarContas, salvarSessao } from '../services/storage'
import { AuthContext } from './AuthContext'

function todasAsContas() {
  return [...USUARIOS, ...listarContas()]
}

// A senha nunca vai para a sessão.
function semSenha(conta) {
  const { senha: _senha, ...dados } = conta
  return dados
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => lerSessao())

  function iniciarSessao(conta) {
    const dados = semSenha(conta)
    salvarSessao(dados)
    setUsuario(dados)
  }

  // Devolve { ok: true } ou { ok: false, motivo: 'credenciais' | 'perfil' }.
  function entrar(email, senha, perfilEsperado) {
    const conta = todasAsContas().find(
      (c) => c.email === email.trim().toLowerCase() && c.senha === senha,
    )
    if (!conta) return { ok: false, motivo: 'credenciais' }
    if (perfilEsperado && conta.perfil !== perfilEsperado) return { ok: false, motivo: 'perfil' }

    iniciarSessao(conta)
    return { ok: true, usuario: semSenha(conta) }
  }

  function emailJaExiste(email) {
    const limpo = email.trim().toLowerCase()
    return todasAsContas().some((c) => c.email === limpo)
  }

  // Só aluno cria conta pelo site. A conta da secretaria é criada pela escola.
  function cadastrar(dados) {
    const conta = criarConta({
      nome: dados.nome.trim(),
      email: dados.email.trim().toLowerCase(),
      senha: dados.senha,
      perfil: PERFIS.ALUNO,
      escola: dados.codigoEscola.trim().toUpperCase(),
      matricula: dados.matricula.trim(),
      curso: dados.curso.trim(),
    })
    iniciarSessao(conta)
    return semSenha(conta)
  }

  function sair() {
    limparSessao()
    setUsuario(null)
  }

  return (
    <AuthContext.Provider value={{ usuario, entrar, cadastrar, emailJaExiste, sair }}>
      {children}
    </AuthContext.Provider>
  )
}
