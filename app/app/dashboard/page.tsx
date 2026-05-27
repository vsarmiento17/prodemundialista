export const dynamic = 'force-dynamic';
'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export default function Dashboard() {
  const [leaders, setLeaders] = useState<any[]>([])

  useEffect(() => {
    async function fetchLeaders() {
      const { data } = await supabase.from('profiles').select('*').order('points', { ascending: false })
      setLeaders(data || [])
    }
    fetchLeaders()
  }, [])

  return (
    <div className="p-8 bg-zinc-50 min-h-screen">
      <h1 className="text-3xl font-bold text-[#001D4A] mb-6">Líderes Globales</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b text-[#00A3E0]">
              <th className="p-2">Posición</th>
              <th className="p-2">Colaborador</th>
              <th className="p-2">Puntos</th>
            </tr>
          </thead>
          <tbody>
            {leaders.map((user, index) => (
              <tr key={user.id} className="border-b">
                <td className="p-2 font-bold">{index + 1}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">{user.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}// Este código muestra un dashboard con una tabla de líderes globales, ordenados por puntos. Se obtiene la información de la tabla 'profiles' en Supabase y se muestra en una tabla estilizada.