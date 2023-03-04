import { Trans } from '@lingui/macro'
import ExternalLink from 'components/ExternalLink'

export const TRENDING_WINDOW_DAYS = 7

// Explains how trending projects rankings are calculated
export default function RankingExplanation() {
  const trendingRankingExplanationCodeURL =
    'https://github.com/jbx-protocol/juice-interface/blob/main/src/hooks/Projects.ts#L275'
  return (
    <Trans>
      Rankings based on the amount paid and the number of payments over the last{' '}
      {TRENDING_WINDOW_DAYS} days.{' '}
      <ExternalLink href={trendingRankingExplanationCodeURL}>
        See the code
      </ExternalLink>
      .
    </Trans>
  )
}
