import { t } from '@lingui/macro'

export const RESERVED_RATE_WARNING_THRESHOLD_PERCENT = 90

export type FundingCycleRiskFlags = {
  duration: boolean
  noBallot: boolean
  customBallot: boolean
  allowMinting: boolean
  metadataReservedRate: boolean
  metadataMaxReservedRate: boolean
  zeroPaymentIssuanceNoDataSource: boolean
}

export const FUNDING_CYCLE_WARNING_TEXT: () => {
  [k in keyof FundingCycleRiskFlags]: string
} = () => {
  return {
    duration: t`The project owner may start a new funding cycle with a new configuration at any time.`,
    noBallot: t`The project owner can change the next funding cycle’s configuration at any time.`,
    customBallot: t`The project is using an unknown contract for its reconfiguration strategy.`,
    allowMinting: t`The project owner may mint new tokens at any time, diluting existing contributors share of tokens.`,
    metadataMaxReservedRate: t`Contributors won't receive any tokens when they pay this project.`,
    metadataReservedRate: t`Contributors receive a relatively small amount of tokens from paying this project.`,
    zeroPaymentIssuanceNoDataSource: t`Contributors don't receive any tokens from paying this project. Funds cannot be redeemed.`,
  }
}
