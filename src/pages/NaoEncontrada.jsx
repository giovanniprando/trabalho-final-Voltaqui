import { Link } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { paginaInicial } from '../data/usuarios'
import { useTitulo } from '../hooks/useTitulo'

// Aparece quando o endereço digitado não existe (rota "*" no App.jsx).
export default function NaoEncontrada() {
  useTitulo('Página não encontrada')
  const { usuario } = useAuth()

  // Quem está logado volta para a própria página inicial; quem não está, para a homepage.
  const destino = usuario ? paginaInicial(usuario) : '/'

  return (
    <main className="nao-encontrada">
      <Link className="nao-encontrada-logo" to="/">
        <img src="/img/logo-horizontal.svg" alt="Voltaqui, início" width="114" height="40" />
      </Link>

      {/* Uma etiqueta de achado, igual às da secretaria, com o número 404 */}
      <div className="nao-encontrada-etiqueta" aria-hidden="true">
        <span className="nao-encontrada-furo" />
        <span className="nao-encontrada-rotulo">Achado</span>
        <span className="nao-encontrada-numero">Nº 0404</span>
        <span className="nao-encontrada-local">Local: desconhecido</span>
      </div>

      <h1>Esta página se perdeu</h1>
      <p>O endereço não existe ou mudou. Nem a secretaria encontrou ela por aqui.</p>
      <Link className="botao botao-primario" to={destino}>
        {usuario ? 'Voltar para o início' : 'Ir para a página inicial'}
      </Link>
    </main>
  )
}
