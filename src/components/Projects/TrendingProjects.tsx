import Grid from 'components/shared/Grid'
import { InfoCircleOutlined } from '@ant-design/icons'

import Loading from 'components/shared/Loading'
import { useTrendingProjects } from 'hooks/Projects'

import { Trans } from '@lingui/macro'

import TrendingProjectCard from './TrendingProjectCard'
import RankingExplanation from './RankingExplanation'

export default function TrendingProjects({
  isHomePage,
  count, //number of trending project cards to show
}: {
  isHomePage?: boolean
  count: number
}) {
  const { data: projects } = useTrendingProjects(count)
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
            />
          ))}
        </Grid>
      ) : (
        <Loading />
      )}
      {!isHomePage ? (
        <p style={{ marginBottom: 40, marginTop: 20, maxWidth: 800 }}>
          <Trans>
            <InfoCircleOutlined />
            <RankingExplanation />
          </Trans>
        </p>
      ) : null}
    </div>
  )
}
