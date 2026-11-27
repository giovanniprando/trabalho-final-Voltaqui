import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'

const ETAPAS = [
  { texto: 'Disponível', classe: 'selo-disponivel', local: 'Encontrada no Bloco B, em 14/10' },
  { texto: 'Em análise', classe: 'selo-analise', local: 'Ana descreveu o detalhe oculto' },
  { texto: 'Devolvido', classe: 'selo-devolvido', local: 'Voltou para a dona em 16/10' },
]

export function EtiquetaAbertura() {
  const reduzir = useReducedMotion()
  const [etapa, setEtapa] = useState(0)

  useEffect(() => {
    if (reduzir) return
    const id = setInterval(() => setEtapa((atual) => (atual + 1) % ETAPAS.length), 2800)
    return () => clearInterval(id)
  }, [reduzir])

  const atual = ETAPAS[reduzir ? 2 : etapa]

  return (
    <div className="hero-cartao" aria-hidden="true">
      <p className="hero-cartao-numero">Achado nº 0142</p>
      <p className="hero-cartao-objeto">Mochila preta com chaveiro de dinossauro</p>
      <div className="hero-cartao-troca">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={atual.texto}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <p className="hero-cartao-local">{atual.local}</p>
            <span className={`selo ${atual.classe}`}>{atual.texto}</span>
          </motion.div>
        </AnimatePresence>
      </div>
      <ol className="hero-cartao-trilha">
        {ETAPAS.map((item, i) => (
          <li key={item.texto} className={i <= ETAPAS.indexOf(atual) ? 'feito' : ''} />
        ))}
      </ol>
    </div>
  )
}
