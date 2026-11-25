// Reduz uma foto para um quadrado pequeno (160 x 160) antes de salvar.
// Uma foto de celular tem uns 3 MB; o localStorage aguenta só uns 5 MB no total.
// Reduzida e em JPEG, ela fica com poucos KB.
export function reduzirImagem(arquivo, lado = 160) {
  return new Promise((resolve, reject) => {
    const leitor = new FileReader()
    leitor.onerror = () => reject(new Error('Não foi possível ler a foto.'))
    leitor.onload = () => {
      const imagem = new Image()
      imagem.onerror = () => reject(new Error('Esse arquivo não parece ser uma foto.'))
      imagem.onload = () => {
        // Corta um quadrado no meio da foto, para não ficar achatada.
        const menor = Math.min(imagem.width, imagem.height)
        const x = (imagem.width - menor) / 2
        const y = (imagem.height - menor) / 2

        const canvas = document.createElement('canvas')
        canvas.width = lado
        canvas.height = lado
        canvas.getContext('2d').drawImage(imagem, x, y, menor, menor, 0, 0, lado, lado)

        // toDataURL transforma o desenho em texto ("data:image/jpeg;base64,...").
        resolve(canvas.toDataURL('image/jpeg', 0.7))
      }
      imagem.src = leitor.result
    }
    leitor.readAsDataURL(arquivo)
  })
}
