import { LockClosedIcon, LockOpenIcon } from '@heroicons/react/24/solid'
import { Trans, t } from '@lingui/macro'
import { Tooltip } from 'antd'
import { useCurrentCycleCard } from 'components/ProjectDashboard/hooks'
import { useProjectPageQueries } from 'components/ProjectDashboard/hooks/useProjectPageQueries'
import { TruncatedText } from 'components/TruncatedText'
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
      className={twMerge('min-w-0 cursor-pointer pr-9', className)}
      onClick={openCyclePayoutsTab}
    >
      <Tooltip title={cycleTooltip}>
        <div className="truncate whitespace-nowrap font-medium">
          <Trans>Current Cycle: #{currentCycleNumber}</Trans>
        </div>
      </Tooltip>
      <div className="mt-6 flex min-w-0 items-center gap-2">
        <TruncatedText className="text-2xl font-medium" text={text} />
        <LockIcon className="h-4 w-4 flex-shrink-0 text-smoke-400 dark:text-slate-300" />
      </div>
      <TruncatedText
        className="mt-3 text-smoke-500 dark:text-slate-200"
        text={t`until Cycle #${currentCycleNumber + 1}`}
      />
    </DisplayCard>
  )
}
