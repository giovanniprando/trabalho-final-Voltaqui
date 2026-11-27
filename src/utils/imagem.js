const TAMANHO_MAXIMO = 15 * 1024 * 1024

const TIPOS_ACEITOS = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

export function problemaNaFoto(arquivo) {
  const nome = arquivo.name.toLowerCase()
  if (arquivo.type === 'image/heic' || arquivo.type === 'image/heif' || /\.hei[cf]$/.test(nome)) {
    return 'Foto HEIC do iPhone não abre no navegador. Envie em JPG (no iPhone: Ajustes > Câmera > Formatos > Mais Compatível).'
  }
  if (!TIPOS_ACEITOS.includes(arquivo.type)) {
    return 'Esse arquivo não é uma foto. Escolha um arquivo JPG, PNG ou WEBP.'
  }
  if (arquivo.size > TAMANHO_MAXIMO) {
    return 'A foto passa de 15 MB. Escolha uma foto menor.'
  }
  return null
}

export function reduzirImagem(arquivo, lado = 160) {
  return new Promise((resolve, reject) => {
    const problema = problemaNaFoto(arquivo)
    if (problema) {
      reject(new Error(problema))
      return
    }

    const endereco = URL.createObjectURL(arquivo)
    const imagem = new Image()

    imagem.addEventListener('error', () => {
      URL.revokeObjectURL(endereco)
      reject(new Error('Não foi possível abrir essa foto. Tente outra.'))
    })

    imagem.addEventListener('load', () => {
      const menor = Math.min(imagem.width, imagem.height)
      const x = (imagem.width - menor) / 2
      const y = (imagem.height - menor) / 2

      const canvas = document.createElement('canvas')
      canvas.width = lado
      canvas.height = lado
      canvas.getContext('2d').drawImage(imagem, x, y, menor, menor, 0, 0, lado, lado)
      URL.revokeObjectURL(endereco)

      resolve(canvas.toDataURL('image/jpeg', 0.7))
    })

    imagem.src = endereco
  })
}
