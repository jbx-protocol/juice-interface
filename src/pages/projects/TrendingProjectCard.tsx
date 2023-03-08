import * as constants from '@ethersproject/constants'
import { Plural, t, Trans } from '@lingui/macro'
import { Skeleton } from 'antd'
import ETHAmount from 'components/currency/ETHAmount'
import Loading from 'components/Loading'
import ProjectLogo from 'components/ProjectLogo'
import { PV_V2 } from 'constants/pv'
import { useProjectHandleText } from 'hooks/ProjectHandleText'
import { useProjectMetadata } from 'hooks/ProjectMetadata'
import { Project } from 'models/subgraph-entities/vX/project'
import Link from 'next/link'
import { useMemo } from 'react'
import { v2v3ProjectRoute } from 'utils/routes'
import { TRENDING_WINDOW_DAYS } from './RankingExplanation'

export default function TrendingProjectCard({
  project,
  rank,
}: {
  project: Pick<
    Project,
    | 'terminal'
    | 'trendingVolume'
    | 'metadataUri'
    | 'totalPaid'
    | 'trendingPaymentsCount'
    | 'createdWithinTrendingWindow'
    | 'handle'
    | 'pv'
    | 'projectId'
  >
  rank: number
}) {
  const { data: metadata } = useProjectMetadata(project.metadataUri)
  const { handleText } = useProjectHandleText({
    handle: project.handle,
    projectId: project.projectId,
  })

  // If the total paid is greater than 0, but less than 10 ETH, show two decimal places.
  const precision =
    project.trendingVolume?.gt(0) &&
    project.trendingVolume.lt(constants.WeiPerEther)
      ? 2
      : 0

  const percentGainText = useMemo(() => {
    if (project.createdWithinTrendingWindow) return t`New`

    const preTrendingVolume = project.totalPaid?.sub(project.trendingVolume)

    if (!preTrendingVolume?.gt(0)) return '+∞'

    const percentGain = project.trendingVolume
      .mul(10000)
      .div(preTrendingVolume)
      .toNumber()

    let percentRounded: number

    // If percentGain > 1, round to int
    if (percentGain >= 100) {
      percentRounded = Math.round(percentGain / 100)
      // If 0.1 <= percentGain < 1, round to 1dp
    } else if (percentGain >= 10) {
      percentRounded = Math.round(percentGain / 10) / 10
      // If percentGain < 0.1, round to 2dp
    } else {
      percentRounded = percentGain / 100
    }

    return `+${percentRounded}%`
  }, [project])

  const paymentCount = project.trendingPaymentsCount

  return (
    <Link
      key={project.handle}
      href={
        project.pv === PV_V2
          ? v2v3ProjectRoute(project)
          : `/p/${project.handle}`
      }
    >
      <a>
        <div className="cursor-pointer overflow-hidden rounded-sm">
          <div className="flex h-full items-center overflow-hidden whitespace-pre py-4 transition-colors md:border md:border-solid md:border-smoke-300 md:px-5 md:py-6 md:hover:border-smoke-500 md:dark:border-slate-300 md:dark:hover:border-slate-100">
            <div className="relative mr-5 h-24 w-24 md:hidden">
              <div className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-br bg-white text-xl font-normal font-bold text-black dark:bg-slate-800 dark:text-slate-100">
                {rank}
              </div>
              <ProjectLogo
                className="h-24 w-24"
                uri={metadata?.logoUri}
                name={metadata?.name}
                projectId={project.projectId}
              />
            </div>

            <div className="mr-5 hidden items-center md:flex">
              <div className="mr-4 w-6 text-center text-xl font-normal text-black dark:text-slate-100">
                {rank}
              </div>
              <ProjectLogo
                className="h-28 w-28"
                uri={metadata?.logoUri}
                name={metadata?.name}
                projectId={project.projectId}
              />
            </div>

            <div className="min-w-0 flex-1 font-normal">
              {metadata ? (
                <h2 className="m-0 overflow-hidden text-ellipsis text-base text-black dark:text-slate-100 md:text-xl">
                  {metadata.name}
                </h2>
              ) : (
                <Skeleton paragraph={false} title={{ width: 120 }} active />
              )}

              <div className="hidden font-medium text-black dark:text-slate-100 md:block">
                {handleText}
              </div>

              <div className="flex w-full flex-wrap text-black dark:text-slate-100">
                <span className="flex flex-wrap items-baseline">
                  <span className="mt-1 font-medium">
                    <ETHAmount
                      amount={project.trendingVolume}
                      precision={precision}
                    />{' '}
                  </span>
                  <span className="font-medium text-grey-500 dark:text-grey-300">
                    <Trans>last {TRENDING_WINDOW_DAYS} days</Trans>{' '}
                  </span>
                  <span className="font-medium text-juice-400 dark:text-juice-300">
                    {percentGainText && <>{percentGainText}</>}
                  </span>
                </span>
              </div>

              <div className="mt-0.5 text-sm font-normal text-grey-500 dark:text-grey-300">
                <Plural
                  value={paymentCount}
                  one="# payment"
                  other="# payments"
                />
              </div>
            </div>

            {!metadata && <Loading />}
          </div>
        </div>
      </a>
    </Link>
  )
}
