import { LockClosedIcon, LockOpenIcon } from '@heroicons/react/24/solid'
import { Trans, t } from '@lingui/macro'
import { Tooltip } from 'antd'
import { useCurrentCycleCard } from 'components/ProjectDashboard/hooks'
import { useProjectPageQueries } from 'components/ProjectDashboard/hooks/useProjectPageQueries'
import { useCallback, useMemo } from 'react'
import { twMerge } from 'tailwind-merge'
import { cycleTooltip } from '../CyclesPayoutsPanel/components/CyclesPanelTooltips'
import { DisplayCard } from '../ui'

export const CurrentCycleCard = ({ className }: { className?: string }) => {
  const { currentCycleNumber, timeRemainingText, isUnlocked } =
    useCurrentCycleCard()
  const { setProjectPageTab } = useProjectPageQueries()

  const openCyclePayoutsTab = useCallback(
    () => setProjectPageTab('cycle_payouts'),
    [setProjectPageTab],
  )

  const LockIcon = useMemo(
    () => (isUnlocked ? LockOpenIcon : LockClosedIcon),
    [isUnlocked],
  )

  const text = useMemo(
    () => (isUnlocked ? t`Unlocked` : timeRemainingText),
    [isUnlocked, timeRemainingText],
  )

  return (
    <DisplayCard
      className={twMerge('hidden cursor-pointer pr-9 lg:block', className)}
      onClick={openCyclePayoutsTab}
    >
      <Tooltip title={cycleTooltip}>
        <div className="font-medium">
          <Trans>Current Cycle: #{currentCycleNumber}</Trans>
        </div>
        <div className="mt-6 flex items-center gap-2">
          <span className="text-2xl font-medium xl:whitespace-nowrap">
            {text}
          </span>
          <LockIcon className="h-4 w-4 text-smoke-400 dark:text-slate-300" />
        </div>
        <div className="mt-3 text-smoke-500 dark:text-slate-200">
          <Trans>until Cycle #{currentCycleNumber + 1}</Trans>
        </div>
      </Tooltip>
    </DisplayCard>
  )
}
