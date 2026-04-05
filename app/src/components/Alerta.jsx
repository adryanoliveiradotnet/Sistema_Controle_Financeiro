import { useEffect, useState } from 'react'

export default function Alerta({ mensagem, onFechar }) {
  const [visivel, setVisivel] = useState(false)

  useEffect(() => {
    if (mensagem) {
      setVisivel(true)
    }
  }, [mensagem])

  function fechar() {
    setVisivel(false)
    setTimeout(onFechar, 300)
  }

  if (!mensagem) return null

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 transition-all duration-300"
      style={{ backgroundColor: visivel ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0)' }}
      onClick={fechar}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-sm mx-4 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300"
        style={{
          backgroundColor: '#1F2025',
          border: '1px solid #2A2D36',
          transform: visivel ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(20px)',
          opacity: visivel ? 1 : 0,
        }}>

        {/* Barra topo */}
        <div className="h-1 w-full" style={{ backgroundColor: '#e74c3c' }} />

        <div className="p-6">
          {/* Ícone */}
          <div className="flex justify-center mb-4">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#2e1a1a' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                  stroke="#f87171"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* Título */}
          <h2 className="text-white text-center font-semibold text-lg mb-2">
            Ops, algo deu errado
          </h2>

          {/* Mensagem */}
          <p className="text-gray-400 text-sm text-center mb-6 leading-relaxed">
            {mensagem}
          </p>

          {/* Botão */}
          <button
            onClick={fechar}
            className="w-full py-2.5 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#055B8C' }}>
            Entendido
          </button>
        </div>
      </div>
    </div>
  )
}