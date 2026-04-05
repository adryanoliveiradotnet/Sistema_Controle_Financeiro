import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconeEmail, IconeSenha, IconeUsuario } from '../components/Icones'
import { cadastro } from '../services/api'
import Alerta from '../components/Alerta'

export default function Cadastro() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState(false)
  const [carregando, setCarregando] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')

    if (!nome || !email || !senha || !confirmarSenha) {
      setErro('Por favor, preencha todos os campos!')
      return
    }

    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem!')
      return
    }

    if (senha.length < 6) {
      setErro('A senha deve ter no mínimo 6 caracteres!')
      return
    }

    try {
      setCarregando(true)
      await cadastro(nome, email, senha)
      setSucesso(true)
      setTimeout(() => navigate('/'), 1200)
    } catch (err) {
      setErro(err.message)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: "url('./imagens/background.jpg')" }}>

      {sucesso && (
        <div className="fixed inset-0 flex flex-col items-center justify-center z-50 gap-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}>
          <div className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ backgroundColor: '#1a2e22', border: '2px solid #34d399' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="#34d399" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="text-white text-lg font-semibold">Cadastro realizado!</p>
          <p className="text-gray-400 text-sm">Redirecionando para o login...</p>
        </div>
      )}

      <div
        className="relative z-10 p-8 rounded-lg shadow-lg w-full max-w-md"
        style={{ backgroundColor: '#1F2025' }}>
        <div className="flex justify-center mb-8">
          <img src="./imagens/logo.png" alt="Adrian Oliveira" className="h-9 w-auto" />
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <IconeUsuario />
            </span>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              style={{ backgroundColor: '#2A2D36' }}
              placeholder="Nome completo" />
          </div>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <IconeEmail />
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              style={{ backgroundColor: '#2A2D36' }}
              placeholder="Email" />
          </div>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <IconeSenha />
            </span>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              style={{ backgroundColor: '#2A2D36' }}
              placeholder="Senha" />
          </div>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <IconeSenha />
            </span>
            <input
              type="password"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              style={{ backgroundColor: '#2A2D36' }}
              placeholder="Confirmar senha" />
          </div>

          <button
            type="submit"
            disabled={carregando || sucesso}
            className="w-full py-2 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            style={{ backgroundColor: '#055B8C' }}>
            {carregando ? 'Cadastrando...' : 'Cadastrar'}
          </button>

          <div className="flex justify-center">
            <p className="text-gray-400 text-sm">
              Já tem conta?{' '}
              <a href="/" className="text-blue-500 hover:underline">Entrar</a>
            </p>
          </div>

        </form>

        <Alerta mensagem={erro} onFechar={() => setErro('')} />
      </div>
    </div>
  )
}