'use client'

import { useEffect, useState } from 'react'
import { useToast } from '@/app/components/ToastProvider'
import { getSupabase } from '@/app/lib/supabase'
import { ProtectedRoute } from '@/app/components/ProtectedRoute'
import { useLang } from '@/app/context/LanguageContext'

interface Match {
  id: number
  home_team: string
  away_team: string
  match_date: string
  home_score: number | null
  away_score: number | null
}

interface Prediction {
  id?: number
  match_id: number
  predicted_home: number
  predicted_away: number
  points_earned?: number // Agregamos la propiedad de puntos ganados
}

export default function MatchesPage() {
  const supabase = getSupabase()
  const { showToast } = useToast()
  
  // Usamos el contexto global
  const { t } = useLang()

  const [matches, setMatches] = useState<Match[]>([])
  const [predictions, setPredictions] = useState<{ [key: number]: Prediction }>({})
  const [userPoints, setUserPoints] = useState<number>(0)
  const [userId, setUserId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      if (!supabase) return
      
      const { data: authData } = await supabase.auth.getSession()
      const uid = authData.session?.user?.id
      if (!uid) return
      setUserId(uid)

      const { data: profile } = await supabase.from('profiles').select('points').eq('id', uid).single()
      setUserPoints(profile?.points || 0)
      
      const past = new Date()
      past.setDate(past.getDate() - 2)

      const limitDate = new Date()
      limitDate.setDate(limitDate.getDate() + 5)
      limitDate.setHours(23, 59, 59)

      const { data: matchesData } = await supabase
      .from('matches')
      .select('*')
      .gte('match_date', past.toISOString())
      .lte('match_date', limitDate.toISOString())
      .order('match_date', { ascending: true })
          
      setMatches(matchesData || [])
      
      const { data: predsData } = await supabase.from('predictions').select('*').eq('user_id', uid)
      const predsMap: { [key: number]: Prediction } = {};
      (predsData || []).forEach((p: Prediction) => { predsMap[p.match_id] = p });
      setPredictions(predsMap)
      
      setLoading(false)
    }
    fetchData()
  }, [supabase])

  const handlePredictionChange = (matchId: number, field: 'predicted_home' | 'predicted_away', value: number) => {
    setPredictions((prev) => ({
      ...prev,
      [matchId]: { ...prev[matchId], match_id: matchId, [field]: value },
    }))
  }

  const handleSave = async (match: Match) => {
    setSaving(true)
    if (!supabase) return

    const pred = predictions[match.id]
    if (!pred || pred.predicted_home === undefined || pred.predicted_away === undefined || isNaN(pred.predicted_home) || isNaN(pred.predicted_away)) {
      showToast(t.errorIncomplete, 'error')
      setSaving(false)
      return
    }
    
    const deadline = new Date(match.match_date)
    deadline.setDate(deadline.getDate() - 1)
    deadline.setHours(23, 59, 59)
    
    if (new Date() > deadline) {
      showToast(t.errorClosed, 'error')
      setSaving(false)
      return
    }

    const { error: upsertError } = await supabase
      .from('predictions')
      .upsert({ user_id: userId, match_id: match.id, predicted_home: pred.predicted_home, predicted_away: pred.predicted_away } as any, { onConflict: 'user_id, match_id' } as any)

    if (upsertError) {
      showToast(upsertError.message, 'error')
    } else {
      showToast(t.successSave, 'success')
    }
    setSaving(false)
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 text-black py-10 w-full flex flex-col items-center">
        <div className="w-full max-w-4xl px-6 md:px-8 flex flex-col md:flex-row justify-between items-center border-b pb-4 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#001D4A] mb-4 md:mb-0">
            {t.matchesTitle}
          </h1>
          <div className="bg-[#001D4A] text-white px-6 py-2 rounded-lg font-bold shadow-md">
            {t.myPoints}: <span className="text-[#00A3E0] text-xl ml-2">{userPoints} {t.pts}</span>
          </div>
        </div>
          
        <div className="w-full max-w-4xl px-6 md:px-8">
          {loading ? (
            <div className="text-center text-gray-500 py-10">{t.loading}</div>
          ) : (
            <div className="space-y-6">
              {matches.map((match) => {
                const pred = predictions[match.id] || {}
                const deadline = new Date(match.match_date)
                deadline.setDate(deadline.getDate() - 1)
                deadline.setHours(23, 59, 59)
                const closed = new Date() > deadline

                // Validamos si el partido ya tiene resultado final en BD
                const isFinished = match.home_score !== null && match.away_score !== null

                return (
                  <div key={match.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6 hover:shadow-md transition-shadow">
                    <div className="flex-1">
                      <div className="font-bold text-xl mb-1 text-[#001D4A]">{match.home_team} <span className="text-gray-400 font-normal mx-2">vs</span> {match.away_team}</div>
                      <div className="text-gray-500 text-sm">{new Date(match.match_date).toLocaleString()}</div>
                      {closed && !isFinished && <span className="inline-block mt-2 text-xs bg-red-100 text-red-600 font-bold px-2 py-1 rounded">{t.closed}</span>}
                    </div>
                    
                    <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
                      {isFinished ? (
                        /* UI PARA PARTIDOS FINALIZADOS */
                        <div className="flex flex-col items-center w-full min-w-[200px]">
                           <span className="text-xs text-gray-500 font-bold mb-1">{t.realScore}: {match.home_score} - {match.away_score}</span>
                           <div className="bg-[#00A3E0] text-white px-4 py-1 rounded-full font-bold text-sm shadow mt-1">
                             +{pred.points_earned || 0} {t.pts}
                           </div>
                        </div>
                      ) : (
                        /* UI PARA PRONOSTICAR */
                        <>
                          <input type="number" min={0} max={20} disabled={closed} value={pred.predicted_home !== undefined && !isNaN(pred.predicted_home) ? pred.predicted_home : ''} onChange={e => handlePredictionChange(match.id, 'predicted_home', parseInt(e.target.value))} className="w-16 p-2 border rounded-md text-center text-black font-bold focus:ring-2 focus:ring-[#00A3E0] outline-none" />
                          <span className="font-bold text-gray-400">-</span>
                          <input type="number" min={0} max={20} disabled={closed} value={pred.predicted_away !== undefined && !isNaN(pred.predicted_away) ? pred.predicted_away : ''} onChange={e => handlePredictionChange(match.id, 'predicted_away', parseInt(e.target.value))} className="w-16 p-2 border rounded-md text-center text-black font-bold focus:ring-2 focus:ring-[#00A3E0] outline-none" />
                          <button disabled={closed || saving} onClick={() => handleSave(match)} className={`ml-2 px-6 py-2 rounded-md bg-[#00A3E0] text-white font-bold hover:bg-[#0089C1] transition-colors disabled:opacity-50`}>
                            {saving ? t.saving : t.save}
                          </button>
                        </  >
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}