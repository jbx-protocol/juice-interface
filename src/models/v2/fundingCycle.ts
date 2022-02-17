import { BigNumber } from '@ethersproject/bignumber'

export type V2FundingCycleData = {
  duration: BigNumber
  weight: BigNumber
  discountRate: BigNumber
  ballot: string // hex, contract address
}

export type V2FundingCycleMetadata = {
  reservedRate: BigNumber
  redemptionRate: BigNumber
  ballotRedemptionRate: BigNumber
  pausePay: boolean
  pauseDistributions: boolean
  pauseRedeem: boolean
  pauseMint: boolean
  pauseBurn: boolean
  allowTerminalMigration: boolean
  allowControllerMigration: boolean
  holdFees: boolean
  useLocalBalanceForRedemptions: boolean
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
