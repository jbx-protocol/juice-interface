import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useConnectWallet } from '@web3-onboard/react'
import { useCallback } from 'react'

export function useDisconnect() {
  const [{ wallet }, , disconnectHook] = useConnectWallet()
  const supabase = useSupabaseClient()
  const disconnect = useCallback(async () => {
    if (wallet) {
      await disconnectHook(wallet)
      window.localStorage.removeItem('connectedWallets')
      await supabase.auth.signOut()
    }
  }, [disconnectHook, supabase.auth, wallet])
  return disconnect
}
