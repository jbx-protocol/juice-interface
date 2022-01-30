import Grid from 'components/shared/Grid'
import Loading from 'components/shared/Loading'
import { useTrendingProjects } from 'hooks/Projects'

import TrendingProjectCard from './TrendingProjectCard'

export default function TrendingProjects({
  isHomePage,
}: {
  isHomePage?: boolean
}) {
  const { data: projects } = useTrendingProjects()
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
