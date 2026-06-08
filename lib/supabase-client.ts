import { createClient } from '@supabase/supabase-js'

const url = typeof window !== 'undefined' 
  ? (process.env.NEXT_PUBLIC_SUPABASE_URL || '')
  : (process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co')

const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(url || 'https://placeholder.supabase.co', key)
