import { Trans } from '@lingui/macro'
import { Skeleton } from 'antd'
import { PV_V1, PV_V2 } from 'constants/pv'
import { V1ArchivedProjectIds } from 'constants/v1/archivedProjects'
import { V2ArchivedProjectIds } from 'constants/v2v3/archivedProjects'
import { constants } from 'ethers'

import { BigNumber } from 'ethers'
import { useProjectHandleText } from 'hooks/ProjectHandleText'
import { useProjectMetadata } from 'hooks/ProjectMetadata'
import useSubgraphQuery from 'hooks/SubgraphQuery'
import { ProjectTagName } from 'models/project-tags'
import { Project } from 'models/subgraph-entities/vX/project'
import Link from 'next/link'
import { formatDate } from 'utils/format/formatDate'
import { v2v3ProjectRoute } from 'utils/routes'
import Loading from './Loading'
import ProjectLogo from './ProjectLogo'
import { ProjectTagsList } from './ProjectTags/ProjectTagsList'
import ETHAmount from './currency/ETHAmount'

export type ProjectCardProject = Pick<
  Project,
  'id' | 'handle' | 'volume' | 'createdAt' | 'terminal' | 'projectId' | 'pv'
> & { tags?: ProjectTagName[] | null; metadataUri: string | null }

function ArchivedBadge() {
  return (
    <div className="absolute top-0 right-0 bg-smoke-100 py-0.5 px-1 text-xs font-medium text-grey-400 dark:bg-slate-600 dark:text-slate-200">
      <Trans>ARCHIVED</Trans>
    </div>
  )
}

function useProjectCardData(project?: ProjectCardProject | BigNumber) {
  // Get ProjectCardProject object if this component was passed a projectId (bigNumber)
  const projectResponse = useSubgraphQuery(
    BigNumber.isBigNumber(project)
      ? {
          entity: 'project',
          keys: [
            'id',
            'handle',
            'metadataUri',
            'volume',
            'createdAt',
            'terminal',
            'projectId',
            'pv',
          ],
          where: {
            key: 'projectId',
            value: project.toString(),
          },
        }
      : null,
  ).data

  // If we were given projectId (BigNumber) and therefore projectResponse returned something,
  // return the first item in the array.
  if (projectResponse?.[0]) {
    return projectResponse[0]
  }

  // Otherwise, return the given [project] argument,  which must have type ProjectCardProject.
  return project as ProjectCardProject | undefined
}

export default function ProjectCard({
  project,
}: {
  project?: ProjectCardProject | BigNumber
}) {
  const projectCardData = useProjectCardData(project)
  const { data: metadata } = useProjectMetadata(projectCardData?.metadataUri)
  const { handleText } = useProjectHandleText({
    handle: projectCardData?.handle,
    projectId: projectCardData?.projectId,
  })

  if (!projectCardData) return null

  // If the total paid is greater than 0, but less than 10 ETH, show two decimal places.
  const precision =
    projectCardData.volume?.gt(0) &&
    projectCardData.volume.lt(constants.WeiPerEther)
      ? 2
      : 0

  /**
   * We need to set the `as` prop for V2V3 projects
   * so that NextJs's prefetching works.
   *
   * The `href` prop will always be the project ID route,
   * but if there is a handle, we use that as the `as` prop
   * for pretty URLs.
   *
   * https://web.dev/route-prefetching-in-nextjs/
   */
  const projectCardHref =
    projectCardData.pv === PV_V2
      ? v2v3ProjectRoute({
          projectId: projectCardData.projectId,
        })
      : `/p/${projectCardData.handle}`

  const projectCardUrl =
    projectCardData.pv === PV_V2
      ? v2v3ProjectRoute({
          projectId: projectCardData.projectId,
          handle: projectCardData.handle,
        })
      : projectCardHref

  const isArchived =
    (projectCardData.pv === PV_V1 &&
      V1ArchivedProjectIds.includes(projectCardData.projectId)) ||
    (projectCardData.pv === PV_V2 &&
      V2ArchivedProjectIds.includes(projectCardData.projectId)) ||
    metadata?.archived

  const tags = (project as ProjectCardProject).tags

  return (
    <Link href={projectCardHref} as={projectCardUrl} prefetch={false}>
      <a>
        <div
          className={`relative flex cursor-pointer items-center overflow-hidden whitespace-pre rounded-lg bg-white py-4 dark:bg-slate-600 md:border md:border-smoke-300 md:py-6 md:px-5 md:transition-colors md:hover:border-smoke-500 md:dark:border-slate-300 md:dark:hover:border-slate-100`}
        >
          <div className="mr-5">
            <ProjectLogo
              className="h-24 w-24 md:h-28 md:w-28"
              uri={metadata?.logoUri}
              name={metadata?.name}
              projectId={projectCardData.projectId}
              lazyLoad
            />
          </div>
          <div className="min-w-0 flex-1 overflow-hidden overflow-ellipsis font-normal">
            {metadata ? (
              <span className="m-0 font-heading text-xl leading-8 text-black dark:text-slate-100">
                {metadata.name}
              </span>
            ) : (
              <Skeleton paragraph={false} title={{ width: 120 }} active />
            )}

            <div>
              <span className="font-medium text-black dark:text-slate-100">
                {handleText}
              </span>
            </div>

            <div>
              <span className="font-medium text-black dark:text-slate-100">
                <ETHAmount
                  amount={projectCardData.volume}
                  precision={precision}
                />{' '}
              </span>

              <span className="text-grey-500 dark:text-grey-300">
                since{' '}
                {!!projectCardData.createdAt &&
                  formatDate(projectCardData.createdAt * 1000, 'yyyy-MM-DD')}
              </span>
            </div>

            {tags?.length ? (
              <div className="mt-1">
                <ProjectTagsList tagClassName="text-xs" tags={tags} />
              </div>
            ) : metadata?.description ? (
              <div className="max-h-5 overflow-hidden overflow-ellipsis text-grey-400 dark:text-slate-200">
                {metadata.description}
              </div>
            ) : null}
          </div>
          {isArchived && <ArchivedBadge />}
          {!metadata && <Loading />}
        </div>
      </a>
    </Link>
  )
}
