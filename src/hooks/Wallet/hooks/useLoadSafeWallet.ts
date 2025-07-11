import { useWallet } from 'hooks/Wallet'
import { useCallback } from 'react'

export function useLoadSafeWallet() {
  const { connect } = useWallet()

  const loadSafeWallet = useCallback(async () => {
    // @ts-ignore - Para wallet doesn't support Safe-specific options
    await connect()
  }, [connect])
  return loadSafeWallet
}
