import { Link } from 'react-router-dom'

export default function Termos() {
  return (
    <main className="termos">
      <Link className="termos-logo" to="/">
        <img src="/img/logo-horizontal.svg" alt="Voltaqui, início" width="114" height="40" />
      </Link>

      <h1>Termos de uso e privacidade</h1>
      <p className="termos-data">Atualizado em 25 de novembro de 2026.</p>

      <section>
        <h2>O que é o Voltaqui</h2>
        <p>
          O Voltaqui organiza os achados e perdidos de escolas. A secretaria cadastra o que foi
          encontrado e o aluno pede a devolução do que é dele, provando com um detalhe que só o
          dono saberia.
        </p>
        <p>
          Esta versão é o projeto final de um grupo de alunos do curso de Desenvolvimento de
          Sistemas do SENAI. É uma demonstração e ainda não é usada oficialmente pela escola.
        </p>
      </section>

      <section>
        <h2>Regras de uso</h2>
        <ul>
          <li>Peça a devolução só do que é seu. Pedidos falsos podem ser levados à coordenação.</li>
          <li>Não escreva dados pessoais de outras pessoas nas descrições.</li>
          <li>A secretaria decide se a descrição confere. Se tiver dúvida, ela pode pedir para ver o objeto com você.</li>
          <li>Objetos aprovados são retirados na secretaria, com a carteirinha.</li>
        </ul>
      </section>

      <section id="privacidade">
        <h2>Privacidade</h2>
        <p>Guardamos só o necessário para a devolução funcionar:</p>
        <ul>
          <li>Na sua conta: nome, e-mail, matrícula, curso e o código da escola.</li>
          <li>Nos pedidos: o que você descreveu e a data.</li>
        </ul>
        <p>
          Nesta demonstração, tudo fica salvo apenas no seu navegador (localStorage). Nada é
          enviado para servidores. Se você limpar os dados do navegador, as contas e os pedidos
          somem.
        </p>
        <p>
          O detalhe oculto de cada objeto só aparece para a secretaria. Outros alunos nunca veem
          esse detalhe nem o que você escreveu no pedido.
        </p>
      </section>

      <section>
        <h2>Contato</h2>
        <p>Dúvidas sobre o Voltaqui? Procure a secretaria da sua escola.</p>
      </section>
    </main>
  )
}
