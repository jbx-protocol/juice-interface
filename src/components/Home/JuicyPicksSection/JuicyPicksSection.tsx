import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import { HomepageProjectCard } from 'components/Home/HomepageProjectCard'
import { SpotlightProjectCard } from 'components/Home/JuicyPicksSection/SpotlightProjectCard'
import { ExploreCategories } from 'components/Home/JuicyPicksSection/components/ExploreCategories'
import { useFetchJuicyPicks } from 'components/Home/JuicyPicksSection/hooks/useJuicyPicks'
import { ProjectCarousel } from 'components/Home/ProjectCarousel'
import { SectionContainer } from 'components/Home/SectionContainer'
import { SectionHeading } from 'components/Home/SectionHeading'
import { XLButton } from 'components/buttons/XLButton'
import { useMedia } from 'contexts/Theme/useMedia'
import { Project } from 'generated/graphql'
import Link from 'next/link'
import { JUICY_PICKS_PROJECT_IDS } from './constants'

export function JuicyPicksSection() {
  const juicyPicksQuery = useFetchJuicyPicks()

  const isCarouselBreakpoint = useMedia('(max-width: 1079px)')

  // ensure list sorted by JUICY_PICKS_PROJECT_IDS array order
  const projects = JUICY_PICKS_PROJECT_IDS.map(projectId => {
    return juicyPicksQuery.data?.projects.find(
      project => project.projectId === projectId,
    ) as Project | undefined
  }).filter((p): p is Project => !!p)

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
              Peep our selection of the juiciest projects right now.
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
            {projects.length > 0 && (
              <div className="mx-auto flex-1">
                <SpotlightProjectCard project={projects[0]} />
              </div>
            )}
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

        <Link href="/projects" className="mx-auto w-fit">
          <XLButton size="large" className="flex items-center gap-3.5">
            <Trans>Explore all projects</Trans>
            <ArrowRightIcon className="h-6 w-6" />
          </XLButton>
        </Link>
      </div>
    </SectionContainer>
  )
}
