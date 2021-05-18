import { BigNumber } from '@ethersproject/bignumber'

export interface FundingCycle {
  id: BigNumber
  projectId: BigNumber
  number: BigNumber
  previous: BigNumber
  target: BigNumber
  currency: 0 | 1 // 0 ETH, 1 USD
  start: number
  duration: number
  tapped: BigNumber
  fee: number
  weight: BigNumber
  discountRate: number
  configured: number
  ballot: string
  metadata: BigNumber // encoded FundingCycleData
}

export interface FCMetadata {
  version: number
  bondingCurveRate: number
  reconfigurationBondingCurveRate: number
  reserved: number
}
