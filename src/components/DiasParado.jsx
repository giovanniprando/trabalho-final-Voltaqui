import { textoDosDias, tomDosDias } from '../utils/dias'
import { diasDesde } from '../utils/datas'
import { Icone } from './Icone'

// Etiqueta "Há 12 dias aqui" (as regras de cor ficam em utils/dias.js).
export function DiasParado({ data }) {
  const dias = diasDesde(data)
  return (
    <span className={`dias-parado dias-tom-${tomDosDias(dias)}`}>
      <Icone nome="relogio" tamanho={14} />
      {textoDosDias(dias)}
    </span>
  )
}
