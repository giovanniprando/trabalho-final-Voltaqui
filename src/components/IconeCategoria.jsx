import { buscarCategoria } from '../data/categorias'
import { Icone } from './Icone'

const TAMANHOS = {
  pequeno: { classe: 'icone-categoria icone-categoria-sm', icone: 18 },
  medio: { classe: 'icone-categoria', icone: 24 },
  grande: { classe: 'icone-categoria icone-categoria-lg', icone: 36 },
}

// data-categoria liga a cor da categoria (veja componentes.css).
export function IconeCategoria({ categoria, tamanho = 'medio' }) {
  const { classe, icone } = TAMANHOS[tamanho]
  const nome = buscarCategoria(categoria)?.icone ?? 'pacote'
  return (
    <span className={classe} data-categoria={categoria}>
      <Icone nome={nome} tamanho={icone} />
    </span>
  )
}
