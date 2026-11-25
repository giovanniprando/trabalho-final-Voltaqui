// "Há 12 dias aqui": quanto tempo o achado está na secretaria.
// A cor muda com o tempo e vira um alerta natural de item parado.
export function tomDosDias(dias) {
  if (dias <= 7) return 'recente'   // até 1 semana: verde
  if (dias <= 30) return 'atencao'  // até 1 mês: laranja
  return 'parado'                   // mais de 1 mês: vermelho
}

export function textoDosDias(dias) {
  if (dias === 0) return 'Chegou hoje'
  if (dias === 1) return 'Há 1 dia aqui'
  return `Há ${dias} dias aqui`
}
