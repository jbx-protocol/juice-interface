import {
  BellIcon,
  BookmarkIcon,
  EllipsisVerticalIcon,
} from '@heroicons/react/24/outline'
import { Trans, t } from '@lingui/macro'
import { Divider } from 'antd'
import EthereumAddress from 'components/EthereumAddress'
import { useProjectHeader } from 'components/ProjectDashboard/hooks'
import { TRENDING_WINDOW_DAYS } from 'pages/projects/RankingExplanation'
import { ProjectHeaderLogo } from './components/ProjectHeaderLogo'
import { HeaderStat } from './components/ProjectHeaderStatLine'

export const ProjectHeader = () => {
  const {
    title,
    subtitle,
    handle,
    owner,
    payments,
    totalVolume,
    last7DaysPercent,
  } = useProjectHeader()

  return (
    <div className="relative mt-6 flex w-full flex-col gap-4">
      <ProjectHeaderLogo className="absolute left-0 -top-[146px] border-6 border-white dark:border-slate-900" />
      <div className="flex justify-end gap-4">
        <BellIcon className="h-6 w-6" />
        <BookmarkIcon className="h-6 w-6" />
        <EllipsisVerticalIcon className="h-6 w-6" />
      </div>

      <div>
        <h1 className="mb-0 font-heading text-4xl font-medium dark:text-slate-50">
          {title}
        </h1>
      </div>
      <div className="flex justify-between">
        <div className="flex flex-col gap-7">
          <div className="text-lg text-grey-700 dark:text-slate-50">
            {subtitle}
          </div>
          <div className="text-grey-500 dark:text-slate-200">
            <span>{handle}</span>
            <Divider className="mx-4" type="vertical" />
            <span>
              Owned by: <EthereumAddress address={owner} />
            </span>
          </div>
        </div>
        <div className="flex gap-12">
          <HeaderStat title={t`Payments`} stat={payments} />
          <HeaderStat
            title={t`Total volume`}
            stat={<ETHAmount amount={totalVolume} precision={2} />}
          />
          <HeaderStat
            title={<Trans>Last {TRENDING_WINDOW_DAYS} days</Trans>}
            stat={`${last7DaysPercent}%`}
          />
        </div>
      </div>
    </div>
  )
}
