import { Contract } from '@ethersproject/contracts'

export enum JuiceboxV2ContractName {
  JBController = 'JBController',
  JBDirectory = 'JBDirectory',
  JBETHPaymentTerminal = 'JBETHPaymentTerminal',
  JBFundingCycleStore = 'JBFundingCycleStore',
  JBOperatorStore = 'JBOperatorStore',
  JBPrices = 'JBPrices',
  JBProjects = 'JBProjects',
  JBSplitsStore = 'JBSplitsStore',
  // JBToken = 'JBToken', // not deployed on rinkeby yet
  JBTokenStore = 'JBTokenStore',
}

export type JuiceboxV2Contracts = Record<JuiceboxV2ContractName, Contract>
