import { BigNumber } from '@ethersproject/bignumber'

export interface FundingCycle {
  id: BigNumber
  projectId: BigNumber
  number: BigNumber
  basedOn: BigNumber
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

export enum BallotState {
  'Approved' = 0,
  'Active' = 1,
  'Failed' = 2,
  'Standby' = 3,
}
