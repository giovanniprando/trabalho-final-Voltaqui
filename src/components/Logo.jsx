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
