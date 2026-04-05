import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconeVoltar, IconeDinheiro, IconeTag, IconeCalendario } from '../components/Icones'
import { criarTransacao } from '../services/api'
import Alerta from '../components/Alerta'

export default function Transacoes() {
  const [descricao, setDescricao] = useState('')
  const [valor, setValor] = useState('')
  const [tipo, setTipo] = useState(0)
  const [categoria, setCategoria] = useState('')
  const [data, setData] = useState(new Date().toISOString().split('T')[0])
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState(false)
  const [carregando, setCarregando] = useState(false)
  const navigate = useNavigate()
  const [carregandoPagina, setCarregandoPagina] = useState(true)

useEffect(() => {
  const timer = setTimeout(() => setCarregandoPagina(false), 800)
  return () => clearTimeout(timer)
}, [])

if (carregandoPagina) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4"
      style={{ backgroundColor: '#16181d' }}>
      <div className="w-12 h-12 rounded-full border-4 animate-spin"
        style={{ borderColor: '#055B8C', borderTopColor: 'transparent' }} />
      <p className="text-gray-400 text-sm">Carregando nova transação...</p>
    </div>
  )
}

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')

    if (!descricao || !valor || !data) {
      setErro('Preencha todos os campos obrigatórios!')
      return
    }

    try {
      setCarregando(true)
      await criarTransacao({
        descricao,
        valor: parseFloat(valor),
        tipo: parseInt(tipo),
        categoria,
        data: new Date(data + 'T12:00:00').toISOString()
      })
      setSucesso(true)
      setTimeout(() => navigate('/dashboard'), 1200)
    } catch (err) {
      setErro(err.message)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#16181d' }}>

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
          <p className="text-white text-lg font-semibold">Transação salva!</p>
          <p className="text-gray-400 text-sm">Voltando ao dashboard...</p>
        </div>
      )}

      <header className="flex items-center justify-between px-8 py-4 shadow-md"
        style={{ backgroundColor: '#1F2025' }}>
        <img src="./imagens/logo.png" alt="Logo" className="h-8 w-auto" />
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-1 text-gray-400 text-sm hover:text-white transition-colors">
          <IconeVoltar />
          Voltar
        </button>
      </header>

      <main className="px-8 py-8 max-w-lg mx-auto">
        <h1 className="text-white text-xl font-semibold mb-6">Nova Transação</h1>

        <div className="rounded-xl p-6 space-y-5" style={{ backgroundColor: '#1F2025' }}>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setTipo(0)}
              className="flex-1 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{
                backgroundColor: tipo === 0 ? '#1a2e22' : '#2A2D36',
                color: tipo === 0 ? '#34d399' : '#9ca3af',
                border: tipo === 0 ? '1px solid #34d399' : '1px solid transparent'
              }}>
              ↑ Entrada
            </button>
            <button
              type="button"
              onClick={() => setTipo(1)}
              className="flex-1 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{
                backgroundColor: tipo === 1 ? '#2e1a1a' : '#2A2D36',
                color: tipo === 1 ? '#f87171' : '#9ca3af',
                border: tipo === 1 ? '1px solid #f87171' : '1px solid transparent'
              }}>
              ↓ Saída
            </button>
          </div>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <IconeTag />
            </span>
            <input
              type="text"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              style={{ backgroundColor: '#2A2D36' }}
              placeholder="Descrição *" />
          </div>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <IconeDinheiro />
            </span>
           <input
              type="number"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              style={{ backgroundColor: '#2A2D36' }}
              placeholder="Valor *"
              min="0"
              step="0.01" />
          </div>

          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="w-full px-4 py-3 text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none"
            style={{ backgroundColor: '#2A2D36' }}>
            <option value="">Categoria (opcional)</option>
            <option value="Alimentação">Alimentação</option>
            <option value="Transporte">Transporte</option>
            <option value="Educação">Educação</option>
            <option value="Cartão de crédito">Cartão de crédito</option>
            <option value="Lazer">Lazer</option>
            <option value="Salário">Salário</option>
            <option value="Outros">Outros</option>
          </select>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <IconeCalendario />
            </span>
            <input
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-white rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              style={{ backgroundColor: '#2A2D36' }} />
          </div>

          <button
            onClick={handleSubmit}
            disabled={carregando || sucesso}
            className="w-full py-2 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            style={{ backgroundColor: '#055B8C' }}>
            {carregando ? 'Salvando...' : 'Salvar Transação'}
          </button>

        </div>
      </main>

      <Alerta mensagem={erro} onFechar={() => setErro('')} />
    </div>
  )
}