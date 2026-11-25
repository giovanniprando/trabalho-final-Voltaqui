// Acima disso, o navegador do celular pode travar só para abrir a foto.
const TAMANHO_MAXIMO = 15 * 1024 * 1024

// Formatos que o navegador consegue desenhar no canvas.
const TIPOS_ACEITOS = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

// Confere o arquivo antes de tentar abrir. Devolve a mensagem de erro ou null.
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

// Reduz uma foto para um quadrado pequeno (160 x 160) antes de salvar.
// Uma foto de celular tem uns 3 MB; o localStorage aguenta só uns 5 MB no total.
// Reduzida e em JPEG, ela fica com poucos KB.
export function reduzirImagem(arquivo, lado = 160) {
  return new Promise((resolve, reject) => {
    const problema = problemaNaFoto(arquivo)
    if (problema) {
      reject(new Error(problema))
      return
    }

    // createObjectURL abre o arquivo direto, sem copiar tudo para um texto gigante.
    const endereco = URL.createObjectURL(arquivo)
    const imagem = new Image()

    imagem.addEventListener('error', () => {
      URL.revokeObjectURL(endereco)
      reject(new Error('Não foi possível abrir essa foto. Tente outra.'))
    })

    imagem.addEventListener('load', () => {
      // Corta um quadrado no meio da foto, para não ficar achatada.
      const menor = Math.min(imagem.width, imagem.height)
      const x = (imagem.width - menor) / 2
      const y = (imagem.height - menor) / 2

      const canvas = document.createElement('canvas')
      canvas.width = lado
      canvas.height = lado
      canvas.getContext('2d').drawImage(imagem, x, y, menor, menor, 0, 0, lado, lado)
      URL.revokeObjectURL(endereco)

      // toDataURL transforma o desenho em texto ("data:image/jpeg;base64,...").
      resolve(canvas.toDataURL('image/jpeg', 0.7))
    })

    imagem.src = endereco
  })
}
