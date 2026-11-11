import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { PERFIS } from '../data/usuarios'

export function Header() {
  const { usuario, sair } = useAuth()
  const navigate = useNavigate()

  if (!usuario) return null

  function handleSair() {
    sair()
    navigate('/')
  }

  return (
    <header className="header">
      <Link to="/achados" className="header-logo">
        Voltaqui
      </Link>

      <nav className="header-nav">
        <Link to="/achados">Achados</Link>
        {usuario.perfil === PERFIS.SECRETARIA && (
          <>
            <Link to="/secretaria">Painel</Link>
            <Link to="/secretaria/novo">Cadastrar achado</Link>
          </>
        )}
      </nav>

      <div className="header-usuario">
        <span>{usuario.nome}</span>
        <button type="button" onClick={handleSair}>
          Sair
        </button>
      </div>
    </header>
  )
}
