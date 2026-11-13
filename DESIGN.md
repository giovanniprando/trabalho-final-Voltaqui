# Voltaqui — Design

Direção: confiança e organização, com calor humano. Não foi comparada com sites reais (UXKIN não estava conectado); parte da marca que a equipe já definiu (logo, tokens e Figma).

## Cor (`prototipo/css/tokens.css`)

| Token | Valor | Papel |
|---|---|---|
| `--cor-marca` | #0F172A | fundos escuros (abertura, chamada final) |
| `--cor-destaque` | #01D091 | botão primário, números dos passos, destaque no título |
| `--cor-link` | #007A55 | links e etiquetas de seção em fundo claro (5:1) |
| `--cor-destaque-suave` | #E6FAF3 | fundo dos ícones |
| `--laranja-marca` | #FE8302 | só decorativo, nunca texto |
| `--cor-fundo` / `--cor-superficie` | #F8FAFC / #FFFFFF | seções alternadas |
| `--cor-texto` / `--cor-texto-secundario` | #0F172A / #475569 | texto principal e de apoio |
| `--cor-borda-sobre-marca` | #94A3B8 | borda de botão sobre fundo escuro |
| `--cor-ponto-sobre-marca` | branco 6% | pontinhos do fundo da abertura |
| `--cor-hover-sobre-marca` | branco 8% | hover do botão claro sobre fundo escuro |
| `--cor-destaque-sobre-marca-fundo` / `-borda` | verde 12% / 35% | etiqueta da abertura |

Texto no botão verde é sempre azul escuro (8,9:1). Branco no verde não passa no contraste.

## Tipografia

Montserrat 600/700 nos títulos, Inter 400/500/600 no texto. Corpo 16px+, parágrafos até ~52 caracteres de largura (`ch`).

Escala: título da abertura `clamp(2.5rem, 5.5vw, 4rem)`, título de seção `clamp(1.75rem, 3vw, 2.5rem)`, subtítulo 1.125rem, corpo 1rem, etiqueta 0.875rem.

## Espaço, forma e profundidade

- Espaços: 4, 8, 12, 16, 24, 32, 48, 64, 96px (`--esp-*`). Seção: 96px (64px no celular). Largura do conteúdo: 1120px (`--largura-conteudo`).
- Raios: 6, 10, 16 e total. Sombras: `--elevacao-sm` nos cards, `--elevacao-lg` no cartão da abertura.
- Padrão de pontos sutis (6% branco) só no fundo da abertura. Sem gradientes, sem vidro.

## Componentes

- Botão primário verde, secundário branco com borda; sobre fundo escuro, usa `.botao-sobre-marca` (transparente com borda clara, em `componentes.css`). Foco sempre visível (anel).
- Cabeçalho fixo no topo, branco, com borda inferior. Até 768px: some o menu e o "Criar conta".
- Cards do problema: ícone em quadrado suave + título + texto. Passos: números em círculo ligados por linha (só no desktop).
- Para quem: 2 cards (Secretaria e Aluno) com ícone + título separados da lista por uma linha; itens com ícone de check.
- Segurança e Sobre: texto à esquerda, conteúdo à direita (`1fr 1fr` e `5fr 7fr`); viram 1 coluna até 768px.
- Card de exemplo da segurança: parte pública com borda contínua, parte oculta com fundo cinza e borda tracejada.
- Chamada final: fundo azul da marca, centralizada, sem pontinhos.
- Rodapé: logo, texto do projeto e links; empilha até 768px.
- Etiqueta de seção em caixa-alta pequena acima do `<h2>` (não usar em fundo escuro: o verde #007A55 não tem contraste lá).

## Imagens e ícones

Ícones Lucide em SVG inline (`aria-hidden`), traço 2px, cor `currentColor`. Cartão de achado inclinado -4° é a marca visual da página (mesmo do login).

## Pendências

- Grafia: logo usa "voltAqui", textos usam "Voltaqui".
- Tela da homepage no Figma.
