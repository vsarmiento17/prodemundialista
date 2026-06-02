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
      
      const { data: authData } = await supabase.auth.getSession()
      const uid = authData.session?.user?.id
      if (!uid) {
        setError('No autenticado')
        setLoading(false)
        return
      }
      setUserId(uid)
      
      const { data: matchesData } = await supabase.from('matches').select('*').order('match_date', { ascending: true })
      setMatches(matchesData || [])
      
      const { data: predsData } = await supabase.from('predictions').select('*').eq('user_id', uid)
      
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
    
    const deadline = new Date(match.match_date)
    deadline.setDate(deadline.getDate() - 1)
    deadline.setHours(23, 59, 59)
    
    if (new Date() > deadline) {
      setError('El pronóstico está cerrado para este partido')
      showToast('El pronóstico está cerrado para este partido', 'error')
      setSaving(false)
      return
    }

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
      {/* Wrapper principal: Ocupa todo el ancho y centra el contenido interno */}
      <div className="min-h-screen bg-gray-50 text-black py-10 w-full flex justify-center">
        {/* Contenedor interno: Limita el ancho máximo y da márgenes */}
        <div className="w-full max-w-4xl px-6 md:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#001D4A] mb-8 text-center md:text-left border-b pb-4">
            Partidos y Pronósticos
          </h1>
          
          {loading ? (
            <div className="text-center text-gray-500 py-10">Cargando partidos...</div>
          ) : (
            <div className="space-y-6">
              {matches.map((match) => {
                const pred = predictions[match.id] || {}
                
                const deadline = new Date(match.match_date)
                deadline.setDate(deadline.getDate() - 1)
                deadline.setHours(23, 59, 59)
                const closed = new Date() > deadline

                return (
                  <div key={match.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6 hover:shadow-md transition-shadow">
                    <div className="flex-1">
                      <div className="font-bold text-xl mb-1 text-[#001D4A]">{match.home_team} <span className="text-gray-400 font-normal mx-2">vs</span> {match.away_team}</div>
                      <div className="text-gray-500 text-sm flex items-center gap-2">
                        <span>{new Date(match.match_date).toLocaleString()}</span>
                      </div>
                      {closed && <span className="inline-block mt-2 text-xs bg-red-100 text-red-600 font-bold px-2 py-1 rounded">Cerrado</span>}
                    </div>
                    
                    <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <input
                        type="number"
                        min={0}
                        max={20}
                        disabled={closed}
                        // Validación agregada: Si es NaN, pasa un string vacío
                        value={pred.predicted_home !== undefined && !isNaN(pred.predicted_home) ? pred.predicted_home : ''}
                        onChange={e => handlePredictionChange(match.id, 'predicted_home', parseInt(e.target.value))}
                        className="w-16 p-2 border rounded-md text-center text-black font-bold text-lg focus:ring-2 focus:ring-[#00A3E0] outline-none"
                        placeholder="L"
                      />
                      <span className="font-bold text-gray-400">-</span>
                      <input
                        type="number"
                        min={0}
                        max={20}
                        disabled={closed}
                        // Validación agregada: Si es NaN, pasa un string vacío
                        value={pred.predicted_away !== undefined && !isNaN(pred.predicted_away) ? pred.predicted_away : ''}
                        onChange={e => handlePredictionChange(match.id, 'predicted_away', parseInt(e.target.value))}
                        className="w-16 p-2 border rounded-md text-center text-black font-bold text-lg focus:ring-2 focus:ring-[#00A3E0] outline-none"
                        placeholder="V"
                      />
                      <button
                        disabled={closed || saving}
                        onClick={() => handleSave(match)}
                        className={`ml-2 px-6 py-2 rounded-md bg-[#00A3E0] text-white font-bold hover:bg-[#0089C1] transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {saving ? '...' : 'Guardar'}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
          {error && <div className="mt-8 p-4 bg-red-50 text-red-600 border border-red-200 rounded-lg font-bold text-center">{error}</div>}
        </div>
      </div>
    </ProtectedRoute>
  )
}