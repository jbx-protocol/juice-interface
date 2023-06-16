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
    <div className="flex w-full items-center gap-4">
      <DisplayCard className="flex w-full flex-col gap-2">
        <Tooltip title={treasuryBalanceTooltip}>
          <h3 className="text-grey-60 font-body0 mb-0 max-w-min whitespace-nowrap text-sm font-medium dark:text-slate-200">
            <Trans>Treasury balance</Trans>
          </h3>
        </Tooltip>
        <span className="font-heading text-xl font-medium">
          {treasuryBalance}
        </span>
      </DisplayCard>
      <DisplayCard className="flex w-full flex-col gap-2">
        <Tooltip title={overflowTooltip}>
          <h3 className="text-grey-60 font-body0 mb-0 max-w-min whitespace-nowrap text-sm font-medium dark:text-slate-200">
            <Trans>Overflow</Trans>
          </h3>
        </Tooltip>
        <span className="font-heading text-xl font-medium">{overflow}</span>
      </DisplayCard>
      <DisplayCard className="flex w-full flex-col gap-2">
        <Tooltip title={availableToPayOutTooltip}>
          <h3 className="mb-0 max-w-min whitespace-nowrap font-body text-sm font-medium dark:text-slate-200">
            <Trans>Available to pay out</Trans>
          </h3>
        </Tooltip>
        <span className="font-heading text-xl font-medium">
          {availableToPayout}
        </span>
      </DisplayCard>
    </div>
  )
}
