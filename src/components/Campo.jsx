// Moldura de um campo de formulário: rótulo, campo, ajuda e erro.
// O campo em si (input, select, textarea) vem como children.
// Com "limite" e "valor", mostra quantos caracteres já foram usados.

export function Campo({ id, rotulo, erro, ajuda, limite, valor, className = '', children }) {
  const classes = ['campo', erro && 'campo-mostrar-erro', className].filter(Boolean).join(' ')
  const usados = valor?.length ?? 0
  const quaseNoLimite = limite && usados >= limite * 0.9

  return (
    <div className={classes}>
      <label htmlFor={id}>{rotulo}</label>
      {children}
      {limite && (
        <span className={`campo-contador${quaseNoLimite ? ' campo-contador-alerta' : ''}`} aria-hidden="true">
          {usados}/{limite}
        </span>
      )}
      {ajuda && !erro && <p className="campo-ajuda" id={`${id}-ajuda`}>{ajuda}</p>}
      {erro && <p className="campo-erro" id={`${id}-erro`}>{erro}</p>}
    </div>
  )
}
