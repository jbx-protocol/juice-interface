import { InfoCircleOutlined } from '@ant-design/icons'
import Grid from 'components/shared/Grid'
import Loading from 'components/shared/Loading'
import { useTrendingProjects } from 'hooks/Projects'
import React from 'react'

import RankingExplanation from './RankingExplanation'
import TrendingProjectCard from './TrendingProjectCard'

export function TrendingProjects({
  isHomePage,
  count, // number of trending project cards to show
  trendingWindowDays,
}: {
  isHomePage?: boolean
  count: number
  trendingWindowDays: number
}) {
  const { data: projects } = useTrendingProjects(count, trendingWindowDays)

  return (
    <div>
      {projects ? (
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
      ) : (
        <Loading />
      )}
      {!isHomePage ? (
        <p style={{ marginBottom: 40, marginTop: 20, maxWidth: 800 }}>
          <InfoCircleOutlined />{' '}
          <RankingExplanation trendingWindow={trendingWindowDays} />
        </p>
      ) : null}
    </div>
  )
}

export const MemoizedTrendingProjects = React.memo(TrendingProjects)
