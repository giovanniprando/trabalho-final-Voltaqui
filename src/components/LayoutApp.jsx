import { Suspense } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router'
import { useAuth } from '../context/useAuth'
import { useDados } from '../context/useDados'
import { PERFIS, paginaInicial } from '../data/usuarios'
import { STATUS_SOLICITACAO } from '../services/storage'
import { iniciais } from '../utils/formatar'
import { Icone } from './Icone'
import { Notificacoes } from './Notificacoes'
import { TrocaDemonstracao } from './TrocaDemonstracao'
import '../styles/layout.css'

const MENUS = {
  [PERFIS.SECRETARIA]: [
    { para: '/secretaria', icone: 'painel', texto: 'Painel', exato: true },
    { para: '/secretaria/achados', icone: 'pacote', texto: 'Achados' },
    { para: '/secretaria/novo', icone: 'mais_circulo', texto: 'Cadastrar achado' },
    { para: '/secretaria/solicitacoes', icone: 'caixa_entrada', texto: 'Solicitações', contador: true },
  ],
  [PERFIS.ALUNO]: [
    { para: '/achados', icone: 'busca', texto: 'Buscar achados' },
    { para: '/minhas-solicitacoes', icone: 'prancheta', texto: 'Minhas solicitações' },
  ],
}

// Barra lateral + área de conteúdo das páginas internas.
// <Outlet /> é onde o React Router desenha a página da rota atual.
export function LayoutApp() {
  const { usuario, sair } = useAuth()
  const { solicitacoes } = useDados()
  const navigate = useNavigate()

  const ehSecretaria = usuario.perfil === PERFIS.SECRETARIA
  const pendentes = solicitacoes.filter((s) => s.status === STATUS_SOLICITACAO.PENDENTE).length

  function aoSair() {
    sair()
    navigate(ehSecretaria ? '/login/secretaria' : '/login')
  }

  return (
    <div className="app">
      <a className="pular-link" href="#conteudo">Pular para o conteúdo</a>

      <aside className="lateral">
        <div className="lateral-topo">
          <Link className="lateral-logo" to={paginaInicial(usuario)}>
            <img src="/img/logo-horizontal-escura.svg" alt="Voltaqui, início" width="114" height="40" />
          </Link>
          {/* O sino só existe para o aluno: é ele quem espera a resposta */}
          {!ehSecretaria && <Notificacoes usuario={usuario} />}
        </div>

        <nav aria-label={ehSecretaria ? 'Menu da secretaria' : 'Menu do aluno'}>
          <ul className="lateral-menu">
            {MENUS[usuario.perfil].map((item) => (
              <li key={item.para}>
                <NavLink to={item.para} end={item.exato}>
                  <Icone nome={item.icone} />
                  {item.texto}
                  {item.contador && pendentes > 0 && (
                    <span className="lateral-contador" aria-label={`${pendentes} pendentes`}>
                      {pendentes}
                    </span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lateral-rodape">
          <div className="lateral-usuario">
            <span className="avatar" aria-hidden="true">{iniciais(usuario.nome)}</span>
            <span>
              <strong>{usuario.nome}</strong>
              <small>{ehSecretaria ? 'Secretaria' : 'Aluno'} · SENAI</small>
            </span>
          </div>

          <button className="lateral-sair" type="button" onClick={aoSair}>
            <Icone nome="sair" />
            Sair
          </button>
        </div>
      </aside>

      <TrocaDemonstracao />

      <main id="conteudo" className="app-conteudo">
        <div className="app-pagina">
          {/* A barra lateral fica na tela enquanto a página carrega. */}
          <Suspense fallback={<output className="carregando">Carregando...</output>}>
            <Outlet />
          </Suspense>
        </div>
      </main>
    </div>
  )
}
