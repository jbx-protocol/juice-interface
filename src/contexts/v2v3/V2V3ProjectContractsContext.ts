import { Contract } from '@ethersproject/contracts'
import { createContext } from 'react'

export interface V2V3ProjectContracts {
  JBController?: Contract
  JBETHPaymentTerminal?: Contract
}

export const V2V3ProjectContractsContext: React.Context<{
  contracts: V2V3ProjectContracts
}> = createContext({
  contracts: {},
})
