import { t } from '@lingui/macro'
import { decodeV2FundingCycleMetadata } from 'utils/v2/fundingCycle'
import { V2FundingCycle } from 'models/v2/fundingCycle'
import { percentToPermyriad } from 'utils/formatNumber'

export const RESERVED_RATE_WARNING_THRESHOLD_PERCENT = 90

export type V2FundingCycleRiskFlags = {
  duration: boolean
  ballot: boolean
  metadataTicketPrintingIsAllowed: boolean
  metadataReservedRate: boolean
}

export const FUNDING_CYCLE_WARNING_TEXT: (fundingCycle: V2FundingCycle) => {
  [k in keyof V2FundingCycleRiskFlags]: string
} = fundingCycle => {
  const metadata = decodeV2FundingCycleMetadata(fundingCycle.metadata)

  return {
    duration: t`The project owner may reconfigure this funding cycle at any time, without notice.`,
    ballot: t`Funding cycles can be reconfigured moments before a new cycle begins, without notifying contributors.`,
    metadataTicketPrintingIsAllowed: t`The project owner may mint any supply of tokens at any time, diluting the token share of all existing contributors.`,
    metadataReservedRate:
      metadata?.reservedRate === percentToPermyriad(100)
        ? t`Contributors will not receive any tokens in exchange for paying this project.`
        : t`Contributors will receive a relatively small portion of tokens in exchange for paying this project.`,
  }
}
