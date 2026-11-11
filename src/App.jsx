import { Navigate, Route, Routes } from 'react-router-dom'
import { Header } from './components/Header'
import { RotaProtegida } from './components/RotaProtegida'
import { PERFIS } from './data/usuarios'
import Achados from './pages/Achados'
import CadastroAchado from './pages/CadastroAchado'
import DetalheAchado from './pages/DetalheAchado'
import Login from './pages/Login'
import PainelSecretaria from './pages/PainelSecretaria'
import SolicitarDevolucao from './pages/SolicitarDevolucao'

export default function App() {
  return (
    <>
      <Header />
      <main className="conteudo">
        <Routes>
          <Route path="/" element={<Login />} />

          {/* Aluno e secretaria */}
          <Route
            path="/achados"
            element={<RotaProtegida><Achados /></RotaProtegida>}
          />
          <Route
            path="/achados/:id"
            element={<RotaProtegida><DetalheAchado /></RotaProtegida>}
          />

          {/* Só aluno */}
          <Route
            path="/achados/:id/solicitar"
            element={
              <RotaProtegida perfil={PERFIS.ALUNO}>
                <SolicitarDevolucao />
              </RotaProtegida>
            }
          />

          {/* Só secretaria */}
          <Route
            path="/secretaria"
            element={
              <RotaProtegida perfil={PERFIS.SECRETARIA}>
                <PainelSecretaria />
              </RotaProtegida>
            }
          />
          <Route
            path="/secretaria/novo"
            element={
              <RotaProtegida perfil={PERFIS.SECRETARIA}>
                <CadastroAchado />
              </RotaProtegida>
            }
          />
          <Route
            path="/secretaria/editar/:id"
            element={
              <RotaProtegida perfil={PERFIS.SECRETARIA}>
                <CadastroAchado />
              </RotaProtegida>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  )
}
