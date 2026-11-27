import { useEffect } from 'react'

const PADRAO = 'voltAqui | Achados e perdidos da escola'

// Troca o título da aba do navegador conforme a página: "Achados | voltAqui".
// Ajuda quem tem várias abas abertas a achar a certa.
export function useTitulo(titulo) {
  useEffect(() => {
    document.title = titulo ? `${titulo} | voltAqui` : PADRAO
  }, [titulo])
}
