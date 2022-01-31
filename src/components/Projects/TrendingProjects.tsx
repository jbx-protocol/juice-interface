import Grid from 'components/shared/Grid'
import Loading from 'components/shared/Loading'
import { useTrendingProjects } from 'hooks/Projects'

import TrendingProjectCard from './TrendingProjectCard'

export default function TrendingProjects({
  isHomePage,
  count, //number of trending project cards to show
}: {
  isHomePage?: boolean
  count: number
}) {
  const { data: projects } = useTrendingProjects(count)
  const cardBg = isHomePage ? 'var(--background-l0)' : ''

  return (
    <div>
      {projects ? (
        <Grid>
          {projects.map((p, i) => (
            <TrendingProjectCard
              project={p}
              size={isHomePage ? 'sm' : 'lg'}
              rank={i + 1}
              bg={cardBg}
            />
          ))}
        </Grid>
      ) : (
        <Loading />
      )}
    </div>
  )
}
