import { useContext } from 'react'
import { DadosContext } from './DadosContext'

// Uso: const { achados, solicitacoes, cadastrarAchado, ... } = useDados()
export function useDados() {
  return useContext(DadosContext)
}
