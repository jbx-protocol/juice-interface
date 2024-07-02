import { Contract } from 'ethers'

export enum V2V3ContractName {
  JBDirectory = 'JBDirectory',
  JBProjects = 'JBProjects',
  JBFundingCycleStore = 'JBFundingCycleStore',
  JBFundAccessConstraintsStore = 'JBFundAccessConstraintsStore',
  JBOperatorStore = 'JBOperatorStore',
  JBSplitsStore = 'JBSplitsStore',
  JBTokenStore = 'JBTokenStore',

  JBSingleTokenPaymentTerminalStore = 'JBSingleTokenPaymentTerminalStore',
  JBSingleTokenPaymentTerminalStore3_1 = 'JBSingleTokenPaymentTerminalStore3_1',
  JBSingleTokenPaymentTerminalStore3_1_1 = 'JBSingleTokenPaymentTerminalStore3_1_1',

  JBETHERC20ProjectPayerDeployer = 'JBETHERC20ProjectPayerDeployer',

  JBController = 'JBController',
  JBController3_1 = 'JBController3_1',

  JBETHPaymentTerminal = 'JBETHPaymentTerminal',
  JBETHPaymentTerminal3_1 = 'JBETHPaymentTerminal3_1',
  JBETHPaymentTerminal3_1_1 = 'JBETHPaymentTerminal3_1_1',
  JBETHPaymentTerminal3_1_2 = 'JBETHPaymentTerminal3_1_2',
}
export type V2V3Contracts = Record<V2V3ContractName, Contract>

/**
 * Single source of truth for supported single token payment terminal store versions.
 *
 * DEV NOTE:
 * To support a new payment single token terminal store:
 * 1. Add it to V2V3ContractName
 * 2. Add it to this array
 * 3. Add support for it in any contract reads or transactions that use it.
 */
export const SUPPORTED_SINGLE_TOKEN_PAYMENT_TERMINAL_STORES = [
  V2V3ContractName.JBSingleTokenPaymentTerminalStore,
  V2V3ContractName.JBSingleTokenPaymentTerminalStore3_1,
  V2V3ContractName.JBSingleTokenPaymentTerminalStore3_1_1,
] as const
export type SingleTokenPaymentTerminalStoreVersion =
  (typeof SUPPORTED_SINGLE_TOKEN_PAYMENT_TERMINAL_STORES)[number]

/**
 * Single source of truth for supported terminal versions.
 *
 * DEV NOTE:
 * To support a new payment terminal:
 * 1. Add it to V2V3ContractName
 * 2. Add it to this array
 * 3. Add support for it in any contract reads or transactions that use it.
 */
export const SUPPORTED_PAYMENT_TERMINALS = [
  V2V3ContractName.JBETHPaymentTerminal,
  V2V3ContractName.JBETHPaymentTerminal3_1,
  V2V3ContractName.JBETHPaymentTerminal3_1_1,
  V2V3ContractName.JBETHPaymentTerminal3_1_2,
] as const
export type PaymentTerminalVersion =
  (typeof SUPPORTED_PAYMENT_TERMINALS)[number]

/**
 * Single source of truth for supported jbcontroller versions.
 *
 * DEV NOTE:
 * To support a new controllers:
 * 1. Add it to V2V3ContractName
 * 2. Add it to this array
 * 3. Add support for it in any contract reads or transactions that use it.
 */
export const SUPPORTED_CONTROLLERS = [
  V2V3ContractName.JBController,
  V2V3ContractName.JBController3_1,
] as const
export type ControllerVersion = (typeof SUPPORTED_CONTROLLERS)[number]

export enum JB721DelegateVersion {
  JB721DELEGATE_V3 = '3',
  JB721DELEGATE_V3_1 = '3-1',
  JB721DELEGATE_V3_2 = '3-2',
  JB721DELEGATE_V3_3 = '3-3',
  JB721DELEGATE_V3_4 = '3-4',
}
