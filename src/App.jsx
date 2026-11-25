import { Route, Routes } from 'react-router-dom'
import { LayoutApp } from './components/LayoutApp'
import { RotaProtegida } from './components/RotaProtegida'
import { PERFIS } from './data/usuarios'
import CriarConta from './pages/CriarConta'
import Home from './pages/Home'
import Login from './pages/Login'
import NaoEncontrada from './pages/NaoEncontrada'
import Termos from './pages/Termos'
import BuscarAchados from './pages/aluno/BuscarAchados'
import DetalheAchado from './pages/aluno/DetalheAchado'
import MinhasSolicitacoes from './pages/aluno/MinhasSolicitacoes'
import SolicitarDevolucao from './pages/aluno/SolicitarDevolucao'
import AchadosSecretaria from './pages/secretaria/Achados'
import Comprovante from './pages/secretaria/Comprovante'
import Etiqueta from './pages/secretaria/Etiqueta'
import FormularioAchado from './pages/secretaria/FormularioAchado'
import Painel from './pages/secretaria/Painel'
import Solicitacoes from './pages/secretaria/Solicitacoes'

export default function App() {
  return (
    <Routes>
      {/* Públicas */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login key="aluno" perfil={PERFIS.ALUNO} />} />
      <Route path="/login/secretaria" element={<Login key="secretaria" perfil={PERFIS.SECRETARIA} />} />
      <Route path="/criar-conta" element={<CriarConta />} />
      <Route path="/termos" element={<Termos />} />

      {/* Só aluno */}
      <Route
        element={
          <RotaProtegida perfil={PERFIS.ALUNO}>
            <LayoutApp />
          </RotaProtegida>
        }
      >
        <Route path="/achados" element={<BuscarAchados />} />
        <Route path="/achados/:id" element={<DetalheAchado />} />
        <Route path="/achados/:id/solicitar" element={<SolicitarDevolucao />} />
        <Route path="/minhas-solicitacoes" element={<MinhasSolicitacoes />} />
      </Route>

      {/* Só secretaria */}
      <Route
        element={
          <RotaProtegida perfil={PERFIS.SECRETARIA}>
            <LayoutApp />
          </RotaProtegida>
        }
      >
        <Route path="/secretaria" element={<Painel />} />
        <Route path="/secretaria/achados" element={<AchadosSecretaria />} />
        <Route path="/secretaria/novo" element={<FormularioAchado />} />
        <Route path="/secretaria/editar/:id" element={<FormularioAchado />} />
        <Route path="/secretaria/solicitacoes" element={<Solicitacoes />} />
        <Route path="/secretaria/etiqueta/:id" element={<Etiqueta />} />
        <Route path="/secretaria/comprovante/:id" element={<Comprovante />} />
      </Route>

      {/* Qualquer endereço que não existe */}
      <Route path="*" element={<NaoEncontrada />} />
    </Routes>
  )
}
