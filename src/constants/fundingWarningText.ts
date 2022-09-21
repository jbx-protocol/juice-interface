import { t } from '@lingui/macro'

export const RESERVED_RATE_WARNING_THRESHOLD_PERCENT = 90

export type FundingCycleRiskFlags = {
  duration: boolean
  noBallot: boolean
  customBallot: boolean
  allowMinting: boolean
  metadataReservedRate: boolean
  metadataMaxReservedRate: boolean
}

export const FUNDING_CYCLE_WARNING_TEXT: () => {
  [k in keyof FundingCycleRiskFlags]: string
} = () => {
  return {
    duration: t`The project owner may start a new funding cycle with a new configuration at any time.`,
    noBallot: t`The project owner can change the next funding cycle’s configuration at any time.`,
    customBallot: t`The project owner is using an unverified contract for its reconfiguration strategy.`,
    allowMinting: t`The project owner may mint any supply of tokens at any time, diluting the token share of all existing contributors.`,
    metadataMaxReservedRate: t`Contributors won't receive any tokens when they pay this project.`,
    metadataReservedRate: t`Contributors will receive a relatively small portion of tokens in exchange for paying this project.`,
  }
}
