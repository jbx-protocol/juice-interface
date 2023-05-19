import { WeiPerEther } from '@ethersproject/constants'
import { Skeleton } from 'antd'
import { PV_V2 } from 'constants/pv'
import { WalletContributionsQuery } from 'generated/graphql'
import { useProjectMetadata } from 'hooks/useProjectMetadata'
import Link from 'next/link'
import { isHardArchived } from 'utils/archived'
import { formatDate } from 'utils/format/formatDate'
import { v2v3ProjectRoute } from 'utils/routes'

import { ArchivedBadge } from './ArchivedBadge'
import ETHAmount from './currency/ETHAmount'
import Loading from './Loading'
import ProjectLogo from './ProjectLogo'

export default function WalletContributionCard({
  contribution,
}: {
  contribution: WalletContributionsQuery['participants'][0]
}) {
  const { pv, projectId, project, volume, lastPaidTimestamp } = contribution

  const { data: metadata } = useProjectMetadata(project.metadataUri)

  const isArchived = isHardArchived({ pv, projectId }) || metadata?.archived

  // If the total paid is greater than 0, but less than 10 ETH, show two decimal places.
  const precision = volume?.gt(0) && volume.lt(WeiPerEther) ? 2 : 0

  const projectCardHref =
    pv === PV_V2
      ? v2v3ProjectRoute({
          projectId,
        })
      : `/p/${project.handle}`

  const projectCardUrl =
    pv === PV_V2
      ? v2v3ProjectRoute({
          projectId: projectId,
          handle: project.handle,
        })
      : projectCardHref

  return (
    <Link href={projectCardHref} as={projectCardUrl} prefetch={false}>
      <div className="relative flex cursor-pointer items-center overflow-hidden whitespace-pre rounded-lg bg-white py-4 dark:bg-slate-600 md:border md:border-smoke-300 md:py-6 md:px-5 md:transition-colors md:hover:border-smoke-500 md:dark:border-slate-300 md:dark:hover:border-slate-100">
        <div className="mr-5">
          <ProjectLogo
            className="h-20 w-20 md:h-24 md:w-24"
            uri={metadata?.logoUri}
            name={metadata?.name}
            projectId={projectId}
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

          <div className="font-medium text-black dark:text-slate-100">
            <ETHAmount amount={volume} precision={precision} />
          </div>

          <div className="text-black dark:text-slate-100">
            Last paid {formatDate(lastPaidTimestamp * 1000, 'YYYY-MM-DD')}
          </div>
        </div>
        {isArchived && <ArchivedBadge />}
        {!metadata && <Loading />}
      </div>
    </Link>
  )
}
