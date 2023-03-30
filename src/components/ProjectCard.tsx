import * as constants from '@ethersproject/constants'
import { Trans } from '@lingui/macro'
import { Skeleton } from 'antd'
import { PV_V1, PV_V2 } from 'constants/pv'
import { V1ArchivedProjectIds } from 'constants/v1/archivedProjects'
import { V2ArchivedProjectIds } from 'constants/v2v3/archivedProjects'
import { useProjectHandleText } from 'hooks/ProjectHandleText'
import { useProjectMetadata } from 'hooks/ProjectMetadata'
import { ProjectTag } from 'models/project-tags'
import { Project } from 'models/subgraph-entities/vX/project'
import Link from 'next/link'
import { formatDate } from 'utils/format/formatDate'
import { v2v3ProjectRoute } from 'utils/routes'
import ETHAmount from './currency/ETHAmount'
import Loading from './Loading'
import ProjectLogo from './ProjectLogo'
import { ProjectTagsRow } from './ProjectTagsRow'

export const PROJECT_CARD_BG = 'bg-white dark:bg-slate-600'

export type ProjectCardProject = Pick<
  Project,
  | 'id'
  | 'handle'
  | 'metadataUri'
  | 'totalPaid'
  | 'createdAt'
  | 'terminal'
  | 'projectId'
  | 'pv'
> & { tags?: ProjectTag[] }

function ArchivedBadge() {
  return (
    <div className="absolute top-0 right-0 bg-smoke-100 py-0.5 px-1 text-xs font-medium text-grey-400 dark:bg-slate-600 dark:text-slate-200">
      <Trans>ARCHIVED</Trans>
    </div>
  )
}

export default function ProjectCard({
  project,
}: {
  project: ProjectCardProject | undefined
}) {
  const { data: metadata } = useProjectMetadata(project?.metadataUri)
  const { handleText } = useProjectHandleText({
    handle: project?.handle,
    projectId: project?.projectId,
  })

  if (!project) return null

  // If the total paid is greater than 0, but less than 10 ETH, show two decimal places.
  const precision =
    project.totalPaid?.gt(0) && project.totalPaid.lt(constants.WeiPerEther)
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
    project.pv === PV_V2
      ? v2v3ProjectRoute({
          projectId: project.projectId,
        })
      : `/p/${project.handle}`

  const projectCardUrl =
    project.pv === PV_V2
      ? v2v3ProjectRoute({
          projectId: project.projectId,
          handle: project.handle,
        })
      : projectCardHref

  const isArchived =
    (project.pv === PV_V1 &&
      V1ArchivedProjectIds.includes(project.projectId)) ||
    (project.pv === PV_V2 &&
      V2ArchivedProjectIds.includes(project.projectId)) ||
    metadata?.archived

  const tags = project.tags

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
              projectId={project.projectId}
            />
          </div>
          <div className="min-w-0 flex-1 font-normal">
            {metadata ? (
              <span className="m-0 overflow-hidden overflow-ellipsis font-heading text-xl leading-8 text-black dark:text-slate-100">
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
                <ETHAmount amount={project.totalPaid} precision={precision} />{' '}
              </span>

              <span className="text-grey-500 dark:text-grey-300">
                since{' '}
                {!!project.createdAt &&
                  formatDate(project.createdAt * 1000, 'yyyy-MM-DD')}
              </span>
            </div>

            {tags?.length ? (
              <div className="mt-1">
                <ProjectTagsRow
                  tagClassName="text-xs text-grey-400 dark:text-slate-200 border-solid border border-grey-400 dark:border-slate-200 bg-transparent"
                  tags={tags}
                />
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
