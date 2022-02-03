import { Trans } from '@lingui/macro'

// Explains how trending projects rankings are calculated
export default function RankingExplanation({
  trendingWindow,
}: {
  trendingWindow: number
}) {
  const trendingRankingExplanationCodeURL =
    'https://github.com/jbx-protocol/juice-interface/blob/main/src/hooks/Projects.ts#L136'
  return (
    <Trans>
      Rankings based on number of contributions and volume gained in the last{' '}
      {trendingWindow} days.{' '}
      <a
        href={trendingRankingExplanationCodeURL}
        target="_blank"
        rel="noreferrer"
      >
        See code
      </a>
    </Trans>
  )
}
