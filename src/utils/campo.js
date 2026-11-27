export function ligarCampo(id, erro, ajuda) {
  const descricao = erro ? `${id}-erro` : ajuda ? `${id}-ajuda` : undefined
  return { id, 'aria-invalid': erro ? true : undefined, 'aria-describedby': descricao }
}
