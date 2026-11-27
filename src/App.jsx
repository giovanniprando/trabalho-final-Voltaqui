import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router'
import { LayoutApp } from './components/LayoutApp'
import { RotaProtegida } from './components/RotaProtegida'
import { TrocaTema } from './components/TrocaTema'
import { PERFIS } from './data/usuarios'
import CriarConta from './pages/CriarConta'
import Login from './pages/Login'
import NaoEncontrada from './pages/NaoEncontrada'
import Termos from './pages/Termos'

const Home = lazy(() => import('./pages/Home'))

const aluno = () => import('./pages/aluno')
const secretaria = () => import('./pages/secretaria')

function pagina(grupo, nome) {
  return lazy(() => grupo().then((modulo) => ({ default: modulo[nome] })))
}

const BuscarAchados = pagina(aluno, 'BuscarAchados')
const DetalheAchado = pagina(aluno, 'DetalheAchado')
const SolicitarDevolucao = pagina(aluno, 'SolicitarDevolucao')
const MinhasSolicitacoes = pagina(aluno, 'MinhasSolicitacoes')

const Painel = pagina(secretaria, 'Painel')
const AchadosSecretaria = pagina(secretaria, 'Achados')
const FormularioAchado = pagina(secretaria, 'FormularioAchado')
const Solicitacoes = pagina(secretaria, 'Solicitacoes')
const Etiqueta = pagina(secretaria, 'Etiqueta')
const Comprovante = pagina(secretaria, 'Comprovante')

function Carregando() {
  return <output className="carregando">Carregando...</output>
}

export default function App() {
  return (
    <Suspense fallback={<Carregando />}>
      {/* Um botão só, fixo no canto superior direito de todas as telas */}
      <TrocaTema />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login key="aluno" perfil={PERFIS.ALUNO} />} />
        <Route path="/login/secretaria" element={<Login key="secretaria" perfil={PERFIS.SECRETARIA} />} />
        <Route path="/criar-conta" element={<CriarConta />} />
        <Route path="/termos" element={<Termos />} />

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

        <Route path="*" element={<NaoEncontrada />} />
      </Routes>
    </Suspense>
  )
}
