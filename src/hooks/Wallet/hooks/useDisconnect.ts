import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useCallback } from 'react'
import { useDisconnect as useWagmiDisconnect } from 'wagmi'

export function useDisconnect() {
  const { disconnect } = useWagmiDisconnect()
  const supabase = useSupabaseClient()
  return useCallback(async () => {
    await disconnect()
    window.localStorage.removeItem('connectedWallets')
    await supabase.auth.signOut()
  }, [disconnect, supabase.auth])
}
