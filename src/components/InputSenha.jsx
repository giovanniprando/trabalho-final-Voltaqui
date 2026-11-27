import { useState } from 'react'
import { Icone } from './Icone'

export function InputSenha(props) {
  const [visivel, setVisivel] = useState(false)

  return (
    <div className="input-senha">
      <input {...props} type={visivel ? 'text' : 'password'} />
      <button
        type="button"
        className="input-senha-botao"
        onClick={() => setVisivel(!visivel)}
        aria-label={visivel ? 'Esconder senha' : 'Mostrar senha'}
        aria-pressed={visivel}
      >
        <Icone nome={visivel ? 'olho_fechado' : 'olho'} tamanho={18} />
      </button>
    </div>
  )
}
