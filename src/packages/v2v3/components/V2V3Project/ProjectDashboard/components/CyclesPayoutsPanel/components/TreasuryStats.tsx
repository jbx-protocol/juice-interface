import { Trans, t } from '@lingui/macro'
import {
  availableToPayOutTooltip,
  treasuryBalanceTooltip,
} from 'components/Project/ProjectTabs/CyclesPayoutsTab/CyclesPanelTooltips'
import { TitleDescriptionDisplayCard } from 'components/Project/ProjectTabs/TitleDescriptionDisplayCard'
import { useMemo } from 'react'
import { useTreasuryStats } from '../hooks/useTreasuryStats'

export const TreasuryStats = () => {
  const { availableToPayout, overflow, treasuryBalance, redemptionRate } =
    useTreasuryStats()

  const overflowTooltip = useMemo(
    () =>
      redemptionRate?.gt(0) ? (
        <Trans>
          {overflow} is available for token redemptions or future payouts.
        </Trans>
      ) : (
        <Trans>{overflow} is available for future payouts.</Trans>
      ),
    [overflow, redemptionRate],
  )

  return (
    <div className="flex w-full flex-wrap items-center gap-4">
      <TitleDescriptionDisplayCard
        className="flex flex-1"
        title={t`Treasury balance`}
        description={treasuryBalance}
        tooltip={treasuryBalanceTooltip}
      />
      <TitleDescriptionDisplayCard
        className="flex flex-1"
        title={t`Overflow`}
        description={overflow}
        tooltip={overflowTooltip}
      />
      <TitleDescriptionDisplayCard
        className="flex flex-1"
        title={t`Available to pay out`}
        description={availableToPayout}
        tooltip={availableToPayOutTooltip}
      />
    </div>
  )
}
