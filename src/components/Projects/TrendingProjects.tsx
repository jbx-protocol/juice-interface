import Grid from 'components/shared/Grid'
import { InfoCircleOutlined } from '@ant-design/icons'

import Loading from 'components/shared/Loading'
import { useTrendingProjects } from 'hooks/Projects'

import { Trans } from '@lingui/macro'

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
      <p style={{ marginBottom: 40, marginTop: 20, maxWidth: 800 }}>
        <Trans>
          <InfoCircleOutlined /> Rankings based on volume and % volume gained in
          the last 7 days.
        </Trans>
      </p>
      {projects ? (
        <Grid gutter={isHomePage ? 10 : undefined}>
          {projects.map((p, i) => (
            <TrendingProjectCard
              project={p}
              size={isHomePage ? 'sm' : 'lg'}
              rank={i + 1}
              bg={cardBg}
              key={i}
            />
          ))}
        </Grid>
      ) : (
        <Loading />
      )}
    </div>
  )
}
