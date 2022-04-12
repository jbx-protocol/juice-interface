import { BigNumber } from '@ethersproject/bignumber'

export type V2FundingCycleData = {
  duration: BigNumber
  weight: BigNumber
  discountRate: BigNumber
  ballot: string // hex, contract address
}

export type V2FundingCycleMetadata = {
  version?: number
  reservedRate: BigNumber
  redemptionRate: BigNumber
  ballotRedemptionRate: BigNumber
  pausePay: boolean
  pauseDistributions: boolean
  pauseRedeem: boolean
  allowMinting: boolean
  pauseBurn: boolean
  allowChangeToken: boolean
  allowTerminalMigration: boolean
  allowControllerMigration: boolean
  allowSetTerminals: boolean
  allowSetController: boolean
  holdFees: boolean
  useTotalOverflowForRedemptions: boolean
  useDataSourceForPay: boolean
  useDataSourceForRedeem: boolean
  dataSource: string // hex, contract address
}

export type V2FundAccessConstraint = {
  terminal: string // address probably
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
