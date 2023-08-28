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

/**
 * Single source of truth for supported terminal versions.
 *
 * DEV NOTE:
 * To support a new payment terminal:
 * 1. Add it to V2V3ContractName
 * 2. Add it to this array
 * 3. Add support for it in any other transactions that use it.
 */
export const SUPPORTED_PAYMENT_TERMINALS = [
  V2V3ContractName.JBETHPaymentTerminal,
  V2V3ContractName.JBETHPaymentTerminal3_1,
  V2V3ContractName.JBETHPaymentTerminal3_1_1,
  V2V3ContractName.JBETHPaymentTerminal3_1_2,
] as const

export type PaymentTerminalVersion =
  (typeof SUPPORTED_PAYMENT_TERMINALS)[number]
