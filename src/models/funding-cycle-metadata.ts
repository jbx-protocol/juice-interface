export interface FundingCycleMetadata {
  version: number
  bondingCurveRate: number
  reconfigurationBondingCurveRate: number
  reservedRate: number
  payIsPaused: boolean
  ticketPrintingIsAllowed: boolean
  treasuryExtension: string
}
