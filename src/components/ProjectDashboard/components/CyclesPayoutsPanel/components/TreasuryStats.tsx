import { Trans, t } from '@lingui/macro'
import { useMemo } from 'react'
import { TitleDescriptionDisplayCard } from '../../ui/TitleDescriptionDisplayCard'
import { useTreasuryStats } from '../hooks/useTreasuryStats'
import {
  availableToPayOutTooltip,
  treasuryBalanceTooltip,
} from './CyclesPanelTooltips'

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
    <div className="grid w-full grid-cols-2 gap-4 md:flex md:items-center">
      <TitleDescriptionDisplayCard
        className="flex w-full"
        title={t`Treasury balance`}
        description={treasuryBalance}
        tooltip={treasuryBalanceTooltip}
      />
      <TitleDescriptionDisplayCard
        className="flex w-full"
        title={t`Overflow`}
        description={overflow}
        tooltip={overflowTooltip}
      />
      <TitleDescriptionDisplayCard
        className="col-span-2 flex w-full"
        title={t`Available to pay out`}
        description={availableToPayout}
        tooltip={availableToPayOutTooltip}
      />
    </div>
  )
}
