import { useEffect } from 'react'

const PADRAO = 'Voltaqui | Achados e perdidos da escola'

// Troca o título da aba do navegador conforme a página: "Achados | Voltaqui".
// Ajuda quem tem várias abas abertas a achar a certa.
export function useTitulo(titulo) {
  useEffect(() => {
    document.title = titulo ? `${titulo} | Voltaqui` : PADRAO
  }, [titulo])
}
