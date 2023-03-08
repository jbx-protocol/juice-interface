import { Contract } from '@ethersproject/contracts'
import { createContext } from 'react'

export interface JB721DelegateContracts {
  JB721TieredDelegate?: Contract
  JB721TieredDelegateStore?: Contract
}

export interface JB721DelegateContractsLoading {
  JB721TieredDelegateStoreLoading?: boolean
}

export const JB721DelegateContractsContext: React.Context<{
  contracts: JB721DelegateContracts
  loading: JB721DelegateContractsLoading
  version?: string
}> = createContext({
  contracts: {},
  loading: {},
})
