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
    duration: t`The project owner can edit this project's rules and start new cycles at any time.`,
    noBallot: t`The project owner can edit the next cycle's rules at any time.`,
    customBallot: t`The project is using an unknown contract for its edit deadline.`,
    allowMinting: t`The project owner can mint any amount of project tokens at any time.`,
    metadataMaxReservedRate: t`Supporters won't receive tokens when they pay this project.`,
    metadataReservedRate: t`This project reserves most of its tokens. Supporters won't get many tokens when paying this project.`,
    zeroPaymentIssuanceNoDataSource: t`Supporters won't receive any tokens when paying this project. No ETH is available for redemption.`,
  }
}
