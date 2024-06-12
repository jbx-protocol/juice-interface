import { ArrowSmallRightIcon } from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import { Badge } from 'components/Badge'
import {
  HomepageProjectCard,
  HomepageProjectCardSkeleton,
} from 'components/Home/HomepageProjectCard'
import { ProjectCarousel } from 'components/Home/ProjectCarousel'
import { SectionContainer } from 'components/Home/SectionContainer'
import { SectionHeading } from 'components/Home/SectionHeading'
import { ProjectTag } from 'components/ProjectTags/ProjectTag'
import { XLButton } from 'components/buttons/XLButton'
import { HOMEPAGE } from 'constants/fathomEvents'
import { PV_V1 } from 'constants/pv'
import { useProjectsQuery } from 'generated/graphql'
import {
  DEFAULT_TRENDING_PROJECTS_LIMIT,
  useTrendingProjects,
} from 'hooks/useProjects'
import { client } from 'lib/apollo/client'
import { trackFathomGoal } from 'lib/fathom'
import { ProjectTagName } from 'models/project-tags'
import Link from 'next/link'
import { getSubgraphIdForProject } from 'utils/graph'

const HEADER_TAGS: ProjectTagName[] = [
  'dao',
  'nfts',
  'fundraising',
  'art',
  'business',
]

// These projects will render if there isn't enough trending projects.
const BACKUP_PROJECTS = [
  getSubgraphIdForProject(PV_V1, 199), // moondao
  getSubgraphIdForProject(PV_V1, 36), // constituiondao
  getSubgraphIdForProject(PV_V1, 323), // assange
  // add more as needed
]

export function TopSection() {
  const { data: trendingProjects, isLoading } = useTrendingProjects(
    DEFAULT_TRENDING_PROJECTS_LIMIT,
  )

  const { data } = useProjectsQuery({
    client,
    variables: {
      where: {
        id_in: BACKUP_PROJECTS,
      },
    },
  })
  const backupProjects = data?.projects

  const remainderProjectCount =
    DEFAULT_TRENDING_PROJECTS_LIMIT - (trendingProjects?.length ?? 0)

  const renderBackup =
    trendingProjects && backupProjects && remainderProjectCount
      ? backupProjects
          .slice(0, remainderProjectCount)
          .filter(
            p =>
              !trendingProjects
                .map(proj => proj.projectId)
                .includes(p.projectId),
          )
      : []

  const renderProjects = trendingProjects
    ? [...trendingProjects, ...renderBackup]
    : undefined

  return (
    <SectionContainer className="pt-6 pb-24 md:px-0 md:pt-10">
      <div className="flex justify-center">
        <ul className="mb-5 flex gap-2 overflow-y-auto py-4">
          {HEADER_TAGS.map(tag => (
            <li key={tag}>
              <ProjectTag tag={tag} isLink />
            </li>
          ))}
          <li>
            <Link href="/projects">
              <Badge variant="default" clickable>
                <Trans>All</Trans>
                <ArrowSmallRightIcon className="inline h-4 w-4" />
              </Badge>
            </Link>
          </li>
        </ul>
      </div>
      <SectionHeading
        className="mb-8"
        headingClassName="text-5xl md:text-7xl"
        heading={<Trans>Fund your thing</Trans>}
        subheading={
          <Trans>
            Join thousands of projects using Juicebox to fund, operate, and
            scale their ideas & communities transparently on Ethereum.
          </Trans>
        }
      />
      <div className="mb-16 flex w-full flex-col-reverse justify-center gap-4 md:w-auto md:flex-row">
        <Link href="/projects" className="w-full md:w-auto">
          <XLButton
            size="large"
            type="default"
            className="w-full md:w-auto"
            onClick={() => {
              trackFathomGoal(HOMEPAGE.EXPLORE_PROJECTS_CTA)
            }}
          >
            <Trans>Explore projects</Trans>
          </XLButton>
        </Link>
        <Link href="/create" className="w-full md:w-auto">
          <XLButton
            size="large"
            type="primary"
            className="w-full md:w-auto"
            onClick={() => {
              trackFathomGoal(HOMEPAGE.CREATE_A_PROJECT_CTA_NEW)
            }}
          >
            <Trans>Create a project</Trans>
          </XLButton>
        </Link>
      </div>
      {!isLoading && renderProjects ? (
        <ProjectCarousel
          items={renderProjects?.map(p => (
            <HomepageProjectCard project={p} key={p.id} />
          ))}
        />
      ) : (
        <ProjectCarousel
          items={Array(8)
            .fill(0)
            ?.map((_, idx) => (
              <HomepageProjectCardSkeleton key={`loading-${idx}`} />
            ))}
        />
      )}
    </SectionContainer>
  )
}
