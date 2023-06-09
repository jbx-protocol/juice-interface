import { Trans } from '@lingui/macro'
import { XLButton } from 'components/XLButton'
import { CASE_STUDY_PROJECTS } from 'constants/successStoryProjects'
import { useMedia } from 'contexts/Theme/useMedia'
import { useDBProjectsQuery } from 'hooks/useProjects'
import Link from 'next/link'
import { ProjectCarousel } from '../ProjectCarousel'
import { SectionContainer } from '../SectionContainer'
import { SectionHeading } from '../SectionHeading'
import { SuccessStoriesCard } from './SuccessStoriesCard'

export function SuccessStoriesSection() {
  const { data } = useDBProjectsQuery({
    ids: CASE_STUDY_PROJECTS.map(p => p.id),
  })

  const isXl = useMedia('(min-width: 1280px)')

  if (!data) return null

  const topProjects = CASE_STUDY_PROJECTS.map(p => {
    const project = data.find(proj => proj.id === p.id)
    if (!project) return

    return {
      project,
      tags: p.tags,
      nameOverride: p.nameOverride,
      imageOverride: p.imageOverride,
    }
  }).filter((p): p is NonNullable<typeof p> => !!p)

  const cards = topProjects.map(project => (
    <SuccessStoriesCard
      key={project.project?.projectId}
      project={project.project}
      tags={project.tags}
      nameOverride={project.nameOverride}
      imageOverride={project.imageOverride}
    />
  ))

  return (
    <SectionContainer>
      <SectionHeading
        heading={<Trans>Success stories</Trans>}
        subheading={
          <Trans>
            Juicebox gives you the tools to automate web3 fundraising so you can
            focus on building. Join thousands of projects sippin' the Juice.
          </Trans>
        }
      />
      {isXl ? (
        <div className="flex justify-center gap-8">{cards}</div>
      ) : (
        <ProjectCarousel items={cards} />
      )}

      <div className="w-full text-center">
        <div className="mt-16 flex flex-col flex-wrap justify-center gap-3 md:flex-row">
          <Link href="/success-stories/constitutiondao">
            <XLButton type="default" size="large">
              <Trans>Read case studies</Trans>
            </XLButton>
          </Link>
          <Link href="/create">
            <XLButton type="primary" size="large">
              <Trans>Create a project</Trans>
            </XLButton>
          </Link>
        </div>
      </div>
    </SectionContainer>
  )
}
