import { useTema } from '../context/useTema'
import { Icone } from './Icone'

// Botão de lua e sol que liga e desliga o modo escuro em qualquer página.
// "sobreMarca" = o botão fica em cima do azul da marca (barra lateral do sistema).
export function BotaoTema({ sobreMarca = false }) {
  const { tema, alternarTema } = useTema()
  const escuro = tema === 'escuro'

  return (
    <button
      type="button"
      className={sobreMarca ? 'botao-tema botao-tema-sobre-marca' : 'botao-tema'}
      onClick={alternarTema}
      aria-pressed={escuro}
      aria-label="Modo escuro"
      title={escuro ? 'Voltar para o modo claro' : 'Ligar o modo escuro'}
    >
      <Icone nome={escuro ? 'sol' : 'lua'} tamanho={18} />
    </button>
  )
}
