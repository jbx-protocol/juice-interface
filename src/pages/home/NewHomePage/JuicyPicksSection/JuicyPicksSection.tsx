import { Trans } from '@lingui/macro'
import { ProjectCarousel } from '../ProjectCarousel'
import { SectionContainer } from '../SectionContainer'
import { SectionHeading } from '../SectionHeading'
import { useFetchJuicyPicks } from './hooks/JuicyPicks'

export function JuicyPicksSection() {
  const { data: juicyPicks } = useFetchJuicyPicks()

  return (
    <SectionContainer>
      <SectionHeading
        heading={<Trans>Juicy picks</Trans>}
        subheading={
          <Trans>Peep our selection of top trending projects this month.</Trans>
        }
      />

      <ProjectCarousel projects={juicyPicks} />
    </SectionContainer>
  )
}
