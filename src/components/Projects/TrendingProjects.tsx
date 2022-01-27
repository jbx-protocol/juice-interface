import Grid from 'components/shared/Grid'
import Loading from 'components/shared/Loading'
import { useTrendingProjects } from 'hooks/Projects'

import TrendingProjectCard from './TrendingProjectCard'

export default function TrendingProjects() {
  const trendingProjectIds = useTrendingProjects()

  return (
    <div>
      {trendingProjectIds ? (
        <Grid
          children={trendingProjectIds.map(p => (
            <TrendingProjectCard projectId={p.id} volume={p.volume} />
          ))}
        />
      ) : (
        <Loading />
      )}
    </div>
  )
}
