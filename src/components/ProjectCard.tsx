import * as constants from '@ethersproject/constants'
import { BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid'
import { Skeleton } from 'antd'
import { PV_V2, PV_V4 } from 'constants/pv'
import { useProjectHandleText } from 'hooks/useProjectHandleText'
import { useProjectMetadata } from 'hooks/useProjectMetadata'
import { useSubtitle } from 'hooks/useSubtitle'
import { DBProjectsAggregate } from 'models/dbProject'
import Link from 'next/link'
import { v2v3ProjectRoute } from 'packages/v2v3/utils/routes'
import { ChainLogo } from 'packages/v4/components/ChainLogo'
import { v4ProjectRoute } from 'packages/v4/utils/routes'
import { isHardArchived } from 'utils/archived'
import { formatDate } from 'utils/format/formatDate'
import { ArchivedBadge } from './ArchivedBadge'
import Loading from './Loading'
import ProjectLogo from './ProjectLogo'
import { ProjectTagsList } from './ProjectTags/ProjectTagsList'
import ETHAmount from './currency/ETHAmount'

export default function ProjectCard({
  project,
  bookmarked,
}: {
  project?: DBProjectsAggregate
  bookmarked?: boolean
}) {
  const { data: metadata } = useProjectMetadata(project?.metadataUri)
  const { handleText } = useProjectHandleText({
    handle: project?.handle,
    projectId: project?.projectId,
  })
  const subtitle = useSubtitle(metadata)

  if (!project) return null

  const { volume, pv, handle, projectId, createdAt, chainIds, chainId } =
    project
  const tags = metadata?.tags

  // If the total paid is greater than 0, but less than 10 ETH, show two decimal places.
  const precision = volume?.gt(0) && volume.lt(constants.WeiPerEther) ? 2 : 0

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
    pv === PV_V2
      ? v2v3ProjectRoute({
          projectId,
        })
      : `/p/${handle}`

  const projectCardUrl =
    pv === PV_V4
      ? v4ProjectRoute({
          projectId,
          chainId,
        })
      : pv === PV_V2
      ? v2v3ProjectRoute({
          projectId,
          handle,
        })
      : projectCardHref

  const isArchived = isHardArchived({ ...project }) || metadata?.archived

  return (
    <Link href={projectCardHref} as={projectCardUrl} prefetch={false}>
      <div
        className={`relative flex cursor-pointer items-center overflow-hidden whitespace-pre rounded-lg bg-white py-4 dark:bg-slate-600 md:border md:border-smoke-300 md:py-6 md:px-5 md:transition-colors md:hover:border-smoke-500 md:dark:border-slate-300 md:dark:hover:border-slate-100`}
      >
        <div className="mr-5">
          <ProjectLogo
            className="h-24 w-24 md:h-28 md:w-28"
            uri={metadata?.logoUri}
            name={metadata?.name}
            projectId={projectId}
            lazyLoad
          />
        </div>
        <div className="min-w-0 flex-1 overflow-hidden overflow-ellipsis font-normal">
          {metadata ? (
            <span className="m-0 flex items-center gap-2 font-heading text-xl leading-8 text-black dark:text-slate-100">
              {metadata.name}
            </span>
          ) : (
            <Skeleton paragraph={false} title={{ width: 120 }} active />
          )}

          {handle ? (
            <div className="my-1">
              <span className="flex items-center gap-1 font-medium text-black dark:text-slate-100">
                {handleText}
              </span>
            </div>
          ) : null}

          <div>
            <span className="mr-1 font-medium text-black dark:text-slate-100">
              <ETHAmount amount={volume} precision={precision} />
            </span>

            <span className="text-grey-500 dark:text-grey-300">
              since {!!createdAt && formatDate(createdAt * 1000, 'yyyy-MM-DD')}
            </span>
          </div>

          {tags?.length ? (
            <div className="mt-1">
              <ProjectTagsList tagClassName="text-xs" tags={tags} />
            </div>
          ) : subtitle ? (
            <div className="max-h-5 overflow-hidden overflow-ellipsis text-grey-400 dark:text-slate-200">
              {subtitle.text}
            </div>
          ) : null}

          <div className="mt-2 flex items-center gap-2">
            {chainIds ? (
              chainIds.map(c => (
                <ChainLogo key={c} chainId={c} width={18} height={18} />
              ))
            ) : (
              <ChainLogo chainId={1} width={18} height={18} />
            )}
          </div>
        </div>
        {bookmarked && (
          <BookmarkIconSolid className="absolute top-4 right-0 h-4 text-black dark:text-slate-100 md:right-4" />
        )}
        {isArchived && <ArchivedBadge />}
        {!metadata && <Loading />}
      </div>
    </Link>
  )
}
