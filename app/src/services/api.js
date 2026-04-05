const BASE_URL = 'https://localhost:7165/api'

function getToken() {
  return localStorage.getItem('token')
}

async function fetchComTratamento(url, options = {}) {
  try {
    const res = await fetch(url, options)
    return res
  } catch (err) {
    throw new Error('Não foi possível conectar ao servidor. Verifique se a API está rodando.')
  }
}

export async function login(email, senha) {
  const res = await fetchComTratamento(`${BASE_URL}/Auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha })
  })
  if (!res.ok) throw new Error('Email ou senha inválidos.')
  return res.json()
}

export async function cadastro(nome, email, senha) {
  const res = await fetchComTratamento(`${BASE_URL}/Auth/cadastro`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, email, senha })
  })
  if (!res.ok) throw new Error('Erro ao cadastrar.')
  return res.text()
}

export async function getTransacoes() {
  const res = await fetchComTratamento(`${BASE_URL}/Transacoes`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  })
  if (!res.ok) throw new Error('Erro ao buscar transações.')
  return res.json()
}

export async function criarTransacao(transacao) {
  const res = await fetchComTratamento(`${BASE_URL}/Transacoes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify(transacao)
  })
  if (!res.ok) throw new Error('Erro ao criar transação.')
  return res.json()
}

export async function deletarTransacao(id) {
  const res = await fetchComTratamento(`${BASE_URL}/Transacoes/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${getToken()}` }
  })
  if (!res.ok) throw new Error('Erro ao deletar transação.')
}

export async function deletarTodasTransacoes() {
  const res = await fetchComTratamento(`${BASE_URL}/Transacoes`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${getToken()}` }
  })
  if (!res.ok) throw new Error('Erro ao deletar transações.')
}