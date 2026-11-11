import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Achados from './pages/Achados.jsx';
import CadastroAchado from './pages/CadastroAchado.jsx';
import DetalheAchado from './pages/DetalheAchado.jsx';
import Login from './pages/Login.jsx';
import PainelSecretaria from './pages/PainelSecretaria.jsx';
import SolicitarDevolucao from './pages/SolicitarDevolucao.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/achados" element={<Achados />} />
        <Route path="/achados/:id" element={<DetalheAchado />} />
        <Route path="/achados/:id/solicitar" element={<SolicitarDevolucao />} />
        <Route path="/secretaria" element={<PainelSecretaria />} />
        <Route path="/secretaria/novo" element={<CadastroAchado />} />
        <Route path="/secretaria/editar/:id" element={<CadastroAchado />} />
      </Routes>
    </BrowserRouter>
  );
}
