import { V2FundingCycleMetadata } from 'packages/v2/models/fundingCycle'
import {
  BaseV3FundingCycleMetadataGlobal,
  V3FundingCycleMetadata,
} from 'packages/v3/models/fundingCycle'

export type BaseV2V3FundingCycleMetadataGlobal = {
  allowSetController: boolean
  allowSetTerminals: boolean
}

export type BaseV2V3FundingCycleMetadata = {
  version?: number
  global: BaseV3FundingCycleMetadataGlobal
  reservedRate: bigint
  redemptionRate: bigint
  ballotRedemptionRate: bigint
  pausePay: boolean
  pauseDistributions: boolean
  pauseRedeem: boolean
  pauseBurn: boolean
  allowMinting: boolean
  allowTerminalMigration: boolean
  allowControllerMigration: boolean
  holdFees: boolean
  useTotalOverflowForRedemptions: boolean
  useDataSourceForPay: boolean // undefined for outgoing NFT args
  useDataSourceForRedeem: boolean
  dataSource: string // hex, contract address. undefined for outgoing NFT args
}

export type JBPayDataSourceFundingCycleMetadata = Omit<
  BaseV2V3FundingCycleMetadata,
  'useDataSourceForPay' | 'dataSource'
>

export type V2V3FundAccessConstraint = {
  terminal: string // address
  token: string // address
  distributionLimit: bigint
  distributionLimitCurrency: bigint
  overflowAllowance: bigint
  overflowAllowanceCurrency: bigint
}

export type V2V3FundingCycleData = {
  duration: bigint
  weight: bigint
  discountRate: bigint
  ballot: string // hex, contract address
}

export type V2V3FundingCycle = V2V3FundingCycleData & {
  number: bigint
  configuration: bigint
  basedOn: bigint
  start: bigint
  metadata: bigint // encoded FundingCycleMetadata
}

export type V2V3FundingCycleMetadata =
  | V2FundingCycleMetadata
  | V3FundingCycleMetadata

export enum BallotState {
  'active',
  'approved',
  'failed',
}
