import { Trans } from '@lingui/macro'
import { XLButton } from 'components/XLButton'
import { CASE_STUDY_PROJECTS } from 'constants/successStoryProjects'
import { useMedia } from 'contexts/Theme/Media'
import { useProjectsQuery } from 'hooks/Projects'
import { Project } from 'models/subgraph-entities/vX/project'
import Link from 'next/link'
import { ProjectCarousel } from '../ProjectCarousel'
import { SectionContainer } from '../SectionContainer'
import { SectionHeading } from '../SectionHeading'
import { SuccessStoriesCard } from './SuccessStoriesCard'

export function SuccessStoriesSection() {
  const { data } = useProjectsQuery({
    projectIds: CASE_STUDY_PROJECTS.map(p => p.id),
  })

  const isXl = useMedia('(min-width: 1280px)')

  if (!data) return null

  const topProjects = CASE_STUDY_PROJECTS.map(p => {
    const project = data.find(
      proj => proj.projectId === p.id && proj.pv === p.pv,
    ) as Project | undefined
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
            <a>
              <XLButton type="default" size="large">
                <Trans>Case studies</Trans>
              </XLButton>
            </a>
          </Link>
          <Link href="/create">
            <a>
              <XLButton type="primary" size="large">
                <Trans>Create a project</Trans>
              </XLButton>
            </a>
          </Link>
        </div>
      </div>
    </SectionContainer>
  )
}
