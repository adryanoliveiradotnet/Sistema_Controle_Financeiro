import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/login'
import Cadastro from './pages/cadastro'
import Dashboard from './pages/dashboard'
import Transacoes from './pages/transacoes'
import RotaProtegida, { RotaPublica } from './components/Rotas'
import NaoEncontrado from './pages/404'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <RotaPublica>
            <Login />
          </RotaPublica>
        } />
        <Route path="/cadastro" element={
          <RotaPublica>
            <Cadastro />
          </RotaPublica>
        } />
        <Route path="/dashboard" element={
          <RotaProtegida>
            <Dashboard />
          </RotaProtegida>
        } />
        <Route path="/nova-transacao" element={
          <RotaProtegida>
            <Transacoes />
          </RotaProtegida>
        } />
        <Route path="*" element={<NaoEncontrado />}
         />
      </Routes>
    </BrowserRouter>
  )
}