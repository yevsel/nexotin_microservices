// import { RealtimeClient } from '@supabase/realtime-js'

// const supabase = new RealtimeClient(REALTIME_URL, {
//     params: {
//       apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl2enB3cnlwaWdjZWhvY2tpaGNuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNzUyOTQ3NCwiZXhwIjoyMDQzMTA1NDc0fQ.reD_QDxyutJZqwX5s5OG5srsXcXYe8ox95tQJTIkO-Q"
//     },
//   })

// const chatTable = supabase.channel('custom-insert-channel')
//   .on(
//     'postgres_changes',
//     { event: 'INSERT', schema: 'public', table: 'chat_table' },
//     (payload) => {
//       console.log('Change received!', payload)
//     }
//   )
//   .subscribe()