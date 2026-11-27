import { useTema } from '../context/useTema'
import { Icone } from './Icone'

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
