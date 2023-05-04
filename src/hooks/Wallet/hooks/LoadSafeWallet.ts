import { useWallet } from 'hooks/Wallet'
import { useCallback } from 'react'

export function useLoadSafeWallet() {
  const { connect } = useWallet()

  const loadSafeWallet = useCallback(async () => {
    await connect({ autoSelect: { label: 'Safe', disableModals: true } })
  }, [connect])
  return loadSafeWallet
}
