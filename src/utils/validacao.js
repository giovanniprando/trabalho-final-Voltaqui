import { buscarEscola } from '../data/escolas'
import { hojeISO } from './datas'

// Cada função devolve um objeto { campo: 'mensagem de erro' }.
// Objeto vazio = formulário válido.

const EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validarLogin({ email, senha }) {
  const erros = {}
  if (!EMAIL_VALIDO.test(email.trim())) erros.email = 'Digite um e-mail válido, como nome@escola.com.br.'
  if (!senha) erros.senha = 'Digite sua senha.'
  return erros
}

export function validarConta(dados, emailJaExiste) {
  const erros = {}

  if (!/^[A-Za-z0-9]{6}$/.test(dados.codigoEscola.trim())) {
    erros.codigoEscola = 'O código tem 6 letras ou números, como SN7K2P.'
  } else if (!buscarEscola(dados.codigoEscola)) {
    erros.codigoEscola = 'Não achamos uma escola com esse código. Confira com a secretaria.'
  }

  if (!/^[0-9]{4,12}$/.test(dados.matricula.trim())) {
    erros.matricula = 'Use só números, de 4 a 12 dígitos.'
  }

  if (dados.nome.trim().length < 3) erros.nome = 'Digite seu nome completo.'

  if (!EMAIL_VALIDO.test(dados.email.trim())) {
    erros.email = 'Digite um e-mail válido, como nome@escola.com.br.'
  } else if (emailJaExiste) {
    erros.email = 'Já existe uma conta com este e-mail. Tente entrar.'
  }

  if (dados.senha.length < 6) erros.senha = 'A senha precisa ter pelo menos 6 caracteres.'
  if (!dados.confirmarSenha) {
    erros.confirmarSenha = 'Repita a senha que você criou.'
  } else if (dados.confirmarSenha !== dados.senha) {
    erros.confirmarSenha = 'As senhas não são iguais.'
  }

  if (!dados.aceite) erros.aceite = 'Para criar a conta, aceite os termos.'

  return erros
}

export function validarAchado(dados) {
  const erros = {}

  if (!dados.categoria) erros.categoria = 'Escolha uma categoria.'
  if (!dados.local.trim()) erros.local = 'Escreva o local onde foi encontrado.'
  else if (dados.local.trim().length < 3) erros.local = 'Escreva pelo menos 3 letras.'

  if (!dados.dataEncontrado) {
    erros.dataEncontrado = 'Informe a data em que o objeto foi encontrado.'
  } else if (dados.dataEncontrado > hojeISO()) {
    erros.dataEncontrado = 'A data não pode estar no futuro.'
  }

  if (dados.descricao.trim().length < 10) {
    erros.descricao = 'Descreva o objeto com pelo menos 10 caracteres.'
  }

  if (dados.detalheOculto.trim().length < 5) {
    erros.detalheOculto = 'Escreva um detalhe que só o dono saberia (mínimo de 5 caracteres).'
  }

  return erros
}

export function validarSolicitacao({ descricaoDono }) {
  const erros = {}
  const texto = descricaoDono.trim()
  if (texto.length < 10) {
    erros.descricaoDono = 'Escreva pelo menos 10 caracteres para a secretaria conseguir conferir.'
  } else if (!/\p{L}{3}/u.test(texto)) {
    erros.descricaoDono = 'Descreva com palavras, não só com números ou símbolos.'
  }
  return erros
}

export function temErros(erros) {
  return Object.keys(erros).length > 0
}
