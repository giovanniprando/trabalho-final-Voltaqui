import { useState } from 'react'
import { USUARIOS } from '../data/usuarios'
import { lerSessao, limparSessao, salvarSessao } from '../services/storage'
import { AuthContext } from './AuthContext'

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => lerSessao())

  // Retorna true se o login deu certo.
  function entrar(email, senha) {
    const encontrado = USUARIOS.find(
      (u) => u.email === email.trim().toLowerCase() && u.senha === senha,
    )
    if (!encontrado) return false

    // A senha não vai para a sessão.
    const { senha: _senha, ...dadosSessao } = encontrado
    salvarSessao(dadosSessao)
    setUsuario(dadosSessao)
    return true
  }

  function sair() {
    limparSessao()
    setUsuario(null)
  }

  return (
    <AuthContext.Provider value={{ usuario, entrar, sair }}>
      {children}
    </AuthContext.Provider>
  )
}
