import { Trans } from '@lingui/macro'
import { DisplayCard } from '../../ui'
import { useTreasuryStats } from '../hooks/useTreasuryStats'

export const TreasuryStats = () => {
  const { availableToPayout, overflow, treasuryBalance } = useTreasuryStats()

  return (
    <div className="flex w-full items-center gap-4">
      <DisplayCard className="flex w-full flex-col gap-2">
        <h3 className="text-grey-60 font-body0 mb-0 whitespace-nowrap text-sm font-medium dark:text-slate-200">
          <Trans>Treasury balance</Trans>
        </h3>
        <span className="font-heading text-xl font-medium">
          {treasuryBalance}
        </span>
      </DisplayCard>
      <DisplayCard className="flex w-full flex-col gap-2">
        <h3 className="text-grey-60 font-body0 mb-0 whitespace-nowrap text-sm font-medium dark:text-slate-200">
          <Trans>Overflow</Trans>
        </h3>
        <span className="font-heading text-xl font-medium">{overflow}</span>
      </DisplayCard>
      <DisplayCard className="flex w-full flex-col gap-2">
        <h3 className="mb-0 whitespace-nowrap font-body text-sm font-medium dark:text-slate-200">
          <Trans>Available to pay out</Trans>
        </h3>
        <span className="font-heading text-xl font-medium">
          {availableToPayout}
        </span>
      </DisplayCard>
    </div>
  )
}
