export type FundingCycleMetadataV0 = {
  version: 0
  bondingCurveRate: number
  reconfigurationBondingCurveRate: number
  reservedRate: number
  payIsPaused: null
  ticketPrintingIsAllowed: null
  treasuryExtension: null
}

export type FundingCycleMetadataV1 = {
  version: 1
  bondingCurveRate: number
  reconfigurationBondingCurveRate: number
  reservedRate: number
  payIsPaused: boolean
  ticketPrintingIsAllowed: boolean
  treasuryExtension: string
}

export type FundingCycleMetadata =
  | FundingCycleMetadataV0
  | FundingCycleMetadataV1
