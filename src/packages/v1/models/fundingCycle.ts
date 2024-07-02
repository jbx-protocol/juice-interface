export interface V1FundingCycle {
  id: bigint
  projectId: bigint
  number: bigint
  basedOn: bigint
  target: bigint
  currency: bigint // 0 ETH, 1 USD
  start: bigint
  duration: bigint
  tapped: bigint
  fee: bigint
  weight: bigint
  discountRate: bigint
  cycleLimit: bigint
  configured: bigint
  ballot: string
  metadata: bigint // encoded FundingCycleData
}

export interface V1FundingCycleProperties {
  target: bigint
  currency: bigint
  duration: bigint
  discountRate: bigint
  cycleLimit: bigint
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
