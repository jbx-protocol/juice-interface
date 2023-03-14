import { Contract } from '@ethersproject/contracts'
import { JBControllerVersion } from 'hooks/v2v3/V2V3ProjectContracts/projectContractLoaders/ProjectController'
import { JBETHPaymentTerminalVersion } from 'hooks/v2v3/V2V3ProjectContracts/projectContractLoaders/ProjectPrimaryEthTerminal'
import { createContext } from 'react'

export interface V2V3ProjectContracts {
  JBController?: Contract
  JBETHPaymentTerminal?: Contract
  JBETHPaymentTerminalStore?: Contract
  JBFundAccessConstraintsStore?: Contract
}

export const V2V3ProjectContractsContext: React.Context<{
  contracts: V2V3ProjectContracts
  loading: {
    cvsLoading?: boolean
    projectContractsLoading?: {
      JBControllerLoading: boolean
      JBETHPaymentTerminalLoading: boolean
      JBETHPaymentTerminalStoreLoading: boolean
      JBFundAccessConstraintsStoreLoading: boolean
    }
  }
  versions: {
    JBControllerVersion?: JBControllerVersion
    JBETHPaymentTerminalVersion?: JBETHPaymentTerminalVersion
  }
}> = createContext({
  contracts: {},
  loading: {},
  versions: {},
})
