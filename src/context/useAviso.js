import { useContext } from 'react'
import { AvisoContext } from './AvisoContext'

// Uso: const avisar = useAviso(); avisar('Achado cadastrado.')
export function useAviso() {
  return useContext(AvisoContext)
}
