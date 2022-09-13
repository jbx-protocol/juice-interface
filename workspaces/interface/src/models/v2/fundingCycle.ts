import { BigNumber } from '@ethersproject/bignumber'

export type V2FundingCycleData = {
  duration: BigNumber
  weight: BigNumber
  discountRate: BigNumber
  ballot: string // hex, contract address
}

export type V2FundingCycleMetadataGlobal = {
  allowSetController: boolean
  allowSetTerminals: boolean
}

export type V2FundingCycleMetadata = {
  version?: number
  global: V2FundingCycleMetadataGlobal
  reservedRate: BigNumber
  redemptionRate: BigNumber
  ballotRedemptionRate: BigNumber
  pausePay: boolean
  pauseDistributions: boolean
  pauseRedeem: boolean
  pauseBurn: boolean
  allowMinting: boolean
  allowChangeToken: boolean
  allowTerminalMigration: boolean
  allowControllerMigration: boolean
  holdFees: boolean
  useTotalOverflowForRedemptions: boolean
  useDataSourceForPay: boolean
  useDataSourceForRedeem: boolean
  dataSource: string // hex, contract address
}

export type V2FundAccessConstraint = {
  terminal: string // address probably
  token: string // address
  distributionLimit: BigNumber
  distributionLimitCurrency: BigNumber
  overflowAllowance: BigNumber
  overflowAllowanceCurrency: BigNumber
}

export type V2FundingCycle = V2FundingCycleData & {
  number: BigNumber
  configuration: BigNumber
  basedOn: BigNumber
  start: BigNumber
  metadata: BigNumber // encoded FundingCycleMetadata
}

export enum BallotState {
  'active',
  'approved',
  'failed',
}
