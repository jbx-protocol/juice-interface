import { Contract } from 'ethers'
import { JB721DelegateVersion } from 'models/v2v3/contracts'
import { createContext } from 'react'

interface JB721DelegateContracts {
  JB721TieredDelegate?: Contract
  JB721TieredDelegateStore?: Contract
}

interface JB721DelegateContractsLoading {
  JB721TieredDelegateStoreLoading: boolean
}

export const JB721DelegateContractsContext = createContext<{
  contracts: JB721DelegateContracts
  loading: JB721DelegateContractsLoading
  version: JB721DelegateVersion | undefined
}>({
  contracts: {},
  loading: { JB721TieredDelegateStoreLoading: false },
  version: undefined,
})
