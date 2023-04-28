import { Trans } from '@lingui/macro'

export const TRENDING_WINDOW_DAYS = 7

// Explains how trending projects rankings are calculated
export default function RankingExplanation() {
  return (
    <span>
      <Trans>
        Rankings are based on the amount of ETH a project has been paid and the
        number of payments to a project over the past {TRENDING_WINDOW_DAYS}{' '}
        days.
      </Trans>
    </span>
  )
}
