import { motion } from 'motion/react'
import { useState } from 'react'

const VISOES = [
  { id: 'aluno', texto: 'Tela do aluno' },
  { id: 'secretaria', texto: 'Tela da secretaria' },
]

// Mostra o mesmo achado visto pelo aluno (detalhe escondido) e pela secretaria (detalhe aberto).
export function ExemploSeguranca() {
  const [visao, setVisao] = useState('aluno')
  const aberto = visao === 'secretaria'

  return (
    <figure className="seguranca-exemplo">
      <fieldset className="seguranca-visoes">
        <legend className="visualmente-oculto">Ver o achado como</legend>
        {VISOES.map((item) => (
          <button
            key={item.id}
            type="button"
            className="seguranca-visao"
            aria-pressed={visao === item.id}
            onClick={() => setVisao(item.id)}
          >
            {visao === item.id && (
              <motion.span
                className="seguranca-visao-fundo"
                layoutId="visao-ativa"
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            <span className="seguranca-visao-texto">{item.texto}</span>
          </button>
        ))}
      </fieldset>

      <div className="seguranca-parte">
        <p className="seguranca-rotulo">Descrição pública</p>
        <p className="seguranca-valor">Garrafa térmica azul, 500&nbsp;ml</p>
        <span className="selo selo-disponivel">Disponível</span>
      </div>

      <div className="seguranca-parte seguranca-oculto">
        <p className="seguranca-rotulo">
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {aberto ? (
              <><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 9.9-1" /></>
            ) : (
              <><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>
            )}
          </svg>
          Detalhe oculto
        </p>
        <motion.p
          className="seguranca-valor"
          aria-hidden={!aberto}
          animate={{ filter: aberto ? 'blur(0px)' : 'blur(7px)' }}
          transition={{ duration: 0.35 }}
        >
          Adesivo de banda na base
        </motion.p>
        {!aberto && <span className="visualmente-oculto">Escondido para o aluno.</span>}
        <p className="seguranca-aviso">
          {aberto
            ? 'A secretaria compara com o que o aluno escreveu.'
            : 'O aluno não vê. Para pedir, ele precisa descrever.'}
        </p>
      </div>
    </figure>
  )
}
