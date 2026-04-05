import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { IconeSair, IconeEntrada, IconeSaida, IconeDinheiro, IconeGrafico } from '../components/Icones'
import { getTransacoes, deletarTransacao, deletarTodasTransacoes } from '../services/api'
import Alerta from '../components/Alerta'

function formatBRL(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatData(dataISO) {
  return new Date(dataISO).toLocaleDateString('pt-BR')
}

function getNomeDoToken() {
  try {
    const token = localStorage.getItem('token')
    if (!token) return 'Usuário'
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || 'Usuário'
  } catch {
    return 'Usuário'
  }
}

function GraficoSVG({ dados }) {
  if (!dados || dados.length === 0) return (
    <p className="text-gray-500 text-sm text-center py-8">Sem dados para exibir</p>
  )

  if (dados.length === 1) return (
    <p className="text-gray-500 text-sm text-center py-8">Cadastre transações em meses diferentes para exibir o gráfico</p>
  )

  const W = 600, H = 200, padX = 40, padY = 16
  const maxVal = Math.max(...dados.map(d => Math.max(d.receita, d.despesa)))
  const minVal = Math.min(...dados.map(d => Math.min(d.receita, d.despesa)))
  const range = maxVal - minVal || 1
  const xPos = (i) => padX + (i / (dados.length - 1)) * (W - padX * 2)
  const yPos = (v) => padY + ((maxVal - v) / range) * (H - padY * 2)
  const pontos = (chave) => dados.map((d, i) => `${xPos(i)},${yPos(d[chave])}`).join(' ')

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 200 }}>
      {[0, 0.33, 0.66, 1].map((t, i) => (
        <line key={i} x1={padX} x2={W - padX}
          y1={padY + t * (H - padY * 2)} y2={padY + t * (H - padY * 2)}
          stroke="#2A2D36" strokeWidth="1" />
      ))}
      <polyline points={pontos('receita')} fill="none" stroke="#34d399" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      <polyline points={pontos('despesa')} fill="none" stroke="#f87171" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {dados.map((d, i) => (
        <text key={i} x={xPos(i)} y={H - 2} textAnchor="middle" fill="#6b7280" fontSize="11">{d.mes}</text>
      ))}
      {dados.map((d, i) => <circle key={i} cx={xPos(i)} cy={yPos(d.receita)} r="3" fill="#34d399" />)}
      {dados.map((d, i) => <circle key={i} cx={xPos(i)} cy={yPos(d.despesa)} r="3" fill="#f87171" />)}
    </svg>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [carregando, setCarregando] = useState(true)
  const [transacoes, setTransacoes] = useState([])
  const [erro, setErro] = useState('')
  const [confirmarLimpar, setConfirmarLimpar] = useState(false)
  const nome = getNomeDoToken()

   useEffect(() => {
      async function carregar() {
    try {
      await new Promise(r => setTimeout(r, 1000)) // delay pra testar
      const data = await getTransacoes()
      setTransacoes(data)
    } catch (err) {
      setErro(err.message)
    } finally {
      setCarregando(false)
    }
  }
  carregar()
   }, [])
  const receita = transacoes.filter(t => t.tipo === 0).reduce((acc, t) => acc + t.valor, 0)
  const despesa = transacoes.filter(t => t.tipo === 1).reduce((acc, t) => acc + t.valor, 0)
  const saldo = receita - despesa
  const economia = receita > 0 ? ((saldo / receita) * 100).toFixed(1) : '0.0'

  const dadosMensais = Object.values(
    transacoes.reduce((acc, t) => {
      const mes = new Date(t.data).toLocaleString('pt-BR', { month: 'short' })
      if (!acc[mes]) acc[mes] = { mes, receita: 0, despesa: 0 }
      if (t.tipo === 0) acc[mes].receita += t.valor
      else acc[mes].despesa += t.valor
      return acc
    }, {})
  )

  const cards = [
    { label: 'Receita Total',    valor: formatBRL(receita), icon: <IconeEntrada />, cor: 'text-green-400',  bg: '#1a2e22' },
    { label: 'Despesa Total',    valor: formatBRL(despesa), icon: <IconeSaida />,   cor: 'text-red-400',    bg: '#2e1a1a' },
    { label: 'Saldo Líquido',    valor: formatBRL(saldo),   icon: <IconeDinheiro />,cor: 'text-blue-400',   bg: '#1a222e' },
    { label: 'Taxa de Economia', valor: `${economia}%`,     icon: <IconeGrafico />, cor: 'text-yellow-400', bg: '#2e2a1a' },
  ]

async function handleDeletar(id) {
  try {
    await deletarTransacao(id)
    setTransacoes(prev => prev.filter(t => t.id !== id))
  } catch (err) {
    setErro(err.message)
  }
}

async function handleLimparTudo() {
  try {
    await deletarTodasTransacoes()
    setTransacoes([])
    setConfirmarLimpar(false)
  } catch (err) {
    setErro(err.message)
  }
}

  if (carregando) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4"
        style={{ backgroundColor: '#16181d' }}>
        <div className="w-12 h-12 rounded-full border-4 animate-spin"
          style={{ borderColor: '#055B8C', borderTopColor: 'transparent' }} />
        <p className="text-gray-400 text-sm">Carregando dashboard...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#16181d' }}>

      <header className="flex items-center justify-between px-8 py-4 shadow-md" style={{ backgroundColor: '#1F2025' }}>
        <img src="./imagens/logo.png" alt="Logo" className="h-8 w-auto" />
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/nova-transacao')}
            className="px-4 py-2 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#055B8C' }}>
            + Nova Transação
          </button>
          <span className="text-gray-400 text-sm">
            Olá, <span className="text-white font-medium">{nome}</span>
          </span>
          <button
            onClick={() => { localStorage.removeItem('token'); navigate('/') }}
            className="flex items-center gap-1 text-gray-400 text-sm hover:text-white transition-colors">
            <IconeSair />
            Sair
          </button>
        </div>
      </header>

      <main className="px-8 py-8 max-w-6xl mx-auto space-y-8">

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {cards.map(({ label, valor, icon, cor, bg }, i) => (
            <div key={i} className="rounded-xl p-5 flex flex-col gap-3" style={{ backgroundColor: '#1F2025' }}>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">{label}</span>
                <div className={`p-2 rounded-lg ${cor}`} style={{ backgroundColor: bg }}>
                  {icon}
                </div>
              </div>
              <p className={`text-2xl font-semibold ${cor}`}>{valor}</p>
            </div>
          ))}
        </div>

       {/* Gráfico mensal */}
       <div className="rounded-xl p-6" style={{ backgroundColor: '#1F2025' }}>
         <h2 className="text-white font-medium mb-4">Receitas vs Despesas</h2>
         <div className="flex items-center gap-4 mb-4">
           <span className="flex items-center gap-1 text-xs text-green-400">
             <span className="inline-block w-3 h-[2px] bg-green-400 rounded" /> Receita
           </span>
           <span className="flex items-center gap-1 text-xs text-red-400">
             <span className="inline-block w-3 h-[2px] bg-red-400 rounded" /> Despesa
           </span>
         </div>
         <GraficoSVG dados={dadosMensais} />
       </div>

       <div className="rounded-xl p-6" style={{ backgroundColor: '#1F2025' }}>
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-white font-medium">Últimas Transações</h2>
    {transacoes.length > 0 && (
      <button
        onClick={() => setConfirmarLimpar(true)}
        className="text-red-400 text-xs hover:text-red-300 transition-colors">
        Limpar tudo
      </button>
    )}
  </div>

  {/* Modal confirmação limpar tudo */}
  {confirmarLimpar && (
    <div className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
      <div className="rounded-2xl p-6 w-full max-w-sm shadow-xl"
        style={{ backgroundColor: '#1F2025', border: '1px solid #2A2D36' }}>
        <div className="h-1 w-full rounded-t-2xl -mt-6 mb-6" style={{ backgroundColor: '#e74c3c' }} />
        <h2 className="text-white font-semibold mb-2">Apagar tudo?</h2>
        <p className="text-gray-400 text-sm mb-6">Todas as transações serão removidas permanentemente.</p>
        <div className="flex gap-3">
          <button
            onClick={() => setConfirmarLimpar(false)}
            className="flex-1 py-2 rounded-xl text-sm text-gray-400 hover:text-white transition-colors"
            style={{ backgroundColor: '#2A2D36' }}>
            Cancelar
          </button>
          <button
            onClick={handleLimparTudo}
            className="flex-1 py-2 rounded-xl text-sm text-white font-medium transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#c0392b' }}>
            Apagar tudo
          </button>
        </div>
      </div>
    </div>
  )}

  {transacoes.length === 0 ? (
    <p className="text-gray-500 text-sm text-center py-8">Nenhuma transação cadastrada ainda.</p>
  ) : (
    <div className="space-y-3">
      {transacoes.slice(0, 10).map((t) => (
        <div key={t.id} className="flex items-center justify-between py-3 border-b border-gray-800 last:border-0">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${t.tipo === 0 ? 'text-green-400' : 'text-red-400'}`}
              style={{ backgroundColor: t.tipo === 0 ? '#1a2e22' : '#2e1a1a' }}>
              {t.tipo === 0 ? <IconeEntrada /> : <IconeSaida />}
            </div>
            <div>
              <p className="text-white text-sm">{t.descricao}</p>
              <p className="text-gray-500 text-xs">{formatData(t.data)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-sm font-medium ${t.tipo === 0 ? 'text-green-400' : 'text-red-400'}`}>
              {t.tipo === 0 ? '+' : '-'}{formatBRL(t.valor)}
            </span>
            <button
              onClick={() => handleDeletar(t.id)}
              className="text-gray-600 hover:text-red-400 transition-colors text-xs">
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  )}
</div>
       </main>
      <Alerta mensagem={erro} onFechar={() => setErro('')} />
    </div>
  )
}