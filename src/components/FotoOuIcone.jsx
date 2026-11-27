import { IconeCategoria } from './IconeCategoria'

export function FotoOuIcone({ achado, tamanho = 'medio' }) {
  if (!achado.foto) return <IconeCategoria categoria={achado.categoria} tamanho={tamanho} />
  return <img className={`foto-achado foto-${tamanho}`} src={achado.foto} alt="" />
}
