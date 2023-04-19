import { Trans } from '@lingui/macro'
import { XLButton } from 'components/XLButton'
import { PV_V1, PV_V2 } from 'constants/pv'
import { useProjectsQuery } from 'hooks/Projects'
import { GraphResult } from 'hooks/SubgraphQuery'
import { Project } from 'models/subgraph-entities/vX/project'
import Link from 'next/link'
import { SectionContainer } from '../SectionContainer'
import { SectionHeading } from '../SectionHeading'
import { SuccessStoriesCard } from './SuccessStoriesCard'

const CASE_STUDY_PROJECTS = [
  {
    pv: PV_V1,
    id: 36, // cdao
  },
  {
    pv: PV_V1,
    id: 199, // moondao
  },
  {
    pv: PV_V1,
    id: 7, // sharkdao
  },
  {
    pv: PV_V2,
    id: 311, // studiodao
  },
]

export function SuccessStoriesSection() {
  const { data } = useProjectsQuery({
    projectIds: CASE_STUDY_PROJECTS.map(p => p.id),
  })

  const topProjects = CASE_STUDY_PROJECTS.map(p =>
    data?.find(proj => proj.projectId === p.id && proj.pv === p.pv),
  ).filter(Boolean) as GraphResult<'project', keyof Project>

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
      <div className="flex flex-wrap justify-center gap-8">
        {topProjects.map(project => (
          <SuccessStoriesCard key={project.id} project={project} />
        ))}
      </div>
      <div className="mt-16 w-full text-center">
        <Link href="/create">
          <a>
            <XLButton size="large" type="primary">
              <Trans>Create a project</Trans>
            </XLButton>
          </a>
        </Link>
      </div>
    </SectionContainer>
  )
}
