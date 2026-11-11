import { hojeISO } from './formatarData'

// Cada função retorna um objeto { campo: 'mensagem de erro' }.
// Objeto vazio = formulário válido.

export function validarAchado(dados) {
  const erros = {}

  if (!dados.categoria) erros.categoria = 'Escolha uma categoria.'
  if (!dados.local) erros.local = 'Escolha o local onde foi encontrado.'

  if (!dados.descricao?.trim()) {
    erros.descricao = 'Descreva o objeto.'
  } else if (dados.descricao.trim().length < 5) {
    erros.descricao = 'A descrição precisa ter pelo menos 5 caracteres.'
  }

  if (!dados.detalheOculto?.trim()) {
    erros.detalheOculto = 'Informe um detalhe que só o dono saberia.'
  }

  if (!dados.dataEncontrado) {
    erros.dataEncontrado = 'Informe a data em que foi encontrado.'
  } else if (dados.dataEncontrado > hojeISO()) {
    erros.dataEncontrado = 'A data não pode estar no futuro.'
  }

  return erros
}

export function validarSolicitacao(dados) {
  const erros = {}

  if (!dados.descricaoDono?.trim()) {
    erros.descricaoDono = 'Descreva um detalhe do objeto para provar que é seu.'
  } else if (dados.descricaoDono.trim().length < 10) {
    erros.descricaoDono = 'Dê mais detalhes (pelo menos 10 caracteres).'
  }

  return erros
}

export function temErros(erros) {
  return Object.keys(erros).length > 0
}
