'use client'
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

// Inicializa aquí o usa tu archivo lib/supabase.ts
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('Password123!') // Default temporal para rapidez

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.endsWith('@millicom.com')) {
      alert('Solo correos @millicom.com')
      return
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) alert(error.message)
    else alert('Revisa tu correo para confirmar o ya puedes ingresar')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#001D4A]">
      <form onSubmit={handleLogin} className="p-8 bg-white rounded-lg shadow-xl w-96">
        <h1 className="text-2xl font-bold mb-6 text-[#001D4A]">Acceso Millicom</h1>
        <input 
          type="email" 
          placeholder="email@millicom.com"
          className="w-full p-2 mb-4 border rounded text-black"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="w-full bg-[#00A3E0] text-white p-2 rounded hover:bg-[#0089C1]">
          Registrarse / Entrar
        </button>
      </form>
    </div>
  )
}