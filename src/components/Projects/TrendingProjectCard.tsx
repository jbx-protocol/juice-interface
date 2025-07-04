import { BookmarkIcon as BookmarkIconSolid } from '@heroicons/react/24/solid'
import { Plural, t, Trans } from '@lingui/macro'
import { Skeleton } from 'antd'
import ETHAmount from 'components/currency/ETHAmount'
import Loading from 'components/Loading'
import ProjectLogo from 'components/ProjectLogo'
import { PV_V2, PV_V4 } from 'constants/pv'
import { useProjectMetadata } from 'hooks/useProjectMetadata'
import { useProjectTrendingPercentageIncrease } from 'hooks/useProjectTrendingPercentageIncrease'
import { JBChainId } from 'juice-sdk-core'
import { DBProject } from 'models/dbProject'
import Link from 'next/link'
import { v2v3ProjectRoute } from 'packages/v2v3/utils/routes'
import { ChainLogo } from 'packages/v4/components/ChainLogo'
import { v4ProjectRoute } from 'packages/v4/utils/routes'
import { TRENDING_WINDOW_DAYS } from './RankingExplanation'

export default function TrendingProjectCard({
  project,
  rank,
  size = 'sm',
  bookmarked,
}: {
  project: Pick<
    DBProject,
    | 'terminal'
    | 'trendingVolume'
    | 'metadataUri'
    | 'volume'
    | 'trendingPaymentsCount'
    | 'createdWithinTrendingWindow'
    | 'handle'
    | 'pv'
    | 'projectId'
  > & { chainIds?: JBChainId[] }
  rank: number
  size?: 'sm' | 'lg'
  bookmarked?: boolean
}) {
  const { data: metadata } = useProjectMetadata(project.metadataUri)

  const percentageGain = useProjectTrendingPercentageIncrease({
    trendingVolume: project.trendingVolume,
    totalVolume: project.volume,
  })

  const percentGainText = project.createdWithinTrendingWindow
    ? t`New`
    : percentageGain === Infinity
    ? t`+∞`
    : t`+${percentageGain}%`

  const projectLogo = (
    <ProjectLogo
      className={size === 'sm' ? 'h-20 w-20' : 'h-20 w-20 md:h-28 md:w-28'}
      uri={metadata?.logoUri}
      name={metadata?.name}
      projectId={project.projectId}
      lazyLoad
    />
  )

  return (
    <Link
      prefetch={false}
      key={project.handle}
      href={
        project.pv === PV_V4 && project.chainIds?.length
          ? v4ProjectRoute({
              projectId: project.projectId,
              chainId: project.chainIds[0],
            })
          : project.pv === PV_V2
          ? v2v3ProjectRoute(project)
          : `/p/${project.handle}`
      }
      className={`cursor-pointer overflow-hidden rounded-lg`}
    >
      <div className="relative flex h-full items-center overflow-hidden whitespace-pre rounded-lg bg-white py-4 transition-colors dark:bg-slate-600 md:border md:border-smoke-300 md:px-5 md:py-6 md:hover:border-smoke-500 md:dark:border-slate-300 md:dark:hover:border-slate-100">
        <div className="relative mr-5 h-20 w-20 md:hidden">
          <div className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-br bg-white text-xl font-normal text-black dark:bg-slate-800 dark:text-slate-100">
            {rank}
          </div>
          {projectLogo}
        </div>

        <div className="mr-5 hidden items-center md:flex">
          <div className="mr-4 w-6 text-center text-xl font-normal text-black dark:text-slate-100">
            {rank}
          </div>
          {projectLogo}
        </div>

        <div className="min-w-0 flex-1 font-normal">
          {metadata ? (
            <span className="m-0 overflow-hidden text-ellipsis font-heading text-base text-black dark:text-slate-100 md:text-xl">
              {metadata.name}
            </span>
          ) : (
            <Skeleton paragraph={false} title={{ width: 120 }} active />
          )}

          <div className="flex w-full flex-wrap items-center text-black dark:text-slate-100 gap-1">
            <span className="font-medium">
              <ETHAmount amount={project.trendingVolume} />
            </span>
            <span className="font-medium text-grey-500 dark:text-grey-300">
              <Trans>last {TRENDING_WINDOW_DAYS} days</Trans>
            </span>
            <span className="font-medium text-juice-400 dark:text-juice-300">
              {percentGainText && <>{percentGainText}</>}
            </span>
          </div>

          <div className="mt-0.5 text-sm font-normal text-grey-500 dark:text-grey-300">
            <Plural
              value={project.trendingPaymentsCount}
              one="# payment"
              other="# payments"
            />
          </div>

          <div className="flex gap-2 mt-2">
            {project.chainIds ? (
              project.chainIds?.map(c => (
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
        {!metadata && <Loading />}
      </div>
    </Link>
  )
}
