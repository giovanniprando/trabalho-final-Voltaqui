// Toda leitura e gravação no localStorage passa por aqui.
// Nenhum outro arquivo deve usar localStorage diretamente.

const CHAVES = {
  achados: 'voltaqui:achados',
  solicitacoes: 'voltaqui:solicitacoes',
  sessao: 'voltaqui:sessao',
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

// ---------- achados ----------

/**
 * Formato de um achado:
 * {
 *   id: string,
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
  const achado = {
    ...dados,
    id: gerarId(),
    status: STATUS_ACHADO.DISPONIVEL,
    criadoEm: agora(),
    atualizadoEm: agora(),
  }
  gravar(CHAVES.achados, [...listarAchados(), achado])
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

  // Sem outra solicitação pendente, o achado volta a ficar disponível.
  const aindaPendente = listarSolicitacoesDoAchado(recusada.achadoId).some(
    (s) => s.status === STATUS_SOLICITACAO.PENDENTE,
  )
  if (!aindaPendente) {
    atualizarAchado(recusada.achadoId, { status: STATUS_ACHADO.DISPONIVEL })
  }
  return recusada
}

export function marcarDevolvido(achadoId) {
  return atualizarAchado(achadoId, { status: STATUS_ACHADO.DEVOLVIDO })
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
