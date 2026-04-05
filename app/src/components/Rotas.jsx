import { Navigate } from 'react-router-dom'

export default function RotaProtegida({ children }) {
  const token = localStorage.getItem('token')
  if (!token) return <Navigate to="/" replace />
  return children
}

export function RotaPublica({ children }) {
  const token = localStorage.getItem('token')
  if (token) return <Navigate to="/dashboard" replace />
  return children
}