'use client'
import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.endsWith('@millicom.com')) {
      alert('Acceso restringido: Solo correos @millicom.com')
      return
    }
    // Aquí irá la lógica de supabase.auth.signInWithPassword
    console.log('Autenticando usuario Millicom...')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#001D4A]"> {/* Azul Tigo */}
      <form onSubmit={handleLogin} className="p-8 bg-white rounded-lg shadow-xl w-96">
        <h1 className="text-2xl font-bold mb-6 text-[#001D4A]">Quiniela Mundialista</h1>
        <input 
          type="email" 
          placeholder="tu.nombre@millicom.com"
          className="w-full p-2 mb-4 border rounded"
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" className="w-full bg-[#00A3E0] text-white p-2 rounded hover:bg-[#0089C1]">
          Ingresar
        </button>
      </form>
    </div>
  )
}