import {
  createBrowserSupabaseClient,
  Session,
} from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { useState } from 'react'

const SupabaseSessionProvider: React.FC<
  React.PropsWithChildren<{ initialSession: Session }>
> = ({ children, initialSession }) => {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient())

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={initialSession}
    >
      {children}
    </SessionContextProvider>
  )
}

export default SupabaseSessionProvider
