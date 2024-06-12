import { JB721DelegateContractsContext } from 'packages/v2v3/contexts/NftRewards/JB721DelegateContracts/JB721DelegateContractsContext'
import { useContext } from 'react'

export function useHasNftRewards(): { value: boolean; loading: boolean } {
  const {
    version: JB721DelegateVersion,
    loading: { JB721TieredDelegateStoreLoading },
  } = useContext(JB721DelegateContractsContext)

  return {
    value: Boolean(JB721DelegateVersion),
    loading: JB721TieredDelegateStoreLoading,
  }
}
