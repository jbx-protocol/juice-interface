import { InfoCircleOutlined } from '@ant-design/icons'
import Grid from 'components/Grid'
import Loading from 'components/Loading'
import { useTrendingProjects } from 'hooks/Projects'

import RankingExplanation from './RankingExplanation'
import TrendingProjectCard from './TrendingProjectCard'

export default function TrendingProjects({
  count, // number of trending project cards to show
}: {
  count: number
}) {
  const { data: projects, isLoading } = useTrendingProjects(count)

  return (
    <div>
      {projects && projects.length > 0 && (
        <Grid>
          {projects.map((p, i) => (
            <TrendingProjectCard
              project={p}
              size={'lg'}
              rank={i + 1}
              key={`${p.id}_${p.cv}`}
            />
          ))}
        </Grid>
      )}

      {(!projects?.length || isLoading) && (
        <div style={{ marginTop: 40 }}>
          <Loading />
        </div>
      )}

      <p style={{ marginBottom: 40, marginTop: 40, maxWidth: 800 }}>
        <InfoCircleOutlined /> <RankingExplanation />
      </p>
    </div>
  )
}
