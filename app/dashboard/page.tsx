'use client'

import { useEffect, useState } from 'react'
import { useToast } from '../components/ToastProvider'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'
import { getSupabase } from '@/app/lib/supabase'
import { ProtectedRoute } from '@/app/components/ProtectedRoute'
import { LeaderboardView } from '@/app/components/LeaderboardView'
import { TabNavigation } from '@/app/components/TabNavigation'

interface Match {
  id: number
  home_team: string
  away_team: string
  match_date: string
  home_score: number | null
  away_score: number | null
}

export const dynamic = 'force-dynamic'

interface Leader {
  id: string
  email: string
  display_name?: string
  points_global: number
  points_weekly: number
  points_monthly: number
  points_daily: number
}

export default function DashboardPage() {
  const router = useRouter()
  const supabase = getSupabase()
  const { showToast } = useToast()

  const [activeTab, setActiveTab] = useState('Global')
  const [leaders, setLeaders] = useState<Leader[]>([])
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState('')
  const [nextMatches, setNextMatches] = useState<Match[]>([])

  const tabs = ['Global', 'Semanal', 'Mensual', 'Diario']

  useEffect(() => {
    async function fetchData() {
      if (!supabase) {
        router.push('/login')
        return
      }

      // Obtener usuario actual
      const { data: authData } = await supabase.auth.getSession()
      if (authData.session?.user) {
        setUserEmail(authData.session.user.email || '')
      }

      // Fetch líderes
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .order('points_global', { ascending: false })
        .limit(20)
      setLeaders((data as Leader[]) || [])

      // Fetch próximos partidos (los siguientes 3)
      const { data: matchesData } = await supabase
        .from('matches')
        .select('*')
        .gt('match_date', new Date().toISOString())
        .order('match_date', { ascending: true })
        .limit(3)
      setNextMatches(matchesData || [])

      setLoading(false)
    }

    fetchData()
  }, [supabase, router])

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut()
      showToast('Sesión cerrada', 'info')
      router.push('/login')
    }
  }

  const getLeadersByTab = (tab: string) => {
    const fieldMap: { [key: string]: keyof Leader } = {
      Global: 'points_global',
      Semanal: 'points_weekly',
      Mensual: 'points_monthly',
      Diario: 'points_daily',
    }

    const pointsField = fieldMap[tab]

    return leaders
      .map((leader) => ({
        ...leader,
        points: leader[pointsField] as number,
      }))
      .sort((a, b) => b.points - a.points)
  }

  const getCurrentLeaders = getLeadersByTab(activeTab)

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-[#001D4A] to-[#0A2E6E]">
        {/* Header */}
        <div className="bg-[#001D4A] shadow-lg">
          <div className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white">🏆 Quiniela Mundialista 2026</h1>
              <p className="text-[#00A3E0] text-sm mt-1">Bienvenido, {userEmail?.split('@')[0]}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
            >
              <LogOut size={18} />
              Salir
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-8 py-10">
          {/* Tabs */}
          <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />


          {/* Leaderboard */}
          {loading ? (
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <p className="text-gray-500 text-lg">Cargando líderes...</p>
            </div>
          ) : (
            <>
              <LeaderboardView
                leaders={getCurrentLeaders}
                title={`Líderes ${activeTab}`}
              />

              {/* Próximos partidos */}
              <div className="mt-10 bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-[#001D4A] mb-4">⚽ Próximos partidos</h3>
                {nextMatches.length === 0 ? (
                  <p className="text-gray-500">No hay partidos próximos.</p>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {nextMatches.map((m) => (
                      <li key={m.id} className="py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <span className="font-semibold text-[#001D4A]">{m.home_team} vs {m.away_team}</span>
                        <span className="text-gray-600 text-sm">{new Date(m.match_date).toLocaleString()}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}

          {/* Info Section */}
          <div className="mt-10 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-[#001D4A] mb-4">📋 Sistema de Puntuación</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="border-l-4 border-[#00A3E0] pl-4">
                <p className="font-semibold text-[#001D4A]">Global</p>
                <p className="text-sm text-gray-600">Puntos totales de todo el torneo</p>
              </div>
              <div className="border-l-4 border-[#00FF00] pl-4">
                <p className="font-semibold text-[#001D4A]">Semanal</p>
                <p className="text-sm text-gray-600">Puntos de esta semana</p>
              </div>
              <div className="border-l-4 border-[#FF00FF] pl-4">
                <p className="font-semibold text-[#001D4A]">Mensual</p>
                <p className="text-sm text-gray-600">Puntos de este mes</p>
              </div>
              <div className="border-l-4 border-[#FFD700] pl-4">
                <p className="font-semibold text-[#001D4A]">Diario</p>
                <p className="text-sm text-gray-600">Puntos de hoy</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}