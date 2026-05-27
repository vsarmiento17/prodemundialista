'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabase } from '@/app/lib/supabase'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const supabase = getSupabase()
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    async function checkAuth() {
      if (!supabase) {
        router.push('/login')
        return
      }

      const { data } = await supabase.auth.getSession()

      if (!data.session) {
        router.push('/login')
      } else {
        setAuthenticated(true)
      }

      setLoading(false)
    }

    checkAuth()
  }, [supabase, router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#001D4A]">
        <p className="text-white text-xl">Cargando...</p>
      </div>
    )
  }

  if (!authenticated) {
    return null
  }

  return <>{children}</>
}
