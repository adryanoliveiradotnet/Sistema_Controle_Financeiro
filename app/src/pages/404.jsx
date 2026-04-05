import { useNavigate } from 'react-router-dom'

export default function NaoEncontrado() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6"
      style={{ backgroundColor: '#16181d' }}>

      <p className="text-8xl font-bold" style={{ color: '#055B8C' }}>404</p>
      <h1 className="text-white text-2xl font-semibold">Página não encontrada</h1>
      <p className="text-gray-400 text-sm">A página que você tentou acessar não existe.</p>

      <button
        onClick={() => navigate(token ? '/dashboard' : '/')}
        className="px-6 py-2 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
        style={{ backgroundColor: '#055B8C' }}>
        {token ? 'Voltar ao Dashboard' : 'Voltar ao Login'}
      </button>

    </div>
  )
}