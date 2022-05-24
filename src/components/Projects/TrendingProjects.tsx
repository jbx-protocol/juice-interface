import { InfoCircleOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import Grid from 'components/shared/Grid'
import Loading from 'components/shared/Loading'
import { useTrendingProjects } from 'hooks/Projects'

import RankingExplanation from './RankingExplanation'
import TrendingProjectCard from './TrendingProjectCard'

export default function TrendingProjects({
  isHomePage,
  count, // number of trending project cards to show
  trendingWindowDays,
}: {
  isHomePage?: boolean
  count: number
  trendingWindowDays: number
}) {
  const { data: projects, isLoading } = useTrendingProjects(
    count,
    trendingWindowDays,
  )

  return (
    <div>
      {projects && projects.length > 0 && (
        <Grid gutter={isHomePage ? 10 : undefined}>
          {projects.map((p, i) => (
            <TrendingProjectCard
              project={p}
              size={isHomePage ? 'sm' : 'lg'}
              rank={i + 1}
              key={i}
              trendingWindowDays={trendingWindowDays}
            />
          ))}
        </Grid>
      )}

      {(!projects?.length || isLoading) && (
        <div style={{ marginTop: 40 }}>
          <Loading />
        </div>
      )}

      {!isHomePage ? (
        <p style={{ marginBottom: 40, marginTop: 40, maxWidth: 800 }}>
          <InfoCircleOutlined />{' '}
          <RankingExplanation trendingWindow={trendingWindowDays} />
        </p>
      ) : (
        <Button
          type="default"
          href="/#/projects?tab=trending"
          style={{ marginBottom: 40, marginTop: 15 }}
        >
          <Trans>More trending projects</Trans>
        </Button>
      )}
    </div>
  )
}
