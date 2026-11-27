import { afterEach, describe, expect, test, vi } from 'vitest'
import { dataLocal, diasDesde, formatarData, hojeISO, protocoloDevolucao } from './datas'
import { normalizar } from './formatar'
import { problemaNaFoto } from './imagem'
import { ordenarAchados } from './ordenar'
import { ordenarParecidos, pontuarAchado } from './parecidos'
import { compararDescricoes, palavrasChave } from './semelhanca'
import { validarAchado, validarSolicitacao } from './validacao'

afterEach(() => {
  vi.useRealTimers()
})

describe('datas (fuso de São Paulo)', () => {
  test('20/10 continua 20/10, sem voltar um dia', () => {
    expect(formatarData('2026-10-20')).toBe('20/10/2026')
    expect(dataLocal('2026-10-20').getDate()).toBe(20)
  })

  test('registro salvo às 21h30 aparece no dia certo', () => {
    expect(formatarData('2026-11-26T00:30:00.000Z')).toBe('25/11/2026')
    expect(protocoloDevolucao(161, '2026-11-26T00:30:00.000Z')).toBe('VQ-20261125-0161')
  })

  test('hoje depois das 21h ainda é hoje', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-11-25T21:30:00-03:00'))
    expect(hojeISO()).toBe('2026-11-25')
  })

  test('dias desde a data em que o achado chegou', () => {
    const hoje = dataLocal('2026-11-25')
    expect(diasDesde('2026-11-25', hoje)).toBe(0)
    expect(diasDesde('2026-11-24', hoje)).toBe(1)
    expect(diasDesde('2026-10-21', hoje)).toBe(35)
  })
})

describe('busca', () => {
  test('ignora acento, maiúscula e espaço sobrando', () => {
    for (const termo of ['TERMICA', 'térmica', ' termica ']) {
      expect(normalizar(termo)).toBe('termica')
    }
  })
})

describe('semelhança', () => {
  test('ignora palavras vazias, acento e maiúscula', () => {
    expect(palavrasChave('Adesivo de banda NA BASE.')).toEqual(['adesivo', 'banda', 'base'])
    expect(palavrasChave('a o de da do na no em um uma com para e')).toEqual([])
  })

  test('pedido parecido com o detalhe dá semelhança alta', () => {
    const r = compararDescricoes('Tem um adesivo de uma banda na parte de baixo', 'Adesivo de banda na base.')
    expect(r.nivel).toBe('alta')
    expect(r.emComum).toEqual(['adesivo', 'banda'])
  })

  test('texto vazio não quebra a conta', () => {
    expect(compararDescricoes('', '').proporcao).toBe(0)
    expect(compararDescricoes('qualquer coisa', '').nivel).toBe('baixa')
  })

  test('copiar a descrição pública não dá pontos', () => {
    const r = compararDescricoes('garrafa azul', 'Garrafa azul com tampa riscada', 'Garrafa térmica azul, 500 ml')
    expect(r.emComum).toEqual([])
    expect(r.publicas).toEqual(['garrafa', 'azul'])
    expect(r.total).toBe(2)
  })
})

describe('parecidos ("Perdeu algo?")', () => {
  const garrafaPatio = { categoria: 'garrafas', local: 'Pátio', dataEncontrado: '2026-10-21' }
  const casaco = { categoria: 'roupas', local: 'Sala de aula', dataEncontrado: '2026-11-08' }

  test('mesma categoria, mesmo local e encontrado logo depois somam 7 pontos', () => {
    expect(pontuarAchado(garrafaPatio, { categoria: 'garrafas', local: 'patio', data: '2026-10-20' })).toBe(7)
  })

  test('achado encontrado antes da perda não conta', () => {
    expect(pontuarAchado(garrafaPatio, { categoria: 'garrafas', local: '', data: '2026-10-25' })).toBe(0)
  })

  test('os que não combinam em nada ficam de fora', () => {
    const lista = ordenarParecidos([casaco, garrafaPatio], { categoria: 'garrafas', local: '', data: '' })
    expect(lista.map((item) => item.achado)).toEqual([garrafaPatio])
  })
})

describe('ordenação', () => {
  const a = { numero: 1, dataEncontrado: '2026-10-01' }
  const b = { numero: 2, dataEncontrado: '2026-11-01' }
  const c = { numero: 3, dataEncontrado: '2026-11-01' }

  test('mais recentes primeiro, com o número desempatando', () => {
    expect(ordenarAchados([a, b, c], 'recentes')).toEqual([c, b, a])
  })

  test('não mexe na lista original', () => {
    const lista = [a, b, c]
    ordenarAchados(lista, 'recentes')
    expect(lista).toEqual([a, b, c])
  })
})

describe('validações', () => {
  test('pedido curto, com espaços nas pontas ou só com números é recusado', () => {
    expect(validarSolicitacao({ descricaoDono: 'curto' }).descricaoDono).toBeTruthy()
    expect(validarSolicitacao({ descricaoDono: '     abc      ' }).descricaoDono).toBeTruthy()
    expect(validarSolicitacao({ descricaoDono: '1234567890' }).descricaoDono).toBeTruthy()
    expect(validarSolicitacao({ descricaoDono: 'abcdefghij' })).toEqual({})
  })

  test('data no futuro não passa; hoje passa', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-11-25T21:30:00-03:00'))
    const base = { categoria: 'garrafas', local: 'Cantina', descricao: 'Garrafa azul de metal', detalheOculto: 'Adesivo na base' }
    expect(validarAchado({ ...base, dataEncontrado: '2026-11-25' })).toEqual({})
    expect(validarAchado({ ...base, dataEncontrado: '2026-11-26' }).dataEncontrado).toBeTruthy()
  })

  test('foto: só JPG, PNG, WEBP ou GIF de até 15 MB', () => {
    expect(problemaNaFoto({ name: 'IMG_1.HEIC', type: 'image/heic', size: 2000 })).toMatch('HEIC')
    expect(problemaNaFoto({ name: 'notas.pdf', type: 'application/pdf', size: 2000 })).toMatch('não é uma foto')
    expect(problemaNaFoto({ name: 'grande.jpg', type: 'image/jpeg', size: 16 * 1024 * 1024 })).toMatch('15 MB')
    expect(problemaNaFoto({ name: 'foto.jpg', type: 'image/jpeg', size: 3 * 1024 * 1024 })).toBeNull()
  })
})
