import { Link } from 'react-router'
import { useAuth } from '../context/useAuth'
import { paginaInicial } from '../data/usuarios'
import { BotaoTema } from '../components/BotaoTema'
import { Logo } from '../components/Logo'
import { useTitulo } from '../hooks/useTitulo'

export default function NaoEncontrada() {
  useTitulo('Página não encontrada')
  const { usuario } = useAuth()

  const destino = usuario ? paginaInicial(usuario) : '/'

  return (
    <main className="nao-encontrada">
      <div className="pagina-solta-topo">
        <Link className="nao-encontrada-logo" to="/">
          <Logo alt="voltAqui, início" />
        </Link>
        <BotaoTema />
      </div>

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
