import { startTransition, useEffect } from 'react'
import { useLoadSafeWallet } from './hooks'

export function useInitWallet() {
  const loadSafeWallet = useLoadSafeWallet()

  // If possible, load Safe wallets
  useEffect(() => {
    startTransition(() => {
      loadSafeWallet()
    })
  }, [loadSafeWallet])
}
