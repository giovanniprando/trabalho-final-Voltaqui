# Voltaqui

**Se é seu, merece voltar.**

Plataforma de achados e perdidos para escolas. A secretaria cadastra o que foi encontrado, o aluno procura pelo celular e pede a devolução, e o objeto só volta para quem prova que é o dono, descrevendo um detalhe que só o dono sabe.

Projeto final do 2º semestre de Desenvolvimento de Sistemas do SENAI.

- **Site publicado:** _link da Vercel aqui_
- **Protótipo no Figma:** https://www.figma.com/design/9VvQYqwe6htzgoCILIAoR3/Voltaqui-%E2%80%94-Design-System-e-Telas

## O problema

Na escola, o que se perde vai parar numa caixa na secretaria. Quem perdeu não sabe que o objeto está lá, a caixa enche e ninguém confere se quem foi buscar é mesmo o dono.

## Como funciona

1. **A secretaria cadastra o achado**: categoria, local, data, uma descrição pública e um **detalhe oculto** (por exemplo: "adesivo de banda na base").
2. **O aluno encontra na lista** e abre o pedido de devolução, descrevendo um detalhe do objeto.
3. **A secretaria compara** o que o aluno escreveu com o detalhe oculto e aprova ou recusa.
4. **O aluno retira** na secretaria e o achado é marcado como devolvido.

Cada achado recebe um número (Nº 0158) e uma etiqueta para imprimir e prender no objeto.

## Funcionalidades

**Aluno**
- Criar conta com o código da escola (cada escola tem o seu; o do SENAI é `SN7K2P`)
- Buscar achados por texto (sem precisar de acento) e filtrar por categoria
- Ver o detalhe do achado e pedir a devolução
- Acompanhar os pedidos: pendente, aprovado (com instruções de retirada) ou recusado
- "Perdeu algo?": informa o que perdeu, onde e quando, e vê os achados mais parecidos primeiro
- Sino de notificações quando a secretaria aprova ou recusa um pedido
- Ordenar a lista (mais recentes, há mais tempo na secretaria ou pelo número)

**Secretaria**
- Painel com números do dia, pedidos esperando análise, locais onde mais se perde e itens parados há mais tempo
- Cadastrar, editar e excluir achados, com validação dos campos e contador de caracteres
- Local digitável (cada escola tem os seus lugares), com sugestões dos locais já usados
- Foto em miniatura do achado, reduzida para poucos KB antes de salvar
- "Há 12 dias aqui" em cada achado, com cor que muda conforme o tempo
- Pontuação de semelhança: compara o que o aluno escreveu com o detalhe oculto e marca as palavras em comum
- Comprovante de devolução com protocolo, para imprimir ou salvar em PDF
- Imprimir a etiqueta do achado
- Buscar e filtrar por categoria, local e status
- Aprovar ou recusar pedidos e marcar como devolvido
- Contador de pedidos pendentes no menu

**Geral**
- Login separado para aluno e secretaria, com páginas protegidas por perfil
- Botão de mostrar e esconder a senha
- Página 404 e título da aba diferente em cada página
- Botão "Demonstração" (só nas contas de teste) para trocar entre aluno e secretaria na apresentação
- Avisos na tela depois de cada ação
- Página de termos de uso e privacidade
- Layout responsivo (computador, tablet e celular)

## Tecnologias

- React 19 + JavaScript (ES6+)
- React Router 7 (rotas e páginas protegidas)
- Vite 8
- HTML5 e CSS3 puro, com variáveis de cor e espaçamento (sem framework de CSS)
- localStorage para guardar os dados (não há backend)
- Matter.js para a física da etiqueta na tela de login
- Oxlint para checar o código
- Figma, Git, GitHub e GitHub Projects

## Como rodar

Precisa do [Node.js](https://nodejs.org) 22 ou mais novo.

```bash
git clone https://github.com/giovanniprando/trabalho-final-Voltaqui.git
cd trabalho-final-Voltaqui
npm install
npm run dev
```

Abra http://localhost:5173.

Outros comandos:

```bash
npm run build     # gera a versão de produção em dist/
npm run preview   # abre a versão de produção
npm run lint      # confere o código
```

## Contas de teste

Todas com a senha `123456`. Na tela de login, o botão **"Contas de teste"** entra direto.

| Perfil | E-mail | Nome |
|---|---|---|
| Secretaria | secretaria@senai.br | Márcia Lopes |
| Aluno | ana@aluno.senai.br | Ana Souza |
| Aluno | bruno@aluno.senai.br | Bruno Lima |

O site já começa com 7 achados e 4 pedidos de exemplo. Para voltar a eles, use **"Restaurar dados de exemplo"** no fim do painel da secretaria.

## Páginas

| Rota | Quem acessa | Página |
|---|---|---|
| `/` | todos | Homepage |
| `/login` e `/login/secretaria` | todos | Entrar |
| `/criar-conta` | todos | Criar conta de aluno |
| `/termos` | todos | Termos de uso e privacidade |
| `/achados` | aluno | Buscar achados |
| `/achados/:id` | aluno | Detalhe do achado |
| `/achados/:id/solicitar` | aluno | Pedir devolução |
| `/minhas-solicitacoes` | aluno | Meus pedidos |
| `/secretaria` | secretaria | Painel |
| `/secretaria/achados` | secretaria | Lista de achados |
| `/secretaria/novo` | secretaria | Cadastrar achado |
| `/secretaria/editar/:id` | secretaria | Editar achado |
| `/secretaria/solicitacoes` | secretaria | Analisar pedidos |
| `/secretaria/etiqueta/:id` | secretaria | Etiqueta para imprimir |
| `/secretaria/comprovante/:id` | secretaria | Comprovante de devolução |
| qualquer outra | todos | Página não encontrada (404) |

## Estrutura

```
src/
├── components/   peças reutilizáveis (Badge, Campo, Modal, barra lateral...)
├── context/      login, dados e avisos compartilhados entre as páginas
├── data/         categorias, sugestões de locais, escolas, contas e dados de exemplo
├── hooks/        useTitulo (título da aba)
├── lib/          física da etiqueta (Matter.js)
├── pages/        páginas públicas, aluno/ e secretaria/
├── services/     storage.js: único arquivo que lê e grava no localStorage
├── styles/       CSS de cada página e dos componentes
└── utils/        validações, formatação, semelhança, parecidos, ordenação e foto

prototipo/        as telas feitas primeiro em HTML e CSS, antes do React
```

### Como os dados ficam salvos

Tudo fica no localStorage do navegador, sempre passando pelo `src/services/storage.js`.

- **Achado**: número, categoria, descrição, detalhe oculto, local, data e status (`disponivel` → `em_analise` → `devolvido`)
- **Pedido**: achado, aluno, o que o aluno descreveu e status (`pendente`, `aprovada`, `recusada`)

Regras:
- Um pedido novo coloca o achado em análise.
- Se o pedido é recusado e não há outro em aberto, o achado volta a ficar disponível.
- Excluir um achado apaga também os pedidos dele.
- O número do achado nunca se repete, mesmo depois de excluir.
- O aluno não pode pedir o mesmo achado duas vezes.

## Testes feitos

| O que testamos | Resultado esperado |
|---|---|
| Entrar com senha errada | Mostra "E-mail ou senha não conferem" |
| Entrar com conta da secretaria na aba Aluno | Avisa para usar a outra aba |
| Abrir página interna sem login | Volta para o login |
| Criar conta com código da escola errado, e-mail repetido e senhas diferentes | Mostra o erro em cada campo |
| Buscar "termica" (sem acento) | Encontra as garrafas térmicas |
| Filtrar por categoria e por status | Lista só os achados certos; sem resultado, mostra a mensagem e o botão de limpar |
| Cadastrar achado com campos vazios ou data no futuro | Mostra o erro em cada campo e não salva |
| Cadastrar achado válido | Abre a etiqueta com o próximo número |
| Editar achado | O formulário vem preenchido e salva as mudanças |
| Excluir achado | Pede confirmação; some da lista junto com os pedidos |
| Pedir devolução com menos de 10 letras | Mostra o erro |
| Aprovar, recusar e marcar devolvido | Status, contador do menu e painel mudam juntos |
| Recarregar a página | Nada se perde |
| Pedido "adesivo de banda" contra o detalhe "Adesivo de banda na base" | Alta semelhança, com as palavras em comum marcadas |
| Cadastrar o local "  cantina " quando já existe "Cantina" | Salva como "Cantina" e o filtro não repete o local |
| "Perdeu algo?" com garrafa, pátio e 20/10 | A garrafa do pátio aparece primeiro como "Muito parecido" |
| Secretaria aprova o pedido da Ana | O sino da Ana mostra 1 notificação nova |
| Marcar como devolvido | Abre o comprovante com protocolo `VQ-AAAAMMDD-NNNN` |
| Foto de 1600 × 1200 no cadastro | Vira uma miniatura de uns 3 KB |
| Endereço que não existe | Mostra a página 404 |
| Telas em 390 px (celular) | Nada passa da largura da tela; a tabela rola para o lado |

## Organização

- **Branches:** `main` (versão estável), `develop` (integração) e uma branch por integrante. Tudo entra na `develop` por Pull Request.
- **Kanban:** GitHub Projects com as colunas A fazer, Em andamento, Em revisão e Concluído.
- **Fluxo:** cada tela foi feita primeiro no Figma, depois em HTML e CSS (`prototipo/`) e por fim em React.

## Equipe

- Giovanni Prando
- Danilo
- Renan

Orientação: prof. Johnny Braga de Oliveira, SENAI.
