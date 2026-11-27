import { useContext } from 'react'
import { DadosContext } from './DadosContext'

export function useDados() {
  return useContext(DadosContext)
}
