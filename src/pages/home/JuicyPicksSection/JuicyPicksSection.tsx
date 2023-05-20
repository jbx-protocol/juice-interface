import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import { XLButton } from 'components/XLButton'
import { useMedia } from 'contexts/Theme/useMedia'
import Link from 'next/link'
import { HomepageProjectCard } from '../HomepageProjectCard'
import { ProjectCarousel } from '../ProjectCarousel'
import { SectionContainer } from '../SectionContainer'
import { SectionHeading } from '../SectionHeading'
import { SpotlightProjectCard } from './SpotlightProjectCard'
import { ExploreCategories } from './components/ExploreCategories'
import { useFetchJuicyPicks } from './hooks/useJuicyPicks'

export function JuicyPicksSection() {
  const { data: projects } = useFetchJuicyPicks()

  const isCarouselBreakpoint = useMedia('(max-width: 1079px)')

  if (!projects) {
    return null
  }

  return (
    <SectionContainer className="flex flex-col gap-24 md:px-0">
      <div>
        <SectionHeading
          className="mb-6"
          heading={<Trans>Juicy picks</Trans>}
          subheading={
            <Trans>
              Peep our selection of top trending projects this month.
            </Trans>
          }
        />

        {isCarouselBreakpoint ? (
          <ProjectCarousel
            items={projects.map(p => (
              <HomepageProjectCard key={p.projectId} project={p} lazyLoad />
            ))}
          />
        ) : (
          <div className="mx-auto flex max-w-5xl flex-wrap justify-between gap-6 px-7 md:px-0">
            <div className="mx-auto flex-1">
              <SpotlightProjectCard project={projects[0]} />
            </div>
            <div className="grid grid-cols-2 grid-rows-2 gap-6">
              {projects.slice(1).map(project => (
                <HomepageProjectCard
                  key={project.projectId}
                  project={project}
                  lazyLoad
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-16">
        <ExploreCategories />

        <Link href="/projects">
          <a className="mx-auto w-fit">
            <XLButton size="large" className="flex items-center gap-3.5">
              <Trans>Explore all projects</Trans>
              <ArrowRightIcon className="h-6 w-6" />
            </XLButton>
          </a>
        </Link>
      </div>
    </SectionContainer>
  )
}
