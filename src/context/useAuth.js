import { useContext } from 'react'
import { AuthContext } from './AuthContext'

// Uso: const { usuario, entrar, sair } = useAuth()
export function useAuth() {
  return useContext(AuthContext)
}
