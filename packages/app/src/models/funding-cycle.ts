import { BigNumber } from '@ethersproject/bignumber'

export interface FundingCycle {
  id: BigNumber
  projectId: BigNumber
  number: BigNumber
  previous: BigNumber
  target: BigNumber
  currency: BigNumber // 0 ETH, 1 USD
  start: BigNumber
  duration: BigNumber
  tapped: BigNumber
  fee: BigNumber
  weight: BigNumber
  discountRate: BigNumber
  cycleLimit: BigNumber
  configured: BigNumber
  ballot: string
  metadata: BigNumber // encoded FundingCycleData
}

export interface FCMetadata {
  version: number
  bondingCurveRate: number
  reconfigurationBondingCurveRate: number
  reservedRate: number
}
