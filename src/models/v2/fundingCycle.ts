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
  pausePay: BigNumber
  pauseDistributions: BigNumber
  pauseRedeem: BigNumber
  pauseMint: BigNumber
  pauseBurn: BigNumber
  allowTerminalMigration: BigNumber
  allowControllerMigration: BigNumber
  holdFees: BigNumber
  useLocalBalanceForRedemptions: BigNumber
  useDataSourceForPay: BigNumber
  useDataSourceForRedeem: BigNumber
  dataSource: string // hex, contract address
}

export type V2FundAccessConstraints = {
  terminal: string // address probably
  distributionLimit: BigNumber
  distributionLimitCurrency: BigNumber
  overflowAllowance: BigNumber
  overflowAllowanceCurrency: BigNumber
}
