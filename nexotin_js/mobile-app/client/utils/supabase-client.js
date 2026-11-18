
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://yvzpwrypigcehockihcn.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2enB3cnlwaWdjZWhvY2tpaGNuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNzUyOTQ3NCwiZXhwIjoyMDQzMTA1NDc0fQ.reD_QDxyutJZqwX5s5OG5srsXcXYe8ox95tQJTIkO-Q"



  
export const supabaseClient = createClient(supabaseUrl, supabaseKey)
