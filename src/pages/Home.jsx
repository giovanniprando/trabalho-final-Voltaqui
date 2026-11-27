import { MotionConfig, motion, useMotionValueEvent, useScroll, useSpring } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { DemoConferencia } from '../components/home/DemoConferencia'
import { CaixaOrganizada } from '../components/home/CaixaOrganizada'
import { EtiquetaAbertura } from '../components/home/EtiquetaAbertura'
import { ExemploSeguranca } from '../components/home/ExemploSeguranca'
import { FaixaAchados } from '../components/home/FaixaAchados'
import { BotaoTema } from '../components/BotaoTema'
import { Logo } from '../components/Logo'
import { useTitulo } from '../hooks/useTitulo'
import { iniciarEtiquetaFisica } from '../lib/etiquetaFisica'
import '../styles/home.css'

const entrada = {
  oculto: { opacity: 0, y: 24 },
  visivel: (atraso = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: atraso, ease: [0.22, 1, 0.36, 1] },
  }),
}

const grupo = {
  oculto: {},
  visivel: { transition: { staggerChildren: 0.12 } },
}

const aoAparecer = {
  initial: 'oculto',
  whileInView: 'visivel',
  viewport: { once: true, amount: 0.3 },
}

export default function Home() {
  useTitulo(null)

  const heroRef = useRef(null)
  const passosRef = useRef(null)
  const [rolou, setRolou] = useState(false)

  const { scrollY, scrollYProgress } = useScroll()
  const progresso = useSpring(scrollYProgress, { stiffness: 200, damping: 30 })
  useMotionValueEvent(scrollY, 'change', (y) => setRolou(y > 8))

  const { scrollYProgress: avancoPassos } = useScroll({
    target: passosRef,
    offset: ['start 85%', 'end 55%'],
  })

  useEffect(
    () =>
      iniciarEtiquetaFisica(heroRef.current, {
        seletor: '.hero-cartao',
        obstaculos: ['.hero-conteudo'],
        larguraMinima: 769,
        giroInicial: 0.07,
      }),
    [],
  )

  return (
    <MotionConfig reducedMotion="user">
      <a className="pular-link" href="#conteudo">Pular para o conteúdo</a>

      <header className={rolou ? 'cabecalho cabecalho-rolou' : 'cabecalho'}>
        <motion.div className="cabecalho-progresso" style={{ scaleX: progresso }} aria-hidden="true" />
        <div className="container">

          <Link className="cabecalho-logo" to="/">
            <Logo alt="voltAqui" />
          </Link>

          <nav className="cabecalho-nav" aria-label="Principal">
            <ul className="cabecalho-links">
              <li><a href="#como-funciona">Como funciona</a></li>
              <li><a href="#para-quem">Para quem</a></li>
              <li><a href="#seguranca">Segurança</a></li>
            </ul>
          </nav>

          <div className="cabecalho-acoes">
            <BotaoTema />
            <Link className="botao botao-secundario" to="/login">Entrar</Link>
            <Link className="botao botao-primario cabecalho-criar" to="/criar-conta">Criar conta</Link>
          </div>

        </div>
      </header>

      <main id="conteudo">

        <section id="inicio" className="secao hero" ref={heroRef}>
          <div className="container hero-grade">
            <motion.div className="hero-conteudo" variants={grupo} initial="oculto" animate="visivel">
              <h1 className="hero-titulo">
                <motion.span className="hero-linha" variants={entrada}>Se é seu,</motion.span>{' '}
                <motion.span className="hero-linha hero-destaque" variants={entrada}>
                  merece voltar.
                  <svg className="hero-sublinhado" viewBox="0 0 300 16" preserveAspectRatio="none" aria-hidden="true">
                    <motion.path
                      d="M4 11 C 70 3, 150 3, 296 9"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.9, delay: 0.7, ease: 'easeInOut' }}
                    />
                  </svg>
                </motion.span>
              </h1>
              <motion.p className="hero-texto" variants={entrada}>O voltAqui organiza os achados e perdidos da sua escola. A secretaria registra o que foi encontrado, o aluno procura pelo celular e o objeto só é devolvido para quem prova que é o dono.</motion.p>
              <motion.div className="hero-botoes" variants={entrada}>
                <Link className="botao botao-primario" to="/login">Entrar</Link>
                <a className="botao botao-sobre-marca" href="#como-funciona">Ver como funciona</a>
              </motion.div>
            </motion.div>
            <EtiquetaAbertura />
          </div>
          <p className="hero-dica" aria-hidden="true">Dê um tapa na etiqueta</p>
        </section>

        <section id="problema" className="secao problema" aria-labelledby="problema-titulo">
          <div className="container problema-grade">
            <motion.div variants={grupo} {...aoAparecer}>
              <motion.h2 id="problema-titulo" className="secao-titulo" variants={entrada}>Hoje, o que se perde vai parar numa caixa.</motion.h2>
              <motion.p className="problema-texto" variants={entrada}>Na secretaria, tudo o que é encontrado vai para uma caixa. Ninguém anota o que chegou nem onde foi achado. Quem perdeu precisa ir até o balcão e revirar a caixa, e ninguém confere se quem leva o objeto é mesmo o dono.</motion.p>
              <motion.p className="problema-texto problema-virada" variants={entrada}>Com o voltAqui, cada objeto ganha número, local e data, e fica fácil de achar.</motion.p>
            </motion.div>
            <CaixaOrganizada />
          </div>
        </section>

        <section id="como-funciona" className="secao passos" aria-labelledby="como-funciona-titulo">
          <div className="container">
            <p className="secao-etiqueta">Como funciona</p>
            <h2 id="como-funciona-titulo" className="secao-titulo">Três passos até voltar para você.</h2>
            <motion.ol className="passos-lista" ref={passosRef} variants={grupo} {...aoAparecer}>
              <li className="passos-trilho" aria-hidden="true">
                <motion.span className="passos-trilho-cheio" style={{ scaleX: avancoPassos }} />
              </li>
              <motion.li className="passos-item" variants={entrada}>
                <h3>A secretaria cadastra</h3>
                <p>Registra o objeto com categoria, local, data e um detalhe que só o dono sabe.</p>
              </motion.li>
              <motion.li className="passos-item" variants={entrada}>
                <h3>O aluno encontra e pede</h3>
                <p>Usa os filtros, acha o que é seu e descreve esse detalhe.</p>
              </motion.li>
              <motion.li className="passos-item" variants={entrada}>
                <h3>A secretaria confere e devolve</h3>
                <p>Compara as respostas, aprova o pedido e marca como devolvido.</p>
              </motion.li>
            </motion.ol>
          </div>
        </section>

        <section id="para-quem" className="secao perfis" aria-labelledby="para-quem-titulo">
          <div className="container">
            <h2 id="para-quem-titulo" className="secao-titulo">Feito para os dois lados do balcão.</h2>
            <motion.div className="perfis-grade" variants={grupo} {...aoAparecer}>
              <motion.article className="perfis-card" variants={entrada}>
                <div className="perfis-cabecalho">
                  <span className="perfis-icone"><svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg></span>
                  <h3>Secretaria</h3>
                </div>
                <ul className="perfis-lista">
                  <li><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>Cadastra, edita e exclui achados.</li>
                  <li><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>Analisa cada pedido vendo o detalhe ao lado da resposta do aluno.</li>
                  <li><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>Acompanha o status de cada objeto.</li>
                </ul>
              </motion.article>
              <motion.article className="perfis-card" variants={entrada}>
                <div className="perfis-cabecalho">
                  <span className="perfis-icone"><svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/></svg></span>
                  <h3>Aluno</h3>
                </div>
                <ul className="perfis-lista">
                  <li><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>Cria a conta com o código da escola.</li>
                  <li><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>Busca pela descrição e pela categoria.</li>
                  <li><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>Diz o que perdeu, onde e quando, e vê os achados mais parecidos.</li>
                  <li><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>Acompanha os próprios pedidos.</li>
                </ul>
              </motion.article>
            </motion.div>
          </div>
        </section>

        <section id="seguranca" className="secao seguranca" aria-labelledby="seguranca-titulo">
          <div className="container seguranca-grade">
            <div>
              <p className="secao-etiqueta">Segurança</p>
              <h2 id="seguranca-titulo" className="secao-titulo">Só o dono sabe o detalhe.</h2>
              <p className="seguranca-texto">Todo achado tem uma descrição pública e um detalhe oculto, como um adesivo, um nome escrito ou uma marca por dentro. O aluno vê só a descrição pública. Para pedir o objeto, ele descreve o detalhe, e a secretaria confere antes de devolver.</p>
              <p className="seguranca-texto seguranca-convite">Troque a tela no exemplo para ver a diferença.</p>
            </div>
            <ExemploSeguranca />
          </div>
        </section>

        <section id="conferencia" className="secao conferencia-secao" aria-labelledby="conferencia-titulo">
          <div className="container conferencia-grade">
            <motion.div variants={grupo} {...aoAparecer}>
              <motion.p className="secao-etiqueta" variants={entrada}>Ajuda na conferência</motion.p>
              <motion.h2 id="conferencia-titulo" className="secao-titulo" variants={entrada}>A secretaria não confere no escuro.</motion.h2>
              <motion.p className="conferencia-texto" variants={entrada}>
                Quando chega um pedido, o voltAqui compara o que o aluno escreveu com o detalhe oculto,
                marca as palavras em comum e mostra se a semelhança é alta, média ou baixa.
              </motion.p>
              <motion.p className="conferencia-texto" variants={entrada}>
                Palavras que já estão na descrição pública não contam, porque qualquer um pode copiar.
                É só uma ajuda: quem aprova ou recusa é sempre a secretaria.
              </motion.p>
            </motion.div>
            <DemoConferencia />
          </div>
        </section>

        <section id="comece" className="secao chamada" aria-labelledby="comece-titulo">
          <FaixaAchados />
          <div className="container">
            <h2 id="comece-titulo" className="secao-titulo">Perdeu alguma coisa na escola?</h2>
            <p className="chamada-texto">Entre e veja se ela já está esperando por você.</p>
            <div className="chamada-botoes">
              <Link className="botao botao-escuro" to="/login">Entrar</Link>
              <Link className="botao botao-contorno-escuro" to="/criar-conta">Criar conta</Link>
            </div>
          </div>
        </section>

      </main>

      <footer className="rodape">
        <div className="container rodape-conteudo">
          <Link className="rodape-logo" to="/">
            <Logo alt="voltAqui, voltar ao início" />
          </Link>
          <p>Feito no SENAI para qualquer escola: cada uma entra com o próprio código.<br />Projeto final de Desenvolvimento de Sistemas, 2026.</p>
          <nav aria-label="Rodapé">
            <ul className="rodape-links">
              <li><Link to="/login">Entrar</Link></li>
              <li><Link to="/criar-conta">Criar conta</Link></li>
              <li><Link to="/login/secretaria">Área da secretaria</Link></li>
            </ul>
          </nav>
        </div>
      </footer>
    </MotionConfig>
  )
}
