import { Contract } from 'ethers'

export enum V2V3ContractName {
  JBController = 'JBController',
  JBController3_1 = 'JBController3_1',
  JBDirectory = 'JBDirectory',
  JBETHPaymentTerminal = 'JBETHPaymentTerminal',
  JBETHPaymentTerminal3_1 = 'JBETHPaymentTerminal3_1',
  JBETHPaymentTerminal3_1_1 = 'JBETHPaymentTerminal3_1_1',
  JBETHPaymentTerminal3_1_2 = 'JBETHPaymentTerminal3_1_2',
  JBFundingCycleStore = 'JBFundingCycleStore',
  JBFundAccessConstraintsStore = 'JBFundAccessConstraintsStore',
  JBOperatorStore = 'JBOperatorStore',
  JBProjects = 'JBProjects',
  JBSplitsStore = 'JBSplitsStore',
  JBTokenStore = 'JBTokenStore',
  JBSingleTokenPaymentTerminalStore = 'JBSingleTokenPaymentTerminalStore',
  JBETHERC20ProjectPayerDeployer = 'JBETHERC20ProjectPayerDeployer',
  JBETHERC20SplitsPayerDeployer = 'JBETHERC20SplitsPayerDeployer',

  DeprecatedJBSplitsStore = 'DeprecatedJBSplitsStore',
  DeprecatedJBDirectory = 'DeprecatedJBDirectory',
}

export type V2V3Contracts = Record<V2V3ContractName, Contract>
