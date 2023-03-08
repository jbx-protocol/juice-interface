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
              rank={i + 1}
              key={`${p.id}_${p.pv}`}
            />
          ))}
        </Grid>
      )}

      {(!projects?.length || isLoading) && (
        <div className="mt-10">
          <Loading />
        </div>
      )}

      <p className="my-10 max-w-[800px]">
        <InfoCircleOutlined /> <RankingExplanation />
      </p>
    </div>
  )
}
