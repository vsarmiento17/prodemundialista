'use client'

import { useEffect, useState } from 'react'
import { useToast } from '../components/ToastProvider'
import { getSupabase } from '@/app/lib/supabase'
import { ProtectedRoute } from '@/app/components/ProtectedRoute'

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
}

export default function MatchesPage() {
  const supabase = getSupabase()
  const { showToast } = useToast()
  const [matches, setMatches] = useState<Match[]>([])
  const [predictions, setPredictions] = useState<{ [key: number]: Prediction }>({})
  const [userId, setUserId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError('')
      if (!supabase) return
      // Obtener usuario actual
      const { data: authData } = await supabase.auth.getSession()
      const uid = authData.session?.user?.id
      if (!uid) {
        setError('No autenticado')
        setLoading(false)
        return
      }
      setUserId(uid)
      
      // Obtener partidos
      const { data: matchesData } = await supabase.from('matches').select('*').order('match_date', { ascending: true })
      setMatches(matchesData || [])
      
      // Obtener pronósticos del usuario
      const { data: predsData } = await supabase.from('predictions').select('*').eq('user_id', uid)
      
      // Corrección del mapeo
      const predsMap: { [key: number]: Prediction } = {};
      (predsData || []).forEach((p: Prediction) => { 
        predsMap[p.match_id] = p 
      });
      setPredictions(predsMap)
      setLoading(false)
    }
    fetchData()
  }, [supabase])

  const handlePredictionChange = (matchId: number, field: 'predicted_home' | 'predicted_away', value: number) => {
    setPredictions((prev) => ({
      ...prev,
      [matchId]: {
        ...prev[matchId],
        match_id: matchId,
        [field]: value,
      },
    }))
  }

  const handleSave = async (match: Match) => {
    setSaving(true)
    setError('')
    
    // Validación de Supabase para evitar Error 18047
    if (!supabase) {
      setError('Error de conexión a la base de datos')
      setSaving(false)
      return
    }

    const pred = predictions[match.id]
    if (!pred || pred.predicted_home === undefined || pred.predicted_away === undefined || isNaN(pred.predicted_home) || isNaN(pred.predicted_away)) {
      setError('Debes ingresar ambos marcadores')
      showToast('Debes ingresar ambos marcadores', 'error')
      setSaving(false)
      return
    }
    
    // Validar deadline (1 día antes a las 11:59 PM)
    const deadline = new Date(match.match_date)
    deadline.setDate(deadline.getDate() - 1)
    deadline.setHours(23, 59, 59)
    
    if (new Date() > deadline) {
      setError('El pronóstico está cerrado para este partido')
      showToast('El pronóstico está cerrado para este partido', 'error')
      setSaving(false)
      return
    }

    // Upsert (usando as any para evitar Error 2353 de TypeScript)
    const payload = {
      user_id: userId,
      match_id: match.id,
      predicted_home: pred.predicted_home,
      predicted_away: pred.predicted_away,
    };

    const { error: upsertError } = await supabase
      .from('predictions')
      .upsert(payload as any, { onConflict: 'user_id, match_id' } as any)

    if (upsertError) {
      setError(upsertError.message)
      showToast(upsertError.message, 'error')
    } else {
      showToast('Pronóstico guardado exitosamente', 'success')
    }
    setSaving(false)
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 text-black">
      <div className="max-w-3xl mx-auto py-10 px-4"></div>
        <h1 className="text-3xl font-bold text-[#001D4A] mb-8">Partidos y Pronósticos</h1>
        {loading ? (
          <div className="text-center text-gray-500">Cargando partidos...</div>
        ) : (
          <div className="space-y-8">
            {matches.map((match) => {
              const pred = predictions[match.id] || {}
              
              const deadline = new Date(match.match_date)
              deadline.setDate(deadline.getDate() - 1)
              deadline.setHours(23, 59, 59)
              const closed = new Date() > deadline

              return (
                <div key={match.id} className="bg-white rounded-lg shadow p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="font-bold text-lg mb-2">{match.home_team} vs {match.away_team}</div>
                    <div className="text-gray-500 text-sm mb-2">{new Date(match.match_date).toLocaleString()}</div>
                    {closed && <span className="text-red-500 font-bold">Pronóstico cerrado</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      max={20}
                      disabled={closed}
                      value={pred.predicted_home !== undefined ? pred.predicted_home : ''}
                      onChange={e => handlePredictionChange(match.id, 'predicted_home', parseInt(e.target.value))}
                      className="w-16 p-2 border rounded text-center text-black"
                      placeholder="L"
                    />
                    <span className="font-bold text-black">-</span>
                    <input
                      type="number"
                      min={0}
                      max={20}
                      disabled={closed}
                      value={pred.predicted_away !== undefined ? pred.predicted_away : ''}
                      onChange={e => handlePredictionChange(match.id, 'predicted_away', parseInt(e.target.value))}
                      className="w-16 p-2 border rounded text-center text-black"
                      placeholder="V"
                    />
                    <button
                      disabled={closed || saving}
                      onClick={() => handleSave(match)}
                      className={`ml-4 px-4 py-2 rounded bg-[#00A3E0] text-white font-bold hover:bg-[#0089C1] disabled:opacity-50`}
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
        {error && <div className="mt-6 text-red-500 font-bold text-center">{error}</div>}
      </div>
    </ProtectedRoute>
  )
}