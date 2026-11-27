import { useEffect } from 'react'

const PADRAO = 'voltAqui | Achados e perdidos da escola'

export function useTitulo(titulo) {
  useEffect(() => {
    document.title = titulo ? `${titulo} | voltAqui` : PADRAO
  }, [titulo])
}
