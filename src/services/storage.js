// Toda leitura e gravação no navegador passa por aqui.
// Nenhum outro arquivo usa localStorage ou sessionStorage diretamente.

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

// Chaves que guardam os dados compartilhados entre as abas (usado pelo DadosProvider).
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

// Erro de quando o armazenamento do navegador (uns 5 MB) está cheio.
export class ArmazenamentoCheio extends Error {
  constructor() {
    super('O armazenamento do navegador está cheio.')
    this.name = 'ArmazenamentoCheio'
  }
}

// ---------- utilitários internos ----------

// Texto inválido na chave (alguém mexeu pelo DevTools, por exemplo) vira "padrao".
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

// ---------- dados de exemplo ----------

const ULTIMO_NUMERO_EXEMPLO = Math.max(...ACHADOS_EXEMPLO.map((a) => a.numero))

// Uma chave está "boa" se existe e é uma lista. Faltando ou com texto
// inválido, ela volta para os dados de exemplo e o site abre normalmente.
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

// Volta achados e pedidos para os exemplos (útil antes da apresentação).
// As contas criadas continuam. O contador de números não volta para trás,
// para um número já impresso numa etiqueta nunca ser usado de novo.
export function restaurarExemplos() {
  gravar(CHAVES.achados, ACHADOS_EXEMPLO)
  gravar(CHAVES.solicitacoes, SOLICITACOES_EXEMPLO)
  gravar(CHAVES.leituras, {})
  return true
}

// ---------- achados ----------

// Formato de um achado:
// {
//   id, numero (Nº 0158), categoria (id de data/categorias.js), descricao (pública),
//   detalheOculto (só a secretaria vê), local (nome digitado), dataEncontrado ('AAAA-MM-DD'),
//   foto (opcional), status ('disponivel' | 'em_analise' | 'devolvido'),
//   criadoEm, atualizadoEm e devolvidoEm (data e hora ISO)
// }

export function listarAchados() {
  return lista(CHAVES.achados)
}

export function criarAchado(dados) {
  const achados = listarAchados()

  // O número nunca se repete, nem se o último achado for excluído.
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

// ---------- solicitações de devolução ----------

// Formato de uma solicitação:
// {
//   id, achadoId, alunoId, alunoNome, descricaoDono (o que o aluno escreveu),
//   status ('pendente' | 'aprovada' | 'recusada'), criadaEm, analisadaEm (ou null),
//   motivo ('outro-aprovado' quando foi recusada porque a secretaria aprovou outro aluno)
// }

export function listarSolicitacoes() {
  return lista(CHAVES.solicitacoes)
}

function solicitacoesDoAchado(achadoId) {
  return listarSolicitacoes().filter((s) => s.achadoId === achadoId)
}

// O aluno pode pedir este achado? Devolve o motivo do "não" ou null.
// Regras:
// - achado devolvido ou com pedido aprovado (esperando retirada): ninguém pede mais;
// - cada aluno pede o mesmo achado uma vez só. Se for recusado, não pode tentar de novo,
//   senão daria para chutar detalhes até acertar. Ele fala com a secretaria.
// Enquanto os pedidos estão só pendentes, outro aluno ainda pode pedir:
// a secretaria compara e aprova o dono.
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

// Muda várias solicitações de uma vez e grava uma vez só.
function atualizarSolicitacoes(mudar) {
  const solicitacoes = listarSolicitacoes().map((s) => mudar(s) ?? s)
  gravar(CHAVES.solicitacoes, solicitacoes)
  return solicitacoes
}

// Aprovar um pedido recusa os outros pendentes do mesmo achado (só existe um dono).
// Se o achado já tem um pedido aprovado, não aprova outro.
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

  // Sem outro pedido pendente ou aprovado, o achado volta a ficar disponível.
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

// Só dá para marcar como devolvido um achado com pedido aprovado.
export function marcarDevolvido(achadoId) {
  const aprovado = solicitacoesDoAchado(achadoId).some((s) => s.status === STATUS_SOLICITACAO.APROVADA)
  if (!aprovado) return null
  // devolvidoEm guarda o momento da entrega (aparece no comprovante).
  return atualizarAchado(achadoId, { status: STATUS_ACHADO.DEVOLVIDO, devolvidoEm: agora() })
}

// ---------- contas de aluno criadas no site ----------

export function listarContas() {
  return lista(CHAVES.contas)
}

export function criarConta(dados) {
  const conta = { ...dados, id: gerarId(), criadaEm: agora() }
  gravar(CHAVES.contas, [...listarContas(), conta])
  return conta
}

// ---------- sessão (login simulado) ----------

// A sessão fica no sessionStorage: cada aba tem o seu login.
// Assim dá para abrir a secretaria numa aba e o aluno em outra, e recarregar
// uma delas não troca de usuário. Fechou a aba, saiu da conta.
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

// ---------- tema (claro ou escuro) ----------

// Devolve 'claro', 'escuro' ou null (a pessoa ainda não escolheu).
export function lerTema() {
  const tema = ler(CHAVES.tema, null)
  return tema === 'claro' || tema === 'escuro' ? tema : null
}

export function salvarTema(tema) {
  gravar(CHAVES.tema, tema)
}
