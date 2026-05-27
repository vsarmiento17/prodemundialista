import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://ywueyjwvkzjcifvtbrbo.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'sb_publishable_d7PCB7GhFK2zSAtCSGrorg_suL-Xeb8'

let supabaseClient: ReturnType<typeof createClient> | null = null

// Exportamos una función que crea el cliente solo si las variables existen
export const getSupabase = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('⚠️ Supabase no está configurado - faltan variables de entorno')
    return null
  }

  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
  }

  return supabaseClient
}