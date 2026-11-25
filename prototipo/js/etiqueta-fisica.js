(function () {

  if (typeof Matter === 'undefined') return;

  const { Engine, Bodies, Body, Composite, Constraint, Vector } = Matter;

  const painel = document.querySelector('.marca');
  const etiqueta = painel && painel.querySelector('.etiqueta');
  if (!painel || !etiqueta) return;

  const COMPRIMENTO_BARBANTE = 120;
  const DISTANCIA_FURO = 24;
  const GRAVIDADE = 1.2;
  const QUIQUE = 0.5;
  const FORCA_TAPA = 18;
  const TEMPO_MAXIMO_VOANDO = 6000;
  const PASSO = 1000 / 60;

  const reduzirMovimento = window.matchMedia('(prefers-reduced-motion: reduce)');
  const telaLarga = window.matchMedia('(min-width: 901px)');

  let estado = 'pendurada';
  let engine = null;
  let corpo = null;
  let barbante = null;
  let prego = null;
  let largura = 0;
  let altura = 0;
  let tempoVoando = 0;
  let tempoParada = 0;
  let acumulado = 0;
  let ultimoQuadro = 0;
  let idQuadro = 0;
  let linha = null;

  function deslocamentoFuro() {
    return { x: 0, y: -altura / 2 + DISTANCIA_FURO };
  }

  function posicaoFuro() {
    return Vector.add(corpo.position, Vector.rotate(deslocamentoFuro(), corpo.angle));
  }

  function obstaculo(elemento, base) {
    const r = elemento.getBoundingClientRect();
    return Bodies.rectangle(
      r.left - base.left + r.width / 2,
      r.top - base.top + r.height / 2,
      r.width,
      r.height,
      { isStatic: true },
    );
  }

  function montar() {
    desmontar();
    if (!telaLarga.matches || reduzirMovimento.matches) return;

    const base = painel.getBoundingClientRect();
    const r = etiqueta.getBoundingClientRect();

    largura = etiqueta.offsetWidth;
    altura = etiqueta.offsetHeight;

    const centro = {
      x: r.left - base.left + r.width / 2,
      y: r.top - base.top + r.height / 2,
    };

    engine = Engine.create({ gravity: { x: 0, y: GRAVIDADE } });

    const L = painel.clientWidth;
    const A = painel.clientHeight;
    const E = 400;
    const parede = { isStatic: true };
    const paredes = [
      Bodies.rectangle(L / 2, A + E / 2, L + E * 2, E, parede),
      Bodies.rectangle(L / 2, -E / 2, L + E * 2, E, parede),
      Bodies.rectangle(-E / 2, A / 2, E, A + E * 2, parede),
      Bodies.rectangle(L + E / 2, A / 2, E, A + E * 2, parede),
      obstaculo(painel.querySelector('.marca-logo'), base),
      obstaculo(painel.querySelector('.marca-slogan').parentElement, base),
    ];

    corpo = Bodies.rectangle(centro.x, centro.y, largura, altura, {
      chamfer: { radius: 10 },
      angle: (-4 * Math.PI) / 180,
      restitution: QUIQUE,
      friction: 0.4,
      frictionAir: 0.02,
      density: 0.002,
    });

    prego = Vector.sub(posicaoFuro(), { x: 0, y: COMPRIMENTO_BARBANTE });
    if (prego.y < 8) prego.y = 8;
    barbante = criarBarbante(COMPRIMENTO_BARBANTE, 0.9);

    Composite.add(engine.world, [...paredes, corpo, barbante]);

    painel.classList.add('fisica-ativa');
    linha = criarLinha();
    estado = 'pendurada';

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

  function criarLinha() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'barbante');
    svg.setAttribute('aria-hidden', 'true');
    svg.innerHTML = '<line />';
    painel.prepend(svg);
    return svg.querySelector('line');
  }

  function quadro(agora) {

    const dt = Math.min(agora - ultimoQuadro, 100);
    ultimoQuadro = agora;

    acumulado += dt;
    while (acumulado >= PASSO) {
      Engine.update(engine, PASSO);
      atualizarEstado(PASSO);
      acumulado -= PASSO;
    }

    desenhar();
    idQuadro = requestAnimationFrame(quadro);
  }

  function atualizarEstado(dt) {
    if (estado === 'voando') {
      tempoVoando += dt;

      const quaseParada = corpo.speed < 0.3 && corpo.angularSpeed < 0.01;
      tempoParada = quaseParada ? tempoParada + dt : 0;
      if (tempoParada > 700 || tempoVoando > TEMPO_MAXIMO_VOANDO) recolher();
    }

    if (estado === 'recolhendo') {

      barbante.length = Math.max(COMPRIMENTO_BARBANTE, barbante.length - 7);
      const distancia = Vector.magnitude(Vector.sub(posicaoFuro(), prego));
      if (barbante.length === COMPRIMENTO_BARBANTE && distancia < COMPRIMENTO_BARBANTE + 6) {
        barbante.stiffness = 0.9;
        corpo.frictionAir = 0.02;
        estado = 'pendurada';
      }
    }
  }

  function desenhar() {
    const { x, y } = corpo.position;

    etiqueta.style.transform =
      `translate(${x - largura / 2}px, ${y - altura / 2}px) rotate(${corpo.angle}rad)`;

    const fim = barbante ? posicaoFuro() : { x: prego.x, y: prego.y + 34 };
    linha.setAttribute('x1', prego.x);
    linha.setAttribute('y1', prego.y);
    linha.setAttribute('x2', fim.x);
    linha.setAttribute('y2', fim.y);
  }

  function darTapa(evento) {

    evento.preventDefault();

    const base = painel.getBoundingClientRect();
    const ponto = { x: evento.clientX - base.left, y: evento.clientY - base.top };
    mostrarImpacto(ponto);

    if (!engine) {
      etiqueta.classList.remove('balancando');
      void etiqueta.offsetWidth;
      etiqueta.classList.add('balancando');
      return;
    }

    const relativo = Vector.sub(ponto, corpo.position);

    const lado = relativo.x < 0 ? 1 : -1;
    const forca = FORCA_TAPA * (0.85 + Math.random() * 0.4);

    if (barbante) {
      Composite.remove(engine.world, barbante);
      barbante = null;
    }

    Body.setVelocity(corpo, { x: lado * forca, y: -(7 + Math.random() * 6) });

    const giro = -relativo.y * lado * 0.0035 + lado * 0.08;
    Body.setAngularVelocity(corpo, giro);

    corpo.frictionAir = 0.008;
    estado = 'voando';
    tempoVoando = 0;
    tempoParada = 0;

    tremerPainel(lado);
  }

  function recolher() {
    const distancia = Vector.magnitude(Vector.sub(posicaoFuro(), prego));
    barbante = criarBarbante(distancia, 0.02);
    Composite.add(engine.world, barbante);
    corpo.frictionAir = 0.05;
    estado = 'recolhendo';
  }

  function mostrarImpacto(ponto) {
    const anel = document.createElement('span');
    anel.className = 'tapa-impacto';
    anel.style.left = `${ponto.x}px`;
    anel.style.top = `${ponto.y}px`;
    painel.append(anel);

    anel.addEventListener('animationend', () => anel.remove());
  }

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

  function cutucar() {
    if (estado === 'pendurada' && corpo) Body.setAngularVelocity(corpo, 0.03);
  }

  etiqueta.addEventListener('pointerdown', darTapa);
  etiqueta.addEventListener('pointerenter', cutucar);

  let espera = 0;
  window.addEventListener('resize', () => {
    clearTimeout(espera);
    espera = setTimeout(montar, 200);
  });
  reduzirMovimento.addEventListener('change', montar);

  document.fonts.ready.then(montar);
})();
