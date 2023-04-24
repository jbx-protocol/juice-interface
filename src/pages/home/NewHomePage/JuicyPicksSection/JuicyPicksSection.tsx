import { Trans } from '@lingui/macro'
import { useMedia } from 'contexts/Theme/Media'
import { HomepageProjectCard } from '../HomepageProjectCard'
import { ProjectCarousel } from '../ProjectCarousel'
import { SectionContainer } from '../SectionContainer'
import { SectionHeading } from '../SectionHeading'
import { SpotlightProjectCard } from './SpotlightProjectCard'
import { useFetchJuicyPicks } from './hooks/JuicyPicks'

export function JuicyPicksSection() {
  const { data: projects } = useFetchJuicyPicks()

  const isCarouselBreakpoint = useMedia('(max-width: 1079px)')

  if (!projects) {
    return null
  }

  return (
    <SectionContainer className="md:px-0">
      <SectionHeading
        className="mb-12"
        heading={<Trans>Juicy picks</Trans>}
        subheading={
          <Trans>Peep our selection of top trending projects this month.</Trans>
        }
      />

      {isCarouselBreakpoint ? (
        <ProjectCarousel
          items={projects.map(p => (
            <HomepageProjectCard key={p.projectId} project={p} />
          ))}
        />
      ) : (
        <div className="mx-auto flex max-w-5xl flex-wrap justify-between gap-6 px-7 md:px-0">
          <div className="mx-auto flex-1">
            <SpotlightProjectCard project={projects[0]} />
          </div>
          <div className="grid grid-cols-2 grid-rows-2 gap-6">
            {projects.slice(1).map(project => (
              <HomepageProjectCard key={project.projectId} project={project} />
            ))}
          </div>
        </div>
      )}
    </SectionContainer>
  )
}
