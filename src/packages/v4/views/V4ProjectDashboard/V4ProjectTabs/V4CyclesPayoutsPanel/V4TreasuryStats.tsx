import { Trans, t } from '@lingui/macro'
import {
  availableToPayOutTooltip,
  treasuryBalanceTooltip,
} from 'components/Project/ProjectTabs/CyclesPayoutsTab/CyclesPanelTooltips'

import { TitleDescriptionDisplayCard } from 'components/Project/ProjectTabs/TitleDescriptionDisplayCard'
import { useMemo } from 'react'
import { useV4TreasuryStats } from './hooks/useV4TreasuryStats'

export const V4TreasuryStats = () => {
  const { availableToPayout, surplusElement, treasuryBalance, cashOutTaxRate } =
    useV4TreasuryStats()

  const surplusTooltip = useMemo(
    () =>
      cashOutTaxRate && cashOutTaxRate.toFloat() > 0 ? (
        <Trans>
          {surplusElement} is available across all chains for token redemptions or future payouts.
        </Trans>
      ) : (
        <Trans>{surplusElement} is available across all chains for future payouts.</Trans>
      ),
    [surplusElement, cashOutTaxRate],
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
        description={surplusElement}
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
