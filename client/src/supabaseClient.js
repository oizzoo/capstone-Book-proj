import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://ibdkdhbzffiglwzttrsc.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImliZGtkaGJ6ZmZpZ2x3enR0cnNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NjQ2MzEsImV4cCI6MjA3ODU0MDYzMX0.0IuZryY-28clUJX0O-0uzOwObhqgAFAo4i8nMC_ahwk"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
