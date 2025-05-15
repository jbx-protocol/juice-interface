import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useConnectWallet } from '@web3-onboard/react'
import { useCallback } from 'react'
import { useDisconnect as useDisconnectWagmi } from 'wagmi'

export function useDisconnect() {
  const { disconnect: disconnectWagmi } = useDisconnectWagmi()

  const [{ wallet }, , disconnectHook] = useConnectWallet()
  const supabase = useSupabaseClient()

  const disconnect = useCallback(async () => {
    if (wallet) {
      await disconnectHook(wallet)
      await disconnectWagmi()

      await supabase.auth.signOut()
    }
  }, [disconnectHook, supabase.auth, wallet, disconnectWagmi])

  return disconnect
}
