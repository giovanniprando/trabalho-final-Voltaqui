import { ACHADOS_EXEMPLO, SOLICITACOES_EXEMPLO } from '../data/exemplos'

const CHAVES = {
  achados: 'voltaqui:achados',
  solicitacoes: 'voltaqui:solicitacoes',
  contas: 'voltaqui:contas',
  ultimoNumero: 'voltaqui:ultimoNumero',
  sessao: 'voltaqui:sessao',
  leituras: 'voltaqui:notificacoesLidas',
  tema: 'voltaqui:tema',
}

export const CHAVES_DE_DADOS = [CHAVES.achados, CHAVES.solicitacoes, CHAVES.leituras]

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

export class ArmazenamentoCheio extends Error {
  constructor() {
    super('O armazenamento do navegador está cheio.')
    this.name = 'ArmazenamentoCheio'
  }
}

function ler(chave, padrao, area = localStorage) {
  try {
    const valor = area.getItem(chave)
    return valor === null ? padrao : JSON.parse(valor)
  } catch {
    return padrao
  }
}

function gravar(chave, valor, area = localStorage) {
  try {
    area.setItem(chave, JSON.stringify(valor))
  } catch (erro) {
    if (erro.name === 'QuotaExceededError') throw new ArmazenamentoCheio()
    throw erro
  }
}

function lista(chave) {
  const valor = ler(chave, [])
  return Array.isArray(valor) ? valor : []
}

function gerarId() {
  return crypto.randomUUID()
}

function agora() {
  return new Date().toISOString()
}

const ULTIMO_NUMERO_EXEMPLO = Math.max(...ACHADOS_EXEMPLO.map((a) => a.numero))

function chaveValida(chave) {
  return Array.isArray(ler(chave, null))
}

export function inicializarDados() {
  if (!chaveValida(CHAVES.achados)) {
    gravar(CHAVES.achados, ACHADOS_EXEMPLO)
    gravar(CHAVES.ultimoNumero, Math.max(ULTIMO_NUMERO_EXEMPLO, Number(ler(CHAVES.ultimoNumero, 0)) || 0))
  }
  if (!chaveValida(CHAVES.solicitacoes)) gravar(CHAVES.solicitacoes, SOLICITACOES_EXEMPLO)
  if (!chaveValida(CHAVES.contas)) gravar(CHAVES.contas, [])
}

export function restaurarExemplos() {
  gravar(CHAVES.achados, ACHADOS_EXEMPLO)
  gravar(CHAVES.solicitacoes, SOLICITACOES_EXEMPLO)
  gravar(CHAVES.leituras, {})
  return true
}

export function listarAchados() {
  return lista(CHAVES.achados)
}

export function criarAchado(dados) {
  const achados = listarAchados()

  const maiorNaLista = achados.reduce((maior, a) => Math.max(maior, a.numero ?? 0), 0)
  const numero = Math.max(maiorNaLista, Number(ler(CHAVES.ultimoNumero, 0)) || 0) + 1

  const achado = {
    ...dados,
    id: gerarId(),
    numero,
    status: STATUS_ACHADO.DISPONIVEL,
    criadoEm: agora(),
    atualizadoEm: agora(),
  }
  gravar(CHAVES.achados, [...achados, achado])
  gravar(CHAVES.ultimoNumero, numero)
  return achado
}

export function atualizarAchado(id, alteracoes) {
  let atualizado = null
  const achados = listarAchados().map((achado) => {
    if (achado.id !== id) return achado
    atualizado = { ...achado, ...alteracoes, id, atualizadoEm: agora() }
    return atualizado
  })
  if (atualizado) gravar(CHAVES.achados, achados)
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
  return true
}

export function listarSolicitacoes() {
  return lista(CHAVES.solicitacoes)
}

function solicitacoesDoAchado(achadoId) {
  return listarSolicitacoes().filter((s) => s.achadoId === achadoId)
}

export function motivoParaNaoPedir(achado, solicitacoes, alunoId) {
  if (!achado) return 'inexistente'
  if (achado.status === STATUS_ACHADO.DEVOLVIDO) return 'devolvido'
  const doAchado = solicitacoes.filter((s) => s.achadoId === achado.id)
  if (doAchado.some((s) => s.alunoId === alunoId)) return 'ja-pediu'
  if (doAchado.some((s) => s.status === STATUS_SOLICITACAO.APROVADA)) return 'reservado'
  return null
}

export function criarSolicitacao({ achadoId, alunoId, alunoNome, descricaoDono }) {
  const achado = listarAchados().find((a) => a.id === achadoId)
  if (motivoParaNaoPedir(achado, listarSolicitacoes(), alunoId)) return null

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

function atualizarSolicitacoes(mudar) {
  const solicitacoes = listarSolicitacoes().map((s) => mudar(s) ?? s)
  gravar(CHAVES.solicitacoes, solicitacoes)
  return solicitacoes
}

export function aprovarSolicitacao(id) {
  const pedido = listarSolicitacoes().find((s) => s.id === id)
  if (!pedido || pedido.status !== STATUS_SOLICITACAO.PENDENTE) return null
  const doAchado = solicitacoesDoAchado(pedido.achadoId)
  if (doAchado.some((s) => s.status === STATUS_SOLICITACAO.APROVADA)) return null

  const momento = agora()
  const solicitacoes = atualizarSolicitacoes((s) => {
    if (s.id === id) return { ...s, status: STATUS_SOLICITACAO.APROVADA, analisadaEm: momento }
    if (s.achadoId === pedido.achadoId && s.status === STATUS_SOLICITACAO.PENDENTE) {
      return { ...s, status: STATUS_SOLICITACAO.RECUSADA, analisadaEm: momento, motivo: 'outro-aprovado' }
    }
    return null
  })
  return solicitacoes.find((s) => s.id === id)
}

export function recusarSolicitacao(id) {
  const pedido = listarSolicitacoes().find((s) => s.id === id)
  if (!pedido || pedido.status !== STATUS_SOLICITACAO.PENDENTE) return null

  const solicitacoes = atualizarSolicitacoes((s) =>
    s.id === id ? { ...s, status: STATUS_SOLICITACAO.RECUSADA, analisadaEm: agora() } : null,
  )

  const aindaEmAnalise = solicitacoes.some(
    (s) =>
      s.achadoId === pedido.achadoId &&
      (s.status === STATUS_SOLICITACAO.PENDENTE || s.status === STATUS_SOLICITACAO.APROVADA),
  )
  if (!aindaEmAnalise) {
    atualizarAchado(pedido.achadoId, { status: STATUS_ACHADO.DISPONIVEL })
  }
  return solicitacoes.find((s) => s.id === id)
}

export function marcarDevolvido(achadoId) {
  const aprovado = solicitacoesDoAchado(achadoId).some((s) => s.status === STATUS_SOLICITACAO.APROVADA)
  if (!aprovado) return null
  return atualizarAchado(achadoId, { status: STATUS_ACHADO.DEVOLVIDO, devolvidoEm: agora() })
}

export function listarContas() {
  return lista(CHAVES.contas)
}

export function criarConta(dados) {
  const conta = { ...dados, id: gerarId(), criadaEm: agora() }
  gravar(CHAVES.contas, [...listarContas(), conta])
  return conta
}

export function lerSessao() {
  const sessao = ler(CHAVES.sessao, null, sessionStorage)
  return sessao && typeof sessao === 'object' && sessao.id ? sessao : null
}

export function salvarSessao(usuario) {
  gravar(CHAVES.sessao, usuario, sessionStorage)
}

export function limparSessao() {
  sessionStorage.removeItem(CHAVES.sessao)
}

export function lerUltimaLeitura(usuarioId) {
  return ler(CHAVES.leituras, {})[usuarioId] ?? null
}

export function marcarNotificacoesLidas(usuarioId) {
  const leituras = ler(CHAVES.leituras, {})
  gravar(CHAVES.leituras, { ...leituras, [usuarioId]: agora() })
}

// ---------- tema (claro ou escuro) ----------

// Devolve 'claro', 'escuro' ou null (a pessoa ainda não escolheu).
export function lerTema() {
  const tema = ler(CHAVES.tema, null)
  return tema === 'claro' || tema === 'escuro' ? tema : null
}

export function salvarTema(tema) {
  try {
    gravar(CHAVES.tema, tema)
  } catch {
  }
  gravar(CHAVES.tema, tema)
}
