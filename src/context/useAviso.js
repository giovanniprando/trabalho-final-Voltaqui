import { useContext } from 'react'
import { AvisoContext } from './AvisoContext'

export function useAviso() {
  return useContext(AvisoContext)
}
