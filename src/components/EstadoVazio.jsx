import { Icone } from './Icone'

export function EstadoVazio({ icone = 'busca', titulo, texto, children }) {
  return (
    <div className="estado-vazio">
      <span className="estado-vazio-icone">
        <Icone nome={icone} tamanho={24} />
      </span>
      <h2>{titulo}</h2>
      {texto && <p>{texto}</p>}
      {children}
    </div>
  )
}
