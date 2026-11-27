// Logo que acompanha o tema: no modo escuro troca para a versão com as partes azuis em branco.
// "sempreEscura" = o fundo já é azul nos dois temas (barra lateral, painel do login).
export function Logo({ alt, largura = 114, altura = 40, sempreEscura = false }) {
  if (sempreEscura) {
    return <img src="/img/logo-horizontal-escura.svg" alt={alt} width={largura} height={altura} />
  }
  return (
    <>
      <img className="logo-clara" src="/img/logo-horizontal.svg" alt={alt} width={largura} height={altura} />
      <img className="logo-escura" src="/img/logo-horizontal-escura.svg" alt={alt} width={largura} height={altura} />
    </>
  )
}
