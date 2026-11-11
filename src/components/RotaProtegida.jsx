import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

// Sem login: volta para a tela de login.
// Com "perfil" definido: só esse perfil entra; os outros vão para /achados.
export function RotaProtegida({ perfil, children }) {
  const { usuario } = useAuth()

  if (!usuario) return <Navigate to="/" replace />
  if (perfil && usuario.perfil !== perfil) return <Navigate to="/achados" replace />

  return children
}
