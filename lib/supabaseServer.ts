import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Log presence of env vars (do not print actual values)
console.log('supabase env check - SUPABASE_URL present:', !!supabaseUrl)
console.log('supabase env check - SUPABASE_SERVICE_ROLE_KEY present:', !!supabaseServiceKey)

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set. API will fail without these env vars.')
}

export const supabaseAdmin = createClient(supabaseUrl || '', supabaseServiceKey || '', {
  auth: { persistSession: false },
})
