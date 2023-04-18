import { t, Trans } from '@lingui/macro'
import { DEFAULT_ENTITY_KEYS } from 'hooks/Projects'
import useSubgraphQuery, { GraphResult } from 'hooks/SubgraphQuery'
import { Project } from 'models/subgraph-entities/vX/project'
import { UseQueryResult } from 'react-query'
import { ProjectCarousel } from '../ProjectCarousel'
import { SectionContainer } from '../SectionContainer'
import { SectionHeading } from '../SectionHeading'
import { JUICY_PICKS_IDS } from './juicyPicksData'

function useFetchJuicyPicks(
  projectIds: number[],
): UseQueryResult<GraphResult<'project', keyof Project>> {
  return useSubgraphQuery({
    entity: 'project',
    keys: [...DEFAULT_ENTITY_KEYS],
    where: [
      {
        key: 'id',
        value: projectIds,
        operator: 'in',
      },
    ],
  })
}

export function JuicyPicksSection() {
  const { data: juicyPicks } = useFetchJuicyPicks(JUICY_PICKS_IDS)

  return (
    <SectionContainer>
      <SectionHeading
        heading={t`Juicy picks`}
        subheading={
          <Trans>Peep our selection of top trending projects this month.</Trans>
        }
      />
      {/* DESKTOP */}
      <div className="hidden md:flex"></div>
      {/* MOBILE */}
      <div className="flex md:hidden">
        <ProjectCarousel projects={juicyPicks} />
      </div>
    </SectionContainer>
  )
}
