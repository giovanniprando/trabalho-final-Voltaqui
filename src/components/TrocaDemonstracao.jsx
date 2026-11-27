import { useNavigate } from 'react-router'
import { useAuth } from '../context/useAuth'
import { PERFIS, USUARIOS, paginaInicial } from '../data/usuarios'
import { Icone } from './Icone'

export function TrocaDemonstracao() {
  const { usuario, entrar } = useAuth()
  const navigate = useNavigate()

  const ehContaDeTeste = USUARIOS.some((u) => u.id === usuario.id)
  if (!ehContaDeTeste) return null

  const vaiParaSecretaria = usuario.perfil === PERFIS.ALUNO
  const proximaConta = vaiParaSecretaria
    ? USUARIOS.find((u) => u.perfil === PERFIS.SECRETARIA)
    : USUARIOS.find((u) => u.perfil === PERFIS.ALUNO)

  function trocar() {
    const resultado = entrar(proximaConta.email, proximaConta.senha)
    if (resultado.ok) navigate(paginaInicial(resultado.usuario))
  }

  return (
    <button className="lateral-demo" type="button" onClick={trocar}>
      <Icone nome="trocar" tamanho={18} />
      <span>
        {vaiParaSecretaria ? 'Ver como secretaria' : `Ver como aluno (${proximaConta.nome.split(' ')[0]})`}
        <small>Demonstração</small>
      </span>
    </button>
  )
}
