import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useConnectWallet } from '@web3-onboard/react'
import { useCallback } from 'react'

export function useDisconnect() {
  const [{ wallet }, , disconnectHook] = useConnectWallet()
  const supabase = useSupabaseClient()
  
  const disconnect = useCallback(async () => {
    if (wallet) {
      await disconnectHook(wallet)
      
      // Note: don't think this is needed anymore, connectedWallets key doesnt seem to be used
      window.localStorage.removeItem('connectedWallets')
      
      // Clear wagmi.store specifically which maintains connection state
      // -> causes bugs when different wallet types connect in sequence
      window.localStorage.removeItem('wagmi.store')
      
      // Clear any other keys that might be related to web3-onboard or wagmi
      const localStorageKeys = Object.keys(localStorage)
      const onboardStateKeys = localStorageKeys.filter(key => 
        key.includes('walletlink') ||
        key.includes('wagmi')
      )
      for (const key of onboardStateKeys) {
        window.localStorage.removeItem(key)
      }
      
      await supabase.auth.signOut()
    }
  }, [disconnectHook, supabase.auth, wallet])
  
  return disconnect
}
