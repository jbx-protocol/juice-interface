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

  const isXlBreakpoint = useMedia('(max-width: 1279px)')

  if (!projects) {
    return null
  }

  return (
    <SectionContainer>
      <SectionHeading
        heading={<Trans>Juicy picks</Trans>}
        subheading={
          <Trans>Peep our selection of top trending projects this month.</Trans>
        }
      />

      {isXlBreakpoint ? (
        <ProjectCarousel projects={projects} />
      ) : (
        <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-8 px-7">
          <div className="mx-auto flex-1">
            <SpotlightProjectCard project={projects[0]} />
          </div>
          <div className="grid grid-cols-2 grid-rows-2 gap-8">
            {projects.slice(1).map(project => (
              <HomepageProjectCard key={project.projectId} project={project} />
            ))}
          </div>
        </div>
      )}
    </SectionContainer>
  )
}
