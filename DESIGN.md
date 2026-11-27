# Voltaqui: design

Direção: confiança e organização, com calor humano. Parte da marca que a equipe já definiu (logo, tokens e Figma).

Os valores valem como estão em `src/styles/tokens.css`. O `prototipo/css/tokens.css` fica como registro do protótipo em HTML e não é mais atualizado.

## Cor (`src/styles/tokens.css`)

| Token | Valor | Papel |
|---|---|---|
| `--cor-marca` | #0F172A | fundos escuros (abertura, chamada final) |
| `--cor-destaque` | #01D091 | botão primário, números dos passos, destaque no título |
| `--cor-link` | #007A55 | links e etiquetas de seção em fundo claro (5:1) |
| `--cor-destaque-suave` | #E6FAF3 | fundo dos ícones |
| `--cor-laranja` | #FE8302 | só fundo (botão Demonstração, contadores), nunca texto |
| `--cor-fundo` / `--cor-superficie` | #F8FAFC / #FFFFFF | seções alternadas |
| `--cor-texto` / `--cor-texto-secundario` | #0F172A / #475569 | texto principal e de apoio |
| `--cor-borda-sobre-marca` | #94A3B8 | borda de botão sobre fundo escuro |
| `--cor-ponto-sobre-marca` | branco 6% | pontinhos do fundo da abertura |
| `--cor-hover-sobre-marca` | branco 8% | hover do botão claro sobre fundo escuro |
| `--cor-destaque-sobre-marca-fundo` / `-borda` | verde 12% / 35% | etiqueta da abertura |
| `--cor-fundo-modal` | azul 55% | fundo atrás da caixa de confirmação |
| `--cor-trilho` | azul 8% | trilho da barra de semelhança |
| `--anel-foco` / `--anel-foco-erro` | verde 45% / vermelho 25% | anel de foco dos campos |

Texto no botão verde é sempre azul escuro (8,9:1). Branco no verde não passa no contraste.

O verde `#01D091` só aparece como texto sobre fundo escuro. Em fundo branco ou `#F8FAFC` ele dá 2,0:1, então texto e ícones usam `--cor-link` (`#007A55`, 5,1:1).

## Tipografia

Montserrat 600/700 nos títulos, Inter 400/500/600 no texto. As fontes ficam no projeto (`public/fontes`, declaradas em `src/styles/fontes.css`), sem Google Fonts. Corpo 16px+, parágrafos até ~52 caracteres de largura (`ch`).

Escala: título da abertura `clamp(2.5rem, 5.5vw, 4rem)`, título de seção `clamp(1.75rem, 3vw, 2.5rem)`, subtítulo 1.125rem, corpo 1rem, etiqueta 0.875rem.

## Espaço, forma e profundidade

- Espaços: 4, 8, 12, 16, 24, 32, 48, 64, 96px (`--esp-*`). Seção: 96px (64px no celular). Largura do conteúdo: 1120px (`--largura-conteudo`).
- Raios: 8px em campos e botões (`--raio-md`), 12px em cards (`--raio-lg`) e total (`--raio-full`) só em chips e selos de status. O 6px (`--raio-sm`) fica para detalhes pequenos, como o realce de palavras. Sombras: `--elevacao-sm` nos cards do painel, `--elevacao-lg` no cartão da abertura. Os cards da lista de achados não têm sombra, só borda.
- Padrão de pontos sutis (6% branco) só no fundo da abertura. Sem gradientes, sem vidro.

## Componentes

- Botão primário verde, secundário branco com borda; sobre fundo escuro, usa `.botao-sobre-marca` (transparente com borda clara, em `componentes.css`). Foco sempre visível (anel).
- Cabeçalho fixo no topo, branco, com borda inferior. Até 768px: some o menu e o "Criar conta".
- Problema: título e um parágrafo, seção mais curta (64px). Passos: números em círculo ligados por linha (só no desktop).
- Para quem: 2 cards (Secretaria e Aluno) com ícone + título separados da lista por uma linha; itens com ícone de check.
- Segurança: texto à esquerda, exemplo à direita (`1fr 1fr`); vira 1 coluna até 768px.
- Card de exemplo da segurança: parte pública com borda contínua, parte oculta com fundo cinza e borda tracejada.
- Chamada final: fundo azul da marca, centralizada, sem pontinhos.
- Rodapé: logo, texto do projeto (de onde veio e para quem é) e links; empilha até 768px.
- Etiqueta de seção em caixa-alta pequena acima do `<h2>` só em Como funciona e Segurança (não usar em fundo escuro: o verde #007A55 não tem contraste lá).
- Selo de status (`SeloStatus`, classe `.selo`): disponível, em análise, devolvido, pendente, aprovada, recusada.

## Imagens e ícones

Ícones Lucide em SVG inline (`aria-hidden`), traço 2px, cor `currentColor`. Cartão de achado inclinado -4° é a marca visual da página (mesmo do login).

## Grafia

Nos textos, sempre **Voltaqui**. O desenho do logo escreve "voltAqui" com o A destacado: é só o estilo do logo, não outra grafia.
