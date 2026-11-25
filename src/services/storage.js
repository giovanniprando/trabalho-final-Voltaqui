// Toda leitura e gravação no localStorage passa por aqui.
// Nenhum outro arquivo usa localStorage diretamente.

import { ACHADOS_EXEMPLO, SOLICITACOES_EXEMPLO } from '../data/exemplos'

const CHAVES = {
  achados: 'voltaqui:achados',
  solicitacoes: 'voltaqui:solicitacoes',
  contas: 'voltaqui:contas',
  ultimoNumero: 'voltaqui:ultimoNumero',
  sessao: 'voltaqui:sessao',
  leituras: 'voltaqui:notificacoesLidas',
}

export const STATUS_ACHADO = {
  DISPONIVEL: 'disponivel',
  EM_ANALISE: 'em_analise',
  DEVOLVIDO: 'devolvido',
}

export const STATUS_SOLICITACAO = {
  PENDENTE: 'pendente',
  APROVADA: 'aprovada',
  RECUSADA: 'recusada',
}

// ---------- utilitários internos ----------

function ler(chave, padrao) {
  try {
    const valor = localStorage.getItem(chave)
    return valor ? JSON.parse(valor) : padrao
  } catch {
    return padrao
  }
}

function gravar(chave, valor) {
  localStorage.setItem(chave, JSON.stringify(valor))
}

function gerarId() {
  return crypto.randomUUID()
}

function agora() {
  return new Date().toISOString()
}

// Coloca os dados de exemplo na primeira vez que o site abre.
const ULTIMO_NUMERO_EXEMPLO = Math.max(...ACHADOS_EXEMPLO.map((a) => a.numero))

export function inicializarDados() {
  if (localStorage.getItem(CHAVES.achados) === null) {
    gravar(CHAVES.achados, ACHADOS_EXEMPLO)
    gravar(CHAVES.ultimoNumero, ULTIMO_NUMERO_EXEMPLO)
  }
  if (localStorage.getItem(CHAVES.solicitacoes) === null) gravar(CHAVES.solicitacoes, SOLICITACOES_EXEMPLO)
}

// Apaga tudo e volta para os dados de exemplo (útil antes da apresentação).
export function restaurarExemplos() {
  gravar(CHAVES.ultimoNumero, ULTIMO_NUMERO_EXEMPLO)
  gravar(CHAVES.achados, ACHADOS_EXEMPLO)
  gravar(CHAVES.solicitacoes, SOLICITACOES_EXEMPLO)
}

// ---------- achados ----------

/**
 * Formato de um achado:
 * {
 *   id: string,
 *   numero: number,          // número da etiqueta (Nº 0158)
 *   categoria: string,       // id de src/data/categorias.js
 *   descricao: string,       // texto público
 *   detalheOculto: string,   // só a secretaria vê; usado para conferir o dono
 *   local: string,           // id de src/data/locais.js
 *   dataEncontrado: string,  // 'AAAA-MM-DD'
 *   status: 'disponivel' | 'em_analise' | 'devolvido',
 *   criadoEm: string,        // ISO
 *   atualizadoEm: string,    // ISO
 * }
 */

export function listarAchados() {
  return ler(CHAVES.achados, [])
}

export function buscarAchado(id) {
  return listarAchados().find((achado) => achado.id === id) ?? null
}

export function criarAchado(dados) {
  const achados = listarAchados()

  // O número nunca se repete, nem se o último achado for excluído.
  const maiorNaLista = achados.reduce((maior, a) => Math.max(maior, a.numero ?? 0), 0)
  const numero = Math.max(maiorNaLista, ler(CHAVES.ultimoNumero, 0)) + 1
  gravar(CHAVES.ultimoNumero, numero)

  const achado = {
    ...dados,
    id: gerarId(),
    numero,
    status: STATUS_ACHADO.DISPONIVEL,
    criadoEm: agora(),
    atualizadoEm: agora(),
  }
  gravar(CHAVES.achados, [...achados, achado])
  return achado
}

export function atualizarAchado(id, alteracoes) {
  let atualizado = null
  const achados = listarAchados().map((achado) => {
    if (achado.id !== id) return achado
    atualizado = { ...achado, ...alteracoes, id, atualizadoEm: agora() }
    return atualizado
  })
  gravar(CHAVES.achados, achados)
  return atualizado
}

export function excluirAchado(id) {
  gravar(
    CHAVES.achados,
    listarAchados().filter((achado) => achado.id !== id),
  )
  gravar(
    CHAVES.solicitacoes,
    listarSolicitacoes().filter((s) => s.achadoId !== id),
  )
}

// ---------- solicitações de devolução ----------

/**
 * Formato de uma solicitação:
 * {
 *   id: string,
 *   achadoId: string,
 *   alunoId: string,
 *   alunoNome: string,
 *   descricaoDono: string,   // o aluno descreve o detalhe oculto
 *   status: 'pendente' | 'aprovada' | 'recusada',
 *   criadaEm: string,        // ISO
 *   analisadaEm: string | null,
 * }
 */

export function listarSolicitacoes() {
  return ler(CHAVES.solicitacoes, [])
}

export function listarSolicitacoesDoAchado(achadoId) {
  return listarSolicitacoes().filter((s) => s.achadoId === achadoId)
}

export function criarSolicitacao({ achadoId, alunoId, alunoNome, descricaoDono }) {
  const solicitacao = {
    id: gerarId(),
    achadoId,
    alunoId,
    alunoNome,
    descricaoDono,
    status: STATUS_SOLICITACAO.PENDENTE,
    criadaEm: agora(),
    analisadaEm: null,
  }
  gravar(CHAVES.solicitacoes, [...listarSolicitacoes(), solicitacao])
  atualizarAchado(achadoId, { status: STATUS_ACHADO.EM_ANALISE })
  return solicitacao
}

function atualizarSolicitacao(id, alteracoes) {
  let atualizada = null
  const solicitacoes = listarSolicitacoes().map((s) => {
    if (s.id !== id) return s
    atualizada = { ...s, ...alteracoes, id }
    return atualizada
  })
  gravar(CHAVES.solicitacoes, solicitacoes)
  return atualizada
}

export function aprovarSolicitacao(id) {
  return atualizarSolicitacao(id, {
    status: STATUS_SOLICITACAO.APROVADA,
    analisadaEm: agora(),
  })
}

export function recusarSolicitacao(id) {
  const recusada = atualizarSolicitacao(id, {
    status: STATUS_SOLICITACAO.RECUSADA,
    analisadaEm: agora(),
  })
  if (!recusada) return null

  // Sem outro pedido pendente ou aprovado, o achado volta a ficar disponível.
  const aindaEmAnalise = listarSolicitacoesDoAchado(recusada.achadoId).some(
    (s) => s.status === STATUS_SOLICITACAO.PENDENTE || s.status === STATUS_SOLICITACAO.APROVADA,
  )
  if (!aindaEmAnalise) {
    atualizarAchado(recusada.achadoId, { status: STATUS_ACHADO.DISPONIVEL })
  }
  return recusada
}

export function marcarDevolvido(achadoId) {
  // devolvidoEm guarda o momento da entrega (aparece no comprovante).
  return atualizarAchado(achadoId, { status: STATUS_ACHADO.DEVOLVIDO, devolvidoEm: agora() })
}

// ---------- contas de aluno criadas no site ----------

export function listarContas() {
  return ler(CHAVES.contas, [])
}

export function criarConta(dados) {
  const conta = { ...dados, id: gerarId(), criadaEm: agora() }
  gravar(CHAVES.contas, [...listarContas(), conta])
  return conta
}

// ---------- sessão (login simulado) ----------

export function lerSessao() {
  return ler(CHAVES.sessao, null)
}

export function salvarSessao(usuario) {
  gravar(CHAVES.sessao, usuario)
}

export function limparSessao() {
  localStorage.removeItem(CHAVES.sessao)
}

// ---------- notificações do aluno ----------

// Guarda, para cada aluno, quando ele abriu o sino pela última vez.
// Respostas da secretaria depois dessa data contam como "não lidas".
export function lerUltimaLeitura(usuarioId) {
  return ler(CHAVES.leituras, {})[usuarioId] ?? null
}

export function marcarNotificacoesLidas(usuarioId) {
  const leituras = ler(CHAVES.leituras, {})
  gravar(CHAVES.leituras, { ...leituras, [usuarioId]: agora() })
}
