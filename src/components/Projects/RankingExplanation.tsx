import { Trans } from '@lingui/macro'
import ExternalLink from 'components/shared/ExternalLink'

// Explains how trending projects rankings are calculated
export default function RankingExplanation({
  trendingWindow,
}: {
  trendingWindow: number
}) {
  const trendingRankingExplanationCodeURL =
    'https://github.com/jbx-protocol/juice-interface/blob/main/src/hooks/v1/Projects.ts#L229'
  return (
    <Trans>
      Rankings based on number of contributions and volume gained in the last{' '}
      {trendingWindow} days.{' '}
      <ExternalLink href={trendingRankingExplanationCodeURL}>
        See code
      </ExternalLink>
    </Trans>
  )
}
