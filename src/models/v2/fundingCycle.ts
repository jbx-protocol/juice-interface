import { BigNumber } from '@ethersproject/bignumber'

export type V2FundingCycleData = {
  duration: number
  weight: BigNumber
  discountRate: number
  ballot: string // hex, contract address
}

export type V2FundingCycleMetadata = {
  reservedRate: number
  redemptionRate: number
  ballotRedemptionRate: number
  pausePay: number
  pauseDistributions: number
  pauseRedeem: number
  pauseMint: number
  pauseBurn: number
  allowTerminalMigration: number
  allowControllerMigration: number
  holdFees: number
  useLocalBalanceForRedemptions: number
  useDataSourceForPay: number
  useDataSourceForRedeem: number
  dataSource: string // hex, contract address
}
