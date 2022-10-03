import { Contract } from '@ethersproject/contracts'
import { createContext } from 'react'

export const V2V3ProjectContractsContext: React.Context<{
  contracts: {
    JBController?: Contract
  }
}> = createContext({
  contracts: {},
})
