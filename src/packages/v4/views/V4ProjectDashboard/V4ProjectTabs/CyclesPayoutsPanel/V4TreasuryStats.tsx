import { Trans, t } from '@lingui/macro'
import {
  availableToPayOutTooltip,
  treasuryBalanceTooltip,
} from 'components/Project/ProjectTabs/CyclesPayoutsTab/CyclesPanelTooltips'
import { TitleDescriptionDisplayCard } from 'components/Project/ProjectTabs/TitleDescriptionDisplayCard'
import { useMemo } from 'react'
import { useV4TreasuryStats } from './hooks/useV4TreasuryStats'

export const V4TreasuryStats = () => {
  const { availableToPayout, surplus, treasuryBalance, redemptionRate } =
    useV4TreasuryStats()

  const surplusTooltip = useMemo(
    () =>
      redemptionRate && redemptionRate.toFloat() > 0 ? (
        <Trans>
          {surplus} is available for token redemptions or future payouts.
        </Trans>
      ) : (
        <Trans>{surplus} is available for future payouts.</Trans>
      ),
    [surplus, redemptionRate],
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
        title={t`Surplus`}
        description={surplus}
        tooltip={surplusTooltip}
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
