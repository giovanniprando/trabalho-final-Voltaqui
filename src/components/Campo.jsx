// Moldura de um campo de formulário: rótulo, campo, ajuda e erro.
// O campo em si (input, select, textarea) vem como children.

export function Campo({ id, rotulo, erro, ajuda, className = '', children }) {
  const classes = ['campo', erro && 'campo-mostrar-erro', className].filter(Boolean).join(' ')

  return (
    <div className={classes}>
      <label htmlFor={id}>{rotulo}</label>
      {children}
      {ajuda && !erro && <p className="campo-ajuda" id={`${id}-ajuda`}>{ajuda}</p>}
      {erro && <p className="campo-erro" id={`${id}-erro`}>{erro}</p>}
    </div>
  )
}
