import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

/**
 * Shared Supabase Client.
 * Used for interactions that bypass the custom backend (if any) or validation.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey)