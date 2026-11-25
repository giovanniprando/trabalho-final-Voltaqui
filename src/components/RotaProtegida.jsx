import { Navigate } from 'react-router'
import { useAuth } from '../context/useAuth'
import { PERFIS, paginaInicial } from '../data/usuarios'

// Sem login: vai para o login certo.
// Logado com outro perfil: volta para a página inicial dele.
export function RotaProtegida({ perfil, children }) {
  const { usuario } = useAuth()

  if (!usuario) {
    const login = perfil === PERFIS.SECRETARIA ? '/login/secretaria' : '/login'
    return <Navigate to={login} replace />
  }
  if (perfil && usuario.perfil !== perfil) return <Navigate to={paginaInicial(usuario)} replace />

  return children
}
