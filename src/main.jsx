import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import App from './App'
import { AuthProvider } from './context/AuthProvider'
import { AvisoProvider } from './context/AvisoProvider'
import { DadosProvider } from './context/DadosProvider'
import { TemaProvider } from './context/TemaProvider'
import { aplicarTema, temaInicial } from './utils/tema'
import { inicializarDados } from './services/storage'
import { aplicarTema, temaInicial } from './utils/tema'
import './styles/fontes.css'
import './styles/tokens.css'
import './styles/base.css'
import './styles/componentes.css'
import './styles/app.css'

inicializarDados()
// Aplica o tema antes de desenhar a página, para não piscar claro e depois escuro.
aplicarTema(temaInicial())

aplicarTema(temaInicial())

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <TemaProvider>
        <AuthProvider>
          <AvisoProvider>
            <DadosProvider>
              <App />
            </DadosProvider>
          </AvisoProvider>
        </AuthProvider>
      </TemaProvider>
    </BrowserRouter>
  </StrictMode>,
)
