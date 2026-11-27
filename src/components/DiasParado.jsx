import { textoDosDias, tomDosDias } from '../utils/dias'
import { diasDesde } from '../utils/datas'
import { Icone } from './Icone'

export function DiasParado({ data }) {
  const dias = diasDesde(data)
  return (
    <span className={`dias-parado dias-tom-${tomDosDias(dias)}`}>
      <Icone nome="relogio" tamanho={14} />
      {textoDosDias(dias)}
    </span>
  )
}
