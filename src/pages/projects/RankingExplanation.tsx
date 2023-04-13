import { Trans } from '@lingui/macro'
import ExternalLink from 'components/ExternalLink'

export const TRENDING_WINDOW_DAYS = 7
const trendingRankingExplanationCodeURL =
  'https://github.com/jbx-protocol/juice-interface/blob/main/src/hooks/Projects.ts#L275'

// Explains how trending projects rankings are calculated
export default function RankingExplanation() {
  return (
    <span>
      <Trans>
        Rankings are based on the amount of ETH a project has been paid and the
        number of payments to a project over the past {TRENDING_WINDOW_DAYS}{' '}
        days.{' '}
        <ExternalLink href={trendingRankingExplanationCodeURL}>
          See the code
        </ExternalLink>
        .
      </Trans>
    </span>
  )
}
