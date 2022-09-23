import { BigNumber } from '@ethersproject/bignumber'
import { V2FundingCycleMetadata } from 'models/v2/fundingCycle'
import { V3FundingCycleMetadata } from 'models/v3/fundingCycle'

export type BaseV2V3FundingCycleMetadata = {
  version?: number
  reservedRate: BigNumber
  redemptionRate: BigNumber
  ballotRedemptionRate: BigNumber
  pausePay: boolean
  pauseDistributions: boolean
  pauseRedeem: boolean
  pauseBurn: boolean
  allowMinting: boolean
  allowTerminalMigration: boolean
  allowControllerMigration: boolean
  holdFees: boolean
  useTotalOverflowForRedemptions: boolean
  useDataSourceForPay: boolean
  useDataSourceForRedeem: boolean
  dataSource: string // hex, contract address
}

export type V2V3FundAccessConstraint = {
  terminal: string // address probably
  token: string // address
  distributionLimit: BigNumber
  distributionLimitCurrency: BigNumber
  overflowAllowance: BigNumber
  overflowAllowanceCurrency: BigNumber
}

export type V2V3FundingCycleData = {
  duration: BigNumber
  weight: BigNumber
  discountRate: BigNumber
  ballot: string // hex, contract address
}

export type V2V3FundingCycle = V2V3FundingCycleData & {
  number: BigNumber
  configuration: BigNumber
  basedOn: BigNumber
  start: BigNumber
  metadata: BigNumber // encoded FundingCycleMetadata
}

export type V2V3FundingCycleMetadata =
  | V2FundingCycleMetadata
  | V3FundingCycleMetadata

export enum BallotState {
  'active',
  'approved',
  'failed',
}
