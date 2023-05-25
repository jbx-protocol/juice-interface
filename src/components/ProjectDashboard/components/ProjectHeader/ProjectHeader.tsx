import {
  BellIcon,
  BookmarkIcon,
  EllipsisVerticalIcon,
} from '@heroicons/react/24/outline'
import { t } from '@lingui/macro'
import { Divider } from 'antd'
import { useProjectHeader } from 'components/ProjectDashboard/hooks'
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
      <ProjectHeaderLogo className="absolute left-0 -top-[146px] border-6 border-white" />
      <div className="flex justify-end gap-4">
        <BellIcon className="h-6 w-6" />
        <BookmarkIcon className="h-6 w-6" />
        <EllipsisVerticalIcon className="h-6 w-6" />
      </div>

      <div>
        <h1 className="mb-0 text-4xl font-medium">{title}</h1>
      </div>
      <div className="flex justify-between">
        <div className="flex flex-col gap-7">
          <div className="text-lg text-grey-700">{subtitle}</div>
          <div className="text-grey-500">
            <span>{handle}</span>
            <Divider className="mx-4" type="vertical" />
            <span>Owned by: {owner}</span>
          </div>
        </div>
        <div className="flex gap-12">
          <HeaderStat title={t`Payments`} stat={payments} />
          <HeaderStat title={t`Total volume`} stat={`Ξ${totalVolume}`} />
          <HeaderStat title={t`Last 7 days`} stat={`${last7DaysPercent}%`} />
        </div>
      </div>
    </div>
  )
}
