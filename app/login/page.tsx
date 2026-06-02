'use client'

import { useState } from 'react'
import { useToast } from '../components/ToastProvider'
import { useRouter } from 'next/navigation'
import { getSupabase } from '@/app/lib/supabase'

export const dynamic = 'force-dynamic'

export default function LoginPage() {
  const router = useRouter()
  const supabase = getSupabase()
  const { showToast } = useToast()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validar dominio
    if (!email.endsWith('@millicom.com')) {
      setError('Solo correos @millicom.com permitidos')
      showToast('Solo correos @millicom.com permitidos', 'error')
      setLoading(false)
      return
    }

    if (!password || password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      showToast('La contraseña debe tener al menos 6 caracteres', 'error')
      setLoading(false)
      return
    }

    if (!supabase) {
      setError('Supabase no está configurado')
      showToast('Supabase no está configurado', 'error')
      setLoading(false)
      return
    }

    try {
      let result

      if (mode === 'signin') {
        // Intentar Sign In
        result = await supabase.auth.signInWithPassword({ email, password })

        if (result.error?.status === 400) {
          // Usuario no existe, sugerir signup
          setMode('signup')
          setError('Usuario no encontrado. Regístrate primero.')
          showToast('Usuario no encontrado. Regístrate primero.', 'info')
          setLoading(false)
          return
        }
      } else {
        // Sign Up
        result = await supabase.auth.signUp({ email, password })
        if (!result.error) {
          showToast('Registro exitoso. Ahora puedes iniciar sesión.', 'success')
        }
      }

      if (result.error) {
        setError(result.error.message)
        showToast(result.error.message, 'error')
      } else if (result.data.user) {
        // Login exitoso
        showToast('¡Bienvenido! Acceso exitoso.', 'success')
        router.push('/dashboard')
      }
    } catch (err) {
      setError('Error de conexión. Intenta de nuevo.')
      showToast('Error de conexión. Intenta de nuevo.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#001D4A]">
      <form onSubmit={handleSubmit} className="p-8 bg-white rounded-lg shadow-xl w-96">
        <h1 className="text-2xl font-bold mb-6 text-[#001D4A]">
          {mode === 'signin' ? 'Acceso Millicom' : 'Registrate en Millicom'}
        </h1>

        <input
          type="email"
          placeholder="email@millicom.com"
          className="w-full p-2 mb-4 border border-gray-300 rounded text-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Contraseña (min 6 caracteres)"
          className="w-full p-2 mb-4 border border-gray-300 rounded text-black"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#00A3E0] text-white p-2 rounded hover:bg-[#0089C1] disabled:opacity-50 transition"
        >
          {loading ? 'Cargando...' : mode === 'signin' ? 'Ingresar' : 'Registrarse'}
        </button>

        <button
          type="button"
          onClick={() => {
            setMode(mode === 'signin' ? 'signup' : 'signin')
            setError('')
          }}
          className="w-full mt-4 text-[#00A3E0] underline text-sm hover:text-[#0089C1]"
        >
          {mode === 'signin' ? '¿No tienes cuenta? Registrate' : '¿Ya tienes cuenta? Inicia sesión'}
        </button>
      </form>
    </div>
  )
}