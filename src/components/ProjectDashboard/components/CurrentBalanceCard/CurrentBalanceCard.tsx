import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import { Tooltip } from 'antd'
import { useCurrentBalanceCard } from 'components/ProjectDashboard/hooks'
import { useProjectPageQueries } from 'components/ProjectDashboard/hooks/useProjectPageQueries'
import { TruncatedText } from 'components/TruncatedText'
import { useCallback } from 'react'
import { twMerge } from 'tailwind-merge'
import { treasuryBalanceTooltip } from '../CyclesPayoutsPanel/components/CyclesPanelTooltips'
import { DisplayCard } from '../ui'

export const CurrentBalanceCard = ({ className }: { className?: string }) => {
  const { treasuryBalance } = useCurrentBalanceCard()
  const { setProjectPageTab } = useProjectPageQueries()

  const openActivityTab = useCallback(
    () => setProjectPageTab('activity'),
    [setProjectPageTab],
  )

  return (
    <DisplayCard
      className={twMerge('min-w-0 cursor-pointer pr-9', className)}
      onClick={openActivityTab}
    >
      <Tooltip
        className="flex min-w-0 items-center gap-1"
        title={treasuryBalanceTooltip}
      >
        <span className="truncate whitespace-nowrap text-base font-medium">
          <Trans>Current Balance</Trans>
        </span>
        <QuestionMarkCircleIcon className="h-4 w-4 flex-shrink-0 text-grey-500 dark:text-slate-200" />
      </Tooltip>
      <div className="mt-4 flex min-w-0 items-center gap-2">
        <TruncatedText
          className="text-2xl font-medium"
          text={treasuryBalance}
        />
      </div>
      <div className="mt-3.5 text-smoke-500 dark:text-slate-200">
        <Trans>Click to view activity</Trans>
      </div>
    </DisplayCard>
  )
}
