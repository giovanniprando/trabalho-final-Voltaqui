/*
  ============================================================
  ETIQUETA COM FÍSICA — o "tapa" na etiqueta do painel da marca
  ============================================================
  O que acontece:
  1. A etiqueta fica PENDURADA num barbante e balança de leve.
  2. Clicou nela = TAPA: o barbante arrebenta e ela sai VOANDO,
     girando, batendo nas paredes, no logo e no slogan.
  3. Quando ela PARA (ou depois de 6 segundos), o barbante volta
     e RECOLHE a etiqueta de volta para o lugar.
  4. Dá para dar outro tapa no meio do voo.

  Biblioteca: Matter.js (https://brm.io/matter-js/), um motor de
  física 2D gratuito. Ele calcula gravidade, colisões, quique e giro.
  Nós só pegamos a posição e o ângulo que ele calcula e aplicamos
  na etiqueta HTML com CSS (transform). Assim o texto da etiqueta
  continua sendo HTML de verdade, não um desenho.

  Acessibilidade: se a pessoa ativou "reduzir movimento" no sistema,
  não tem voo; a etiqueta só balança de leve.

  Este arquivo é carregado no fim do <body> de login.html e
  criar-conta.html, DEPOIS do script do Matter.js.
  ============================================================
*/

// (function () { ... })() = "função que se executa sozinha".
// Tudo aqui dentro fica PRIVADO: as variáveis não vazam para o resto
// da página nem brigam com outros scripts.
(function () {
  // Se o Matter.js não carregou (sem internet, por exemplo),
  // não faz nada. A etiqueta continua parada, como no CSS.
  if (typeof Matter === 'undefined') return;

  // Pega só as partes do Matter que vamos usar.
  // Engine = o "mundo" que roda a física
  // Bodies = cria corpos (retângulos)
  // Body = mexe num corpo (velocidade, giro...)
  // Composite = adiciona/remove coisas do mundo
  // Constraint = uma ligação entre dois pontos (o barbante!)
  // Vector = contas com pontos (somar, girar...)
  const { Engine, Bodies, Body, Composite, Constraint, Vector } = Matter;

  const painel = document.querySelector('.marca');
  const etiqueta = painel && painel.querySelector('.etiqueta');
  if (!painel || !etiqueta) return;

  // ---------- AJUSTES (mexa aqui para mudar o "jeito" da física) ----------
  const COMPRIMENTO_BARBANTE = 120; // px, do prego até o furo
  const DISTANCIA_FURO = 24; // px, do topo da etiqueta até o centro do furo
  const GRAVIDADE = 1.2; // 1 = gravidade padrão do Matter
  const QUIQUE = 0.5; // 0 = não quica, 1 = quica sem perder força
  const FORCA_TAPA = 18; // velocidade do voo (px por quadro)
  const TEMPO_MAXIMO_VOANDO = 6000; // ms até o barbante recolher sozinho
  const PASSO = 1000 / 60; // a física roda em passos fixos de 1/60 s

  // matchMedia = pergunta ao navegador sobre a tela/preferências.
  const reduzirMovimento = window.matchMedia('(prefers-reduced-motion: reduce)');
  const telaLarga = window.matchMedia('(min-width: 901px)'); // no celular a etiqueta some

  // ---------- ESTADO ----------
  // A etiqueta está sempre em UM destes estados:
  // 'pendurada' -> 'voando' -> 'recolhendo' -> 'pendurada'
  let estado = 'pendurada';
  let engine = null; // o mundo da física
  let corpo = null; // o corpo físico da etiqueta
  let barbante = null; // a ligação prego <-> furo (null = arrebentado)
  let prego = null; // o ponto fixo onde o barbante fica preso
  let largura = 0;
  let altura = 0;
  let tempoVoando = 0;
  let tempoParada = 0;
  let acumulado = 0; // tempo que sobrou para o próximo passo da física
  let ultimoQuadro = 0;
  let idQuadro = 0; // id do requestAnimationFrame, para poder parar o loop
  let linha = null; // o <svg> que desenha o barbante

  // Onde fica o furo, a partir do CENTRO da etiqueta, sem giro.
  // (0, negativo) = acima do centro.
  function deslocamentoFuro() {
    return { x: 0, y: -altura / 2 + DISTANCIA_FURO };
  }

  // Posição do furo no painel, levando em conta o giro da etiqueta.
  function posicaoFuro() {
    return Vector.add(corpo.position, Vector.rotate(deslocamentoFuro(), corpo.angle));
  }

  // Converte um retângulo da página para um corpo PAREDE (parado).
  // Usamos isso no logo e no slogan: a etiqueta bate neles.
  function obstaculo(elemento, base) {
    const r = elemento.getBoundingClientRect();
    return Bodies.rectangle(
      r.left - base.left + r.width / 2, // Matter usa o CENTRO do corpo
      r.top - base.top + r.height / 2,
      r.width,
      r.height,
      { isStatic: true }, // isStatic = não se mexe, nem com gravidade
    );
  }

  // ============================================================
  // MONTAR O MUNDO
  // ============================================================
  function montar() {
    desmontar();
    if (!telaLarga.matches || reduzirMovimento.matches) return;

    // 1. Mede a etiqueta ainda na posição do CSS.
    const base = painel.getBoundingClientRect();
    const r = etiqueta.getBoundingClientRect();
    // offsetWidth/Height = tamanho SEM o giro do CSS.
    largura = etiqueta.offsetWidth;
    altura = etiqueta.offsetHeight;
    // O centro não muda com o giro, então dá para usar o retângulo.
    const centro = {
      x: r.left - base.left + r.width / 2,
      y: r.top - base.top + r.height / 2,
    };

    // 2. Cria o mundo com gravidade para baixo.
    engine = Engine.create({ gravity: { x: 0, y: GRAVIDADE } });

    // 3. Paredes invisíveis nas bordas do painel azul.
    //    Ficam FORA da área visível (por isso a espessura grande).
    const L = painel.clientWidth;
    const A = painel.clientHeight;
    const E = 400; // espessura
    const parede = { isStatic: true };
    const paredes = [
      Bodies.rectangle(L / 2, A + E / 2, L + E * 2, E, parede), // chão
      Bodies.rectangle(L / 2, -E / 2, L + E * 2, E, parede), // teto
      Bodies.rectangle(-E / 2, A / 2, E, A + E * 2, parede), // esquerda
      Bodies.rectangle(L + E / 2, A / 2, E, A + E * 2, parede), // direita
      obstaculo(painel.querySelector('.marca-logo'), base),
      obstaculo(painel.querySelector('.marca-slogan').parentElement, base),
    ];

    // 4. O corpo da etiqueta: um retângulo com cantos arredondados.
    corpo = Bodies.rectangle(centro.x, centro.y, largura, altura, {
      chamfer: { radius: 10 }, // cantos arredondados (igual ao CSS)
      angle: (-4 * Math.PI) / 180, // começa girada -4°, como no CSS
      restitution: QUIQUE,
      friction: 0.4,
      frictionAir: 0.02, // "resistência do ar": faz o balanço parar aos poucos
      density: 0.002,
    });

    // 5. O prego fica exatamente acima do furo.
    prego = Vector.sub(posicaoFuro(), { x: 0, y: COMPRIMENTO_BARBANTE });
    if (prego.y < 8) prego.y = 8; // nunca acima do topo do painel
    barbante = criarBarbante(COMPRIMENTO_BARBANTE, 0.9);

    Composite.add(engine.world, [...paredes, corpo, barbante]);

    // 6. Liga o modo física no CSS (a etiqueta passa a ser posicionada
    //    pelo JavaScript) e cria o desenho do barbante.
    painel.classList.add('fisica-ativa');
    linha = criarLinha();
    estado = 'pendurada';

    // Um empurrãozinho inicial: ela entra balançando.
    Body.setAngularVelocity(corpo, 0.02);

    ultimoQuadro = performance.now();
    idQuadro = requestAnimationFrame(quadro);
  }

  function desmontar() {
    cancelAnimationFrame(idQuadro);
    painel.classList.remove('fisica-ativa');
    etiqueta.style.transform = '';
    if (linha) linha.remove();
    linha = null;
    engine = corpo = barbante = null;
  }

  // O barbante é uma Constraint: liga o prego (ponto fixo) ao furo
  // (um ponto do corpo). stiffness = rigidez: 1 = corda dura,
  // perto de 0 = elástico mole.
  function criarBarbante(comprimento, rigidez) {
    return Constraint.create({
      pointA: prego,
      bodyB: corpo,
      pointB: Vector.rotate(deslocamentoFuro(), corpo.angle),
      length: comprimento,
      stiffness: rigidez,
      damping: 0.05,
    });
  }

  // SVG com uma <line> que cobre o painel todo, para desenhar o barbante.
  function criarLinha() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'barbante');
    svg.setAttribute('aria-hidden', 'true');
    svg.innerHTML = '<line />';
    painel.prepend(svg); // prepend = primeiro filho: fica ATRÁS da etiqueta
    return svg.querySelector('line');
  }

  // ============================================================
  // LOOP: roda ~60 vezes por segundo
  // ============================================================
  function quadro(agora) {
    // Tempo desde o último quadro. Math.min evita um "pulo" enorme
    // quando a aba fica em segundo plano e volta.
    const dt = Math.min(agora - ultimoQuadro, 100);
    ultimoQuadro = agora;

    // A física roda em passos FIXOS (sempre 1/60 s), mesmo que a tela
    // seja de 120 Hz. Passo fixo deixa a simulação estável.
    acumulado += dt;
    while (acumulado >= PASSO) {
      Engine.update(engine, PASSO);
      atualizarEstado(PASSO);
      acumulado -= PASSO;
    }

    desenhar();
    idQuadro = requestAnimationFrame(quadro);
  }

  // As regras que trocam de estado.
  function atualizarEstado(dt) {
    if (estado === 'voando') {
      tempoVoando += dt;
      // corpo.speed = rapidez; angularSpeed = rapidez do giro.
      const quaseParada = corpo.speed < 0.3 && corpo.angularSpeed < 0.01;
      tempoParada = quaseParada ? tempoParada + dt : 0;
      if (tempoParada > 700 || tempoVoando > TEMPO_MAXIMO_VOANDO) recolher();
    }

    if (estado === 'recolhendo') {
      // O barbante encurta um pouco a cada passo, puxando a etiqueta.
      barbante.length = Math.max(COMPRIMENTO_BARBANTE, barbante.length - 7);
      const distancia = Vector.magnitude(Vector.sub(posicaoFuro(), prego));
      if (barbante.length === COMPRIMENTO_BARBANTE && distancia < COMPRIMENTO_BARBANTE + 6) {
        barbante.stiffness = 0.9; // de elástico volta a ser corda firme
        corpo.frictionAir = 0.02;
        estado = 'pendurada';
      }
    }
  }

  // Copia a posição e o ângulo da física para o HTML.
  function desenhar() {
    const { x, y } = corpo.position;
    // translate move, rotate gira. Subtraímos metade do tamanho porque
    // o Matter guarda o CENTRO, e o CSS posiciona pelo canto.
    etiqueta.style.transform =
      `translate(${x - largura / 2}px, ${y - altura / 2}px) rotate(${corpo.angle}rad)`;

    // Barbante: do prego até o furo. Arrebentado: só um toco pendurado.
    const fim = barbante ? posicaoFuro() : { x: prego.x, y: prego.y + 34 };
    linha.setAttribute('x1', prego.x);
    linha.setAttribute('y1', prego.y);
    linha.setAttribute('x2', fim.x);
    linha.setAttribute('y2', fim.y);
  }

  // ============================================================
  // O TAPA
  // ============================================================
  function darTapa(evento) {
    // preventDefault: não seleciona texto nem arrasta a etiqueta.
    evento.preventDefault();

    const base = painel.getBoundingClientRect();
    const ponto = { x: evento.clientX - base.left, y: evento.clientY - base.top };
    mostrarImpacto(ponto);

    // Sem física (reduzir movimento ou celular): só um balanço no CSS.
    if (!engine) {
      etiqueta.classList.remove('balancando');
      void etiqueta.offsetWidth; // truque para reiniciar a animação do CSS
      etiqueta.classList.add('balancando');
      return;
    }

    // De onde veio o tapa, em relação ao centro da etiqueta.
    const relativo = Vector.sub(ponto, corpo.position);
    // Bateu do lado esquerdo? Ela voa para a direita (e vice-versa).
    const lado = relativo.x < 0 ? 1 : -1;
    const forca = FORCA_TAPA * (0.85 + Math.random() * 0.4); // um pouco de sorte

    // Arrebenta o barbante.
    if (barbante) {
      Composite.remove(engine.world, barbante);
      barbante = null;
    }

    // Velocidade: para o lado e para cima.
    Body.setVelocity(corpo, { x: lado * forca, y: -(7 + Math.random() * 6) });

    // Giro: bater LONGE do centro gira mais (como na vida real).
    // Em cima empurrando para a direita = gira no sentido horário.
    const giro = -relativo.y * lado * 0.0035 + lado * 0.08;
    Body.setAngularVelocity(corpo, giro);

    corpo.frictionAir = 0.008; // voando, quase sem resistência
    estado = 'voando';
    tempoVoando = 0;
    tempoParada = 0;

    tremerPainel(lado);
  }

  // Volta o barbante, frouxo e elástico, e começa a recolher.
  function recolher() {
    const distancia = Vector.magnitude(Vector.sub(posicaoFuro(), prego));
    barbante = criarBarbante(distancia, 0.02);
    Composite.add(engine.world, barbante);
    corpo.frictionAir = 0.05; // freia o balanço durante a volta
    estado = 'recolhendo';
  }

  // ============================================================
  // EFEITOS DO TAPA
  // ============================================================

  // Um anel que se expande no ponto do clique (a "onda" do tapa).
  function mostrarImpacto(ponto) {
    const anel = document.createElement('span');
    anel.className = 'tapa-impacto';
    anel.style.left = `${ponto.x}px`;
    anel.style.top = `${ponto.y}px`;
    painel.append(anel);
    // Quando a animação do CSS termina, o anel é apagado da página.
    anel.addEventListener('animationend', () => anel.remove());
  }

  // O painel treme rapidinho, como se o golpe tivesse "peso".
  // element.animate() = animação feita pelo JavaScript (Web Animations API).
  function tremerPainel(lado) {
    if (reduzirMovimento.matches) return;
    painel.animate(
      [
        { transform: 'translateX(0)' },
        { transform: `translateX(${lado * 6}px)` },
        { transform: `translateX(${-lado * 3}px)` },
        { transform: 'translateX(0)' },
      ],
      { duration: 180, easing: 'ease-out' },
    );
  }

  // Passar o mouse por cima dá um empurrãozinho: convida a clicar.
  function cutucar() {
    if (estado === 'pendurada' && corpo) Body.setAngularVelocity(corpo, 0.03);
  }

  // ============================================================
  // LIGAR TUDO
  // ============================================================
  // pointerdown = mouse, toque ou caneta (funciona em todos).
  etiqueta.addEventListener('pointerdown', darTapa);
  etiqueta.addEventListener('pointerenter', cutucar);

  // Se a janela mudar de tamanho, refaz o mundo com as medidas novas.
  // O setTimeout espera a pessoa PARAR de redimensionar (debounce).
  let espera = 0;
  window.addEventListener('resize', () => {
    clearTimeout(espera);
    espera = setTimeout(montar, 200);
  });
  reduzirMovimento.addEventListener('change', montar);

  // Espera as fontes carregarem: o tamanho da etiqueta depende delas.
  document.fonts.ready.then(montar);
})();
