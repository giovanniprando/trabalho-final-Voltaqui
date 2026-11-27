import { motion, useInView, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { IconeCategoria } from '../IconeCategoria'

const ITENS = [
  { numero: '0151', nome: 'Garrafa térmica azul', categoria: 'garrafas', local: 'Pátio', x: 6, y: 52, giro: -14 },
  { numero: '0152', nome: 'Fone sem fio branco', categoria: 'eletronicos', local: 'Biblioteca', x: 40, y: 10, giro: 9 },
  { numero: '0153', nome: 'Casaco cinza com capuz', categoria: 'roupas', local: 'Quadra', x: 30, y: 62, giro: 6 },
  { numero: '0154', nome: 'Chave com chaveiro de coruja', categoria: 'chaves', local: 'Cantina', x: 3, y: 18, giro: -6 },
  { numero: '0155', nome: 'Estojo roxo', categoria: 'material-escolar', local: 'Sala 12', x: 52, y: 38, giro: -10 },
]

const MOLA = { type: 'spring', stiffness: 260, damping: 28 }

export function CaixaOrganizada() {
  const ref = useRef(null)
  const visivel = useInView(ref, { once: true, amount: 0.6 })
  const reduzir = useReducedMotion()
  const [organizado, setOrganizado] = useState(false)
  const [mexeu, setMexeu] = useState(false)

  useEffect(() => {
    if (!visivel || reduzir || mexeu) return
    const id = setTimeout(() => setOrganizado(true), 700)
    return () => clearTimeout(id)
  }, [visivel, reduzir, mexeu])

  function alternar() {
    setMexeu(true)
    setOrganizado((atual) => !atual)
  }

  return (
    <div className={organizado ? 'caixa caixa-organizada' : 'caixa'} ref={ref}>
      <div className="caixa-topo">
        <p className="caixa-titulo">{organizado ? 'No voltAqui' : 'Caixa da secretaria'}</p>
        <button type="button" className="caixa-botao" onClick={alternar}>
          {organizado ? 'Voltar para a caixa' : 'Organizar'}
        </button>
      </div>

      <ul className="caixa-itens">
        {ITENS.map((item) => (
          <motion.li
            key={item.numero}
            layout
            className="caixa-item"
            style={organizado ? undefined : { left: `${item.x}%`, top: `${item.y}%` }}
            animate={{ rotate: organizado ? 0 : item.giro }}
            transition={MOLA}
          >
            <motion.span layout="position" transition={MOLA}>
              <IconeCategoria categoria={item.categoria} tamanho="pequeno" />
            </motion.span>
            <motion.span layout="position" transition={MOLA} className="caixa-item-texto">
              <span className="caixa-item-nome">{item.nome}</span>
              <span className="caixa-item-local">
                Nº {item.numero}, {item.local}
              </span>
            </motion.span>
          </motion.li>
        ))}
      </ul>
      <p className="visualmente-oculto" aria-live="polite">
        {organizado ? 'Achados organizados com número e local.' : 'Achados misturados na caixa.'}
      </p>
    </div>
  )
}
