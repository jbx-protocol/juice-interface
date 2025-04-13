import { BigNumber } from '@ethersproject/bignumber'

export interface V1FundingCycle {
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

export interface V1FundingCycleProperties {
  target: BigNumber
  currency: BigNumber
  duration: BigNumber
  discountRate: BigNumber
  cycleLimit: BigNumber
  ballot: string
}

type FundingCycleMetadataV0 = {
  version: 0
  bondingCurveRate: number
  reconfigurationBondingCurveRate: number
  reservedRate: number
  payIsPaused: null
  ticketPrintingIsAllowed: null
  treasuryExtension: null
}

type FundingCycleMetadataV1 = {
  version: 1
  bondingCurveRate: number
  reconfigurationBondingCurveRate: number
  reservedRate: number
  payIsPaused: boolean
  ticketPrintingIsAllowed: boolean
  treasuryExtension: string
}

export type V1FundingCycleMetadata =
  | FundingCycleMetadataV0
  | FundingCycleMetadataV1
