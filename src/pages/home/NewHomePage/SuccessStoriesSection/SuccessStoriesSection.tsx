import { Trans } from '@lingui/macro'
import { XLButton } from 'components/XLButton'
import { CASE_STUDY_PROJECTS } from 'constants/successStoryProjects'
import { useProjectsQuery } from 'hooks/Projects'
import { ProjectTagName } from 'models/project-tags'
import { Project } from 'models/subgraph-entities/vX/project'
import Link from 'next/link'
import { SectionContainer } from '../SectionContainer'
import { SectionHeading } from '../SectionHeading'
import { SuccessStoriesCard } from './SuccessStoriesCard'

export function SuccessStoriesSection() {
  const { data } = useProjectsQuery({
    projectIds: CASE_STUDY_PROJECTS.map(p => p.id),
  })

  const topProjects = CASE_STUDY_PROJECTS.map(p => ({
    project: data?.find(proj => proj.projectId === p.id && proj.pv === p.pv),
    tags: p.tags,
  })) as {
    project: Project | undefined
    tags: ProjectTagName[]
  }[]

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
      <div className="flex justify-center">
        <div className="flex gap-8 overflow-x-auto">
          {topProjects.map(project =>
            project.project ? (
              <SuccessStoriesCard
                key={project.project.projectId}
                project={project.project}
                tags={project.tags}
              />
            ) : null,
          )}
        </div>
      </div>
      <div className="w-full text-center">
        <div className="mt-16 flex flex-col flex-wrap justify-center gap-3 md:flex-row">
          <Link href="/success-stories/constitutiondao">
            <a>
              <XLButton>
                <Trans>Case studies</Trans>
              </XLButton>
            </a>
          </Link>
          <Link href="/create">
            <a>
              <XLButton type="primary">
                <Trans>Create a project</Trans>
              </XLButton>
            </a>
          </Link>
        </div>
      </div>
    </SectionContainer>
  )
}
