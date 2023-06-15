import { LockClosedIcon } from '@heroicons/react/24/solid'
import { Trans } from '@lingui/macro'
import { Tooltip } from 'antd'
import { useCurrentCycleCard } from 'components/ProjectDashboard/hooks'
import { twMerge } from 'tailwind-merge'
import { cycleTooltip } from '../CyclesPayoutsPanel/components/CyclesPanelTooltips'
import { DisplayCard } from '../ui'

export const CurrentCycleCard = ({ className }: { className?: string }) => {
  const { currentCycleNumber, timeRemainingText } = useCurrentCycleCard()

  return (
    <DisplayCard className={twMerge('pr-9', className)}>
      <Tooltip title={cycleTooltip}>
        <div>
          <div className="font-medium">
            <Trans>Current Cycle: #{currentCycleNumber}</Trans>
          </div>
          <div className="mt-6 flex items-center gap-1">
            <span className="text-2xl font-medium">{timeRemainingText}</span>
            <LockClosedIcon className="h-4 w-4 text-smoke-400 dark:text-slate-300" />
          </div>
          <div className="mt-3 text-smoke-500 dark:text-slate-200">
            <Trans>until Cycle #{currentCycleNumber + 1}</Trans>
          </div>
        </div>
      </Tooltip>
    </DisplayCard>
  )
}
