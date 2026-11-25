import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './context/AuthProvider'
import { AvisoProvider } from './context/AvisoProvider'
import { DadosProvider } from './context/DadosProvider'
import { inicializarDados } from './services/storage'
import './styles/tokens.css'
import './styles/base.css'
import './styles/componentes.css'
import './styles/app.css'

inicializarDados()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <DadosProvider>
          <AvisoProvider>
            <App />
          </AvisoProvider>
        </DadosProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
