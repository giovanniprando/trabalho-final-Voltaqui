import { Link } from 'react-router-dom'
import { useTitulo } from '../hooks/useTitulo'
import '../styles/home.css'

export default function Home() {
  useTitulo(null)
  return (
    <>
      <a className="pular-link" href="#conteudo">Pular para o conteúdo</a>

      <header className="cabecalho">
        <div className="container">

          <Link className="cabecalho-logo" to="/">
            <img src="/img/logo-horizontal.svg" alt="Voltaqui" width="114" height="40" />
          </Link>

          <nav className="cabecalho-nav" aria-label="Principal">
            <ul className="cabecalho-links">
              <li><a href="#como-funciona">Como funciona</a></li>
              <li><a href="#seguranca">Segurança</a></li>
              <li><a href="#sobre">Sobre</a></li>
            </ul>
          </nav>

          <div className="cabecalho-acoes">
            <Link className="botao botao-secundario" to="/login">Entrar</Link>
            <Link className="botao botao-primario cabecalho-criar" to="/criar-conta">Criar conta</Link>
          </div>

        </div>
      </header>

      <main id="conteudo">

        <section id="inicio" className="secao hero">
          <div className="container hero-grade">
            <div>
              <p className="hero-etiqueta">Achados e perdidos para escolas</p>
              <h1 className="hero-titulo">Se é seu, <span>merece voltar.</span></h1>
              <p className="hero-texto">O Voltaqui organiza os achados e perdidos da sua escola. A secretaria registra o que foi encontrado, o aluno procura pelo celular e o objeto só é devolvido para quem prova que é o dono.</p>
              <div className="hero-botoes">
                <Link className="botao botao-primario" to="/login">Entrar</Link>
                <a className="botao botao-sobre-marca" href="#como-funciona">Ver como funciona</a>
              </div>
            </div>
            <div className="hero-cartao" aria-hidden="true">
              <p className="hero-cartao-numero">Achado nº 0142</p>
              <p className="hero-cartao-objeto">Mochila preta com chaveiro de dinossauro</p>
              <p className="hero-cartao-local">Encontrada no Bloco B, em 14/10</p>
              <span className="badge badge-devolvido">Devolvido</span>
            </div>
          </div>
        </section>

        <section id="problema" className="secao problema" aria-labelledby="problema-titulo">
          <div className="container">
            <p className="secao-etiqueta">O problema</p>
            <h2 id="problema-titulo" className="secao-titulo">Hoje, o que se perde vai parar numa caixa.</h2>
            <ul className="problema-lista">
              <li className="problema-card">
                <span className="problema-icone"><svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/></svg></span>
                <h3>Sem registro</h3>
                <p>Ninguém sabe o que chegou, quando chegou nem onde foi achado.</p>
              </li>
              <li className="problema-card">
                <span className="problema-icone"><svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg></span>
                <h3>Busca no balcão</h3>
                <p>O aluno precisa ir até a secretaria e revirar a caixa para saber se o objeto está lá.</p>
              </li>
              <li className="problema-card">
                <span className="problema-icone"><svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg></span>
                <h3>Qualquer um leva</h3>
                <p>Sem conferir quem é o dono, o objeto pode ir para a mão errada.</p>
              </li>
            </ul>
          </div>
        </section>

        <section id="como-funciona" className="secao passos" aria-labelledby="como-funciona-titulo">
          <div className="container">
            <p className="secao-etiqueta">Como funciona</p>
            <h2 id="como-funciona-titulo" className="secao-titulo">Três passos até voltar para você.</h2>
            <ol className="passos-lista">
              <li className="passos-item">
                <h3>A secretaria cadastra</h3>
                <p>Registra o objeto com categoria, local, data e um detalhe que só o dono sabe.</p>
              </li>
              <li className="passos-item">
                <h3>O aluno encontra e pede</h3>
                <p>Usa os filtros, acha o que é seu e descreve esse detalhe.</p>
              </li>
              <li className="passos-item">
                <h3>A secretaria confere e devolve</h3>
                <p>Compara as respostas, aprova o pedido e marca como devolvido.</p>
              </li>
            </ol>
          </div>
        </section>

        <section id="para-quem" className="secao perfis" aria-labelledby="para-quem-titulo">
          <div className="container">
            <p className="secao-etiqueta">Para quem</p>
            <h2 id="para-quem-titulo" className="secao-titulo">Feito para os dois lados do balcão.</h2>
            <div className="perfis-grade">
              <article className="perfis-card">
                <div className="perfis-cabecalho">
                  <span className="perfis-icone"><svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg></span>
                  <h3>Secretaria</h3>
                </div>
                <ul className="perfis-lista">
                  <li><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>Cadastra, edita e exclui achados.</li>
                  <li><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>Analisa cada pedido vendo o detalhe ao lado da resposta do aluno.</li>
                  <li><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>Acompanha o status de cada objeto.</li>
                </ul>
              </article>
              <article className="perfis-card">
                <div className="perfis-cabecalho">
                  <span className="perfis-icone"><svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/></svg></span>
                  <h3>Aluno</h3>
                </div>
                <ul className="perfis-lista">
                  <li><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>Cria a conta com o código da escola.</li>
                  <li><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>Busca por categoria, local e status.</li>
                  <li><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>Acompanha os próprios pedidos.</li>
                </ul>
              </article>
            </div>
          </div>
        </section>

        <section id="seguranca" className="secao seguranca" aria-labelledby="seguranca-titulo">
          <div className="container seguranca-grade">
            <div>
              <p className="secao-etiqueta">Segurança</p>
              <h2 id="seguranca-titulo" className="secao-titulo">Só o dono sabe o detalhe.</h2>
              <p className="seguranca-texto">Todo achado tem uma descrição pública e um detalhe oculto, como um adesivo, um nome escrito ou uma marca por dentro. O aluno vê só a descrição pública. Para pedir o objeto, ele descreve o detalhe, e a secretaria confere antes de devolver.</p>
            </div>
            <figure className="seguranca-exemplo">
              <figcaption className="seguranca-legenda">Exemplo de achado</figcaption>
              <div className="seguranca-parte">
                <p className="seguranca-rotulo">Descrição pública</p>
                <p className="seguranca-valor">Garrafa térmica azul, 500&nbsp;ml</p>
                <span className="badge badge-disponivel">Disponível</span>
              </div>
              <div className="seguranca-parte seguranca-oculto">
                <p className="seguranca-rotulo"><svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>Detalhe oculto</p>
                <p className="seguranca-valor">Adesivo de banda na base</p>
                <p className="seguranca-aviso"><svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/></svg>Só a secretaria vê</p>
              </div>
            </figure>
          </div>
        </section>

        <section id="sobre" className="secao sobre" aria-labelledby="sobre-titulo">
          <div className="container sobre-grade">
            <div>
              <p className="secao-etiqueta">Sobre o Voltaqui</p>
              <h2 id="sobre-titulo" className="secao-titulo">Feito para reconectar pessoas aos seus pertences.</h2>
              <p className="sobre-texto">O Voltaqui nasceu no SENAI, onde está sendo usado pela primeira vez, e foi pensado para qualquer instituição de ensino. Cada escola tem um código, e o aluno entra ligado à própria escola.</p>
            </div>
            <ul className="sobre-valores">
              <li className="sobre-valor">
                <span className="sobre-icone"><svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg></span>
                <h3>Confiança</h3>
                <p>O objeto só volta para quem prova que é o dono.</p>
              </li>
              <li className="sobre-valor">
                <span className="sobre-icone"><svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg></span>
                <h3>Proximidade</h3>
                <p>A busca fica no celular do aluno, não só no balcão.</p>
              </li>
              <li className="sobre-valor">
                <span className="sobre-icone"><svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/></svg></span>
                <h3>Organização</h3>
                <p>Todo achado tem registro, local, data e status.</p>
              </li>
              <li className="sobre-valor">
                <span className="sobre-icone"><svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11"/></svg></span>
                <h3>Reconexão</h3>
                <p>O que se perdeu encontra o caminho de volta.</p>
              </li>
            </ul>
          </div>
        </section>

        <section id="comece" className="secao chamada" aria-labelledby="comece-titulo">
          <div className="container">
            <h2 id="comece-titulo" className="secao-titulo">Perdeu alguma coisa na escola?</h2>
            <p className="chamada-texto">Entre e veja se ela já está esperando por você.</p>
            <div className="chamada-botoes">
              <Link className="botao botao-primario" to="/login">Entrar</Link>
              <Link className="botao botao-sobre-marca" to="/criar-conta">Criar conta</Link>
            </div>
          </div>
        </section>

      </main>

      <footer className="rodape">
        <div className="container rodape-conteudo">
          <Link className="rodape-logo" to="/">
            <img src="/img/logo-horizontal.svg" alt="Voltaqui, voltar ao início" width="114" height="40" />
          </Link>
          <p>Projeto final de Desenvolvimento de Sistemas, SENAI, 2026</p>
          <nav aria-label="Rodapé">
            <ul className="rodape-links">
              <li><Link to="/login">Entrar</Link></li>
              <li><Link to="/criar-conta">Criar conta</Link></li>
              <li><Link to="/login/secretaria">Área da secretaria</Link></li>
            </ul>
          </nav>
        </div>
      </footer>
    </>
  )
}
