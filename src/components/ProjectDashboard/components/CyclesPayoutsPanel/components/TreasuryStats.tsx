import { Trans } from '@lingui/macro'
import { Tooltip } from 'antd'
import { DisplayCard } from '../../ui'
import { useTreasuryStats } from '../hooks/useTreasuryStats'
import {
  availableToPayOutTooltip,
  treasuryBalanceTooltip,
} from './CyclesPanelTooltips'

export const TreasuryStats = () => {
  const { availableToPayout, overflow, treasuryBalance, redemptionRate } =
    useTreasuryStats()

  const overflowTooltip = redemptionRate?.gt(0) ? (
    <Trans>
      {overflow} is available for token redemptions or future payouts.
    </Trans>
  ) : (
    <Trans>{overflow} is available for future payouts.</Trans>
  )

  return (
    <div className="grid w-full grid-cols-2 gap-4 md:flex md:items-center">
      <DisplayCard className="flex w-full flex-col gap-2">
        <Tooltip title={treasuryBalanceTooltip}>
          <h3 className="mb-0 max-w-min whitespace-nowrap font-body text-sm font-medium text-grey-600 dark:text-slate-200">
            <Trans>Treasury balance</Trans>
          </h3>
        </Tooltip>
        <span className="font-heading text-xl font-medium dark:text-slate-50">
          {treasuryBalance}
        </span>
      </DisplayCard>
      <DisplayCard className="flex w-full flex-col gap-2">
        <Tooltip title={overflowTooltip}>
          <h3 className="mb-0 max-w-min whitespace-nowrap font-body text-sm font-medium text-grey-600 dark:text-slate-200">
            <Trans>Overflow</Trans>
          </h3>
        </Tooltip>
        <span className="font-heading text-xl font-medium dark:text-slate-50">
          {overflow}
        </span>
      </DisplayCard>
      <DisplayCard className="col-span-2 flex w-full flex-col gap-2">
        <Tooltip title={availableToPayOutTooltip}>
          <h3 className="mb-0 whitespace-nowrap font-body text-sm font-medium text-grey-600 dark:text-slate-200">
            <Trans>Available to pay out</Trans>
          </h3>
        </Tooltip>
        <span className="font-heading text-xl font-medium dark:text-slate-50">
          {availableToPayout}
        </span>
      </DisplayCard>
    </div>
  )
}
