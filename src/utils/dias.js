export function tomDosDias(dias) {
  if (dias <= 7) return 'recente'
  if (dias <= 30) return 'atencao'
  return 'parado'
}

export function textoDosDias(dias) {
  if (dias === 0) return 'Chegou hoje'
  if (dias === 1) return 'Há 1 dia aqui'
  return `Há ${dias} dias aqui`
}
