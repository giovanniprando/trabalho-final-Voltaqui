# Protótipo Voltaqui — HTML e CSS

Aqui construímos **todas as páginas em HTML e CSS puros**, passo a passo.
Depois cada página é convertida para React (pasta `src/`), reaproveitando o CSS.
O React continua sendo a versão final (exigência do professor).

Para ver uma página: clique direito no `.html` no VS Code → **Open with Live Server**.

## Arquivos

```
prototipo/
├── login.html
├── criar-conta.html                   (só alunos; pede o código da escola)
├── secretaria-painel.html
├── secretaria-achados.html            (inclui o modal de excluir)
├── secretaria-cadastrar-achado.html   (também serve de "editar")
├── secretaria-solicitacoes.html
├── aluno-achados.html                 (inclui o estado "sem resultados")
├── aluno-detalhe-achado.html
├── aluno-solicitar-devolucao.html
├── aluno-minhas-solicitacoes.html
└── css/
    ├── tokens.css        cores, espaços, raios, sombras e fontes (do Figma)
    ├── base.css          regras que valem para tudo
    ├── componentes.css   peças repetidas: botão, campo, alerta, badge, card...
    ├── autenticacao.css  moldura igual do login e do criar conta
    ├── layout.css        barra lateral + área de conteúdo
    └── <página>.css      um arquivo por página, mesmo nome do .html
```

Cada `.html` já tem o `<head>` pronto e, no `<body>`, um comentário
dizendo quais blocos construir. Cada `.css` de página começa vazio.

**Ordem dos CSS no `<head>`:** tokens → base → componentes → layout → página.
Se duas regras empatam, vale a do arquivo que vem depois.

## O que vai em cada página

Páginas internas têm a estrutura comum (barra lateral do perfil + área de conteúdo) e, dentro dela, estes blocos:

### Buscar achados — `aluno-achados.html`
Figma: Telas — Aluno (ainda não desenhada). Menu da barra lateral: Buscar achados, Minhas solicitações e, embaixo, Sair.

```
1. Cabeçalho da página: título "Achados" + frase
   (ex.: "Perdeu algo? Veja se já foi encontrado.").
2. Campo de busca grande.
3. Chips de categoria (componente Chip/Filtro), um marcado como ativo.
4. Grade de cards de achado (componente Card/Achado):
   ícone da categoria, descrição, local, data e Badge/Status.
   Cada card leva para aluno-detalhe-achado.html.
5. Estado "sem resultados": ícone, "Nenhum achado encontrado"
   e sugestão (ex.: "Tente outra categoria").
   No protótipo, deixe este bloco escondido com uma classe.
```

### Detalhe do achado — `aluno-detalhe-achado.html`
Figma: Telas — Aluno (ainda não desenhada). Menu da barra lateral: Buscar achados, Minhas solicitações e, embaixo, Sair.

```
1. Link "Voltar para achados".
2. Card do achado:
   - ícone grande da categoria
   - descrição pública
   - local, data em que foi encontrado, Badge/Status
   - NÃO mostrar o detalhe oculto (só a secretaria vê)
3. Caixa explicando como funciona a devolução.
4. Botão primário "Solicitar devolução"
   (link para aluno-solicitar-devolucao.html).
```

### Minhas solicitações — `aluno-minhas-solicitacoes.html`
Figma: Telas — Aluno (ainda não desenhada). Menu da barra lateral: Buscar achados, Minhas solicitações e, embaixo, Sair.

```
1. Cabeçalho da página: título "Minhas solicitações".
2. Lista de solicitações do aluno, cada uma com:
   - achado (ícone + descrição) e data do pedido
   - Badge/Status: Pendente, Aprovada ou Recusada
   - mensagem por status:
       Pendente: "Aguardando análise da secretaria"
       Aprovada: "Retire seu objeto na secretaria"
       Recusada: "Os detalhes não conferiram"
3. Estado vazio: "Você ainda não fez nenhuma solicitação"
   + link para buscar achados.
```

### Solicitar devolução — `aluno-solicitar-devolucao.html`
Figma: Telas — Aluno (ainda não desenhada). Menu da barra lateral: Buscar achados, Minhas solicitações e, embaixo, Sair.

```
1. Cabeçalho da página: título "Solicitar devolução".
2. Resumo do achado (mini card: ícone, descrição, local).
3. Formulário:
   - textarea "Descreva um detalhe que só o dono saberia"
     (mínimo 10 caracteres) + texto de ajuda
     (ex.: cor de um adesivo, o que tinha dentro, um arranhão)
4. Alerta informativo: "A secretaria vai analisar seu pedido".
5. Botões: Cancelar e Enviar solicitação.
```

### Achados — `secretaria-achados.html`
Figma: 03 Achados + 06 Excluir achado. Menu da barra lateral: Painel, Achados, Cadastrar achado, Solicitações e, embaixo, Sair.

```
1. Cabeçalho da página: título "Achados" + botão primário
   "Cadastrar achado" (link para secretaria-cadastrar-achado.html).
2. Barra de busca e filtros:
   - campo de busca por descrição
   - seleção de categoria, local e status
3. Tabela (componentes Tabela/Cabeçalho e Tabela/Linha):
   colunas Categoria | Descrição | Local | Data | Status | Ações
   - Status com Badge/Status (Disponível, Em análise, Devolvido)
   - Ações: botões de ícone Editar e Excluir
4. Modal de confirmação de exclusão (Modal/Confirmação):
   "Excluir achado?" + aviso + botões Cancelar e Excluir.
   Dica: no protótipo, deixe o modal no HTML e use uma classe
   para mostrar/esconder enquanto estiliza.
```

### Cadastrar achado — `secretaria-cadastrar-achado.html`
Figma: 04 Cadastrar achado + 05 Editar achado. Menu da barra lateral: Painel, Achados, Cadastrar achado, Solicitações e, embaixo, Sair.

```
1. Cabeçalho da página: título "Cadastrar achado"
   (a mesma página serve para "Editar achado", só muda o título).
2. Formulário em card:
   - Categoria (select)
   - Descrição pública (textarea): o que todos podem ver
   - Detalhe oculto (textarea): algo que só o dono saberia;
     texto de ajuda explicando que só a secretaria vê
   - Local onde foi encontrado (select)
   - Data em que foi encontrado (input type="date")
3. Um campo no estado de ERRO, como no Figma
   (borda vermelha + mensagem embaixo).
4. Botões: Cancelar (secundário) e Salvar achado (primário).
```

### Painel — `secretaria-painel.html`
Figma: 02 Painel. Menu da barra lateral: Painel, Achados, Cadastrar achado, Solicitações e, embaixo, Sair.

```
1. Cabeçalho da página: título "Painel" + frase de apoio
   (ex.: "Resumo dos achados e solicitações").
2. Grade com 4 cards indicadores (componente Card/Indicador):
   - Achados disponíveis
   - Em análise
   - Solicitações pendentes
   - Devolvidos
   Cada card: ícone, número grande e rótulo.
3. Lista "Solicitações recentes" (as últimas pendentes),
   com link "Ver todas" para secretaria-solicitacoes.html.
```

### Solicitações — `secretaria-solicitacoes.html`
Figma: 07 Solicitações (ainda não desenhada). Menu da barra lateral: Painel, Achados, Cadastrar achado, Solicitações e, embaixo, Sair.

```
1. Cabeçalho da página: título "Solicitações".
2. Abas: Pendentes | Aprovadas | Recusadas
   (no protótipo, uma aba fica marcada como ativa).
3. Cards de solicitação (componente Card/Solicitação):
   - qual achado (ícone da categoria + descrição)
   - nome do aluno e data do pedido
   - LADO A LADO: "Descrição do aluno" x "Detalhe oculto"
     (é assim que a secretaria confere se é o dono)
   - Pendente: botões Recusar e Aprovar
   - Aprovada: botão "Marcar como devolvido"
   - Badge/Status em cada card
```

## Ordem de construção

- [x] **Fase 1 — Entrada**: `login.html` e `criar-conta.html` prontos
  (base.css, componentes.css e autenticacao.css preenchidos)
- [ ] **Fase 2 — Estrutura comum** (`layout.css`): barra lateral e cabeçalho da página
- [ ] **Fase 3 — Secretaria**: painel → achados → cadastrar/editar → solicitações
- [ ] **Fase 4 — Aluno**: buscar achados → detalhe → solicitar devolução → minhas solicitações
- [ ] **Fase 5 — Conversão para React**: `class` → `className`, `for` → `htmlFor`, ligar estados

## Regras do protótipo

- Validação sem JavaScript: `required`, `type="email"`, `minlength` e `pattern`
  no HTML; no CSS, `:user-invalid` pinta o campo e `:has()` mostra a mensagem.
  O que o HTML não consegue (ex.: "as senhas são iguais?") fica para o React.

- Só HTML e CSS. Estados que dependem de clique (modal aberto, aba ativa,
  erro, "sem resultados") ficam escritos no HTML, com uma classe para mostrar
  ou esconder enquanto estilizamos.
- Arquivos de código sem comentários (decisão do Giba); as explicações ficam neste README.
- Cores, espaços e fontes sempre com `var(--token)`, nunca `#hex` solto.
- Se uma peça aparece em mais de uma página, o estilo dela vai em `componentes.css`.
