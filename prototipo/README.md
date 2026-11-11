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
- Cores, espaços e fontes sempre com `var(--token)`, nunca `#hex` solto.
- Se uma peça aparece em mais de uma página, o estilo dela vai em `componentes.css`.
