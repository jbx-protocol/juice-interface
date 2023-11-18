import { t, Trans } from '@lingui/macro'
import { CsvUpload } from 'components/inputs/CsvUpload'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { Split } from 'models/splits'
import { useCallback, useContext, useEffect, useMemo } from 'react'
import { getTotalSplitsPercentage } from 'utils/v2v3/distributions'

import { Callout } from 'components/Callout/Callout'
import TooltipIcon from 'components/TooltipIcon'
import {
  Allocation,
  AllocationSplit,
} from 'components/v2v3/shared/Allocation/Allocation'
import { OwnerPayoutCard } from 'components/v2v3/shared/PayoutCard/OwnerPayoutCard'
import { PayoutCard } from 'components/v2v3/shared/PayoutCard/PayoutCard'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { PayoutsSelection } from 'models/payoutsSelection'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import Link from 'next/link'
import { twMerge } from 'tailwind-merge'
import { parseV2SplitsCsv } from 'utils/csv'
import { formatFundingTarget } from 'utils/format/formatFundingTarget'
import { formatPercent } from 'utils/format/formatPercent'
import { settingsPagePath } from 'utils/routes'
import { allocationToSplit, splitToAllocation } from 'utils/splitToAllocation'
import { isInfiniteDistributionLimit } from 'utils/v2v3/fundingCycle'

export const V2V3EditPayouts = ({
  editingSplits,
  setEditingSplits,
  open,
  disabled,
}: {
  editingSplits: Split[]
  setEditingSplits: (splits: Split[]) => void
  open?: boolean
  disabled?: boolean
}) => {
  const {
    payoutSplits: contextPayoutSplits,
    distributionLimit,
    distributionLimitCurrency: distributionLimitCurrencyBigNumber,
    handle,
  } = useContext(V2V3ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)

  const isLockedAllocation = useCallback(
    (allocation: AllocationSplit) => {
      const now = new Date().valueOf() / 1000
      if (!allocation.lockedUntil || allocation.lockedUntil < now) return false

      // Checks if the given split exists in the projectContext splits.
      // If it doesn't, then it means it was just added or edited is which case
      // we want to still be able to edit it
      const contextMatch = contextPayoutSplits
        ?.map(splitToAllocation)
        .find(confirmed => confirmed.id === allocation.id)
      if (contextMatch && contextMatch.lockedUntil) {
        // Check to make sure that the original allocation is actually still locked
        return contextMatch.lockedUntil > now
      }
      return false
    },
    [contextPayoutSplits],
  )

  const totalSplitsPercentage = useMemo(
    () => getTotalSplitsPercentage(editingSplits),
    [editingSplits],
  )
  const totalSplitsPercentageInvalid = totalSplitsPercentage > 100

  const payoutsSelection: PayoutsSelection = useMemo(() => {
    // As we dont have control of amounts/percentage out of create, always use
    // amounts, and fall back to percentages when amounts is unavailable.
    if (distributionLimit && isInfiniteDistributionLimit(distributionLimit)) {
      return 'percentages'
    }
    return 'amounts'
  }, [distributionLimit])

  const distributionLimitCurrency = useMemo(
    () => distributionLimitCurrencyBigNumber?.toNumber() as V2V3CurrencyOption,
    [distributionLimitCurrencyBigNumber],
  )

  // Load original splits from context into editing splits.
  useEffect(() => {
    setEditingSplits(contextPayoutSplits ?? [])
  }, [contextPayoutSplits, setEditingSplits, open])

  const onCsvUpload = useCallback(
    (newSplits: Split[]) => setEditingSplits(newSplits),
    [setEditingSplits],
  )

  const onAllocationsChanged = useCallback(
    (newAllocations: AllocationSplit[]) =>
      setEditingSplits(newAllocations.map(allocationToSplit)),
    [setEditingSplits],
  )

  const mustEditCycleText = (
    <Trans>
      You must{' '}
      <Link href={settingsPagePath('cycle', { projectId, handle })}>
        Edit your Cycle
      </Link>{' '}
      to change your total payout amount.
    </Trans>
  )

  if (disabled) {
    return (
      <div className="flex flex-col gap-4">
        <div>
          <Trans>
            Cannot set payouts because your <strong>Total payouts</strong> is
            Zero.
          </Trans>
        </div>
        <div>{mustEditCycleText}</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="mb-8 flex flex-col gap-4">
        <div>
          <Trans>
            Set payouts as percentages of the total amount being paid out.
          </Trans>
        </div>
        <Callout.Info>
          <Trans>Changes to payouts will take effect immediately.</Trans>
        </Callout.Info>
      </div>

      <CsvUpload
        onChange={onCsvUpload}
        templateUrl={'/assets/csv/v2-splits-template.csv'}
        parser={parseV2SplitsCsv}
      />

      <Allocation
        value={editingSplits.map(splitToAllocation)}
        onChange={onAllocationsChanged}
        allocationCurrency={distributionLimitCurrency}
        totalAllocationAmount={distributionLimit}
      >
        <div className="flex flex-col gap-4">
          <OwnerPayoutCard payoutsSelection={payoutsSelection} />
          <Allocation.List
            allocationName={t`payout`}
            availableModes={
              new Set([
                payoutsSelection === 'amounts' ? 'amount' : 'percentage',
              ])
            }
          >
            {(
              modal,
              { allocations, removeAllocation, setSelectedAllocation },
            ) => (
              <>
                {allocations
                  .filter(alloc => !isLockedAllocation(alloc))
                  .map(allocation => (
                    <PayoutCard
                      payoutsSelection={payoutsSelection}
                      key={allocation.id}
                      allocation={allocation}
                      onDeleteClick={() => removeAllocation(allocation.id)}
                      onClick={() => {
                        setSelectedAllocation(allocation)
                        modal.open()
                      }}
                    />
                  ))}

                {allocations.filter(isLockedAllocation).map(allocation => (
                  <PayoutCard
                    payoutsSelection={payoutsSelection}
                    key={allocation.id}
                    allocation={allocation}
                  />
                ))}
              </>
            )}
          </Allocation.List>
        </div>
      </Allocation>

      <div
        className={twMerge(
          'flex items-center pt-2 font-medium',
          totalSplitsPercentageInvalid
            ? 'text-warning-600 dark:text-warning-100'
            : undefined,
        )}
      >
        <Trans>
          Total payouts:{' '}
          {formatFundingTarget({
            distributionLimitWad: distributionLimit,
            distributionLimitCurrency,
          })}
        </Trans>
        <TooltipIcon iconClassName="ml-2" tip={mustEditCycleText} />
      </div>

      {totalSplitsPercentageInvalid && (
        <span className="text-error-500 dark:text-error-400">
          {payoutsSelection === 'amounts' ? (
            <Trans>Payouts cannot exceed the total amount being paid out</Trans>
          ) : (
            <Trans>
              Payouts cannot exceed 100%. Total:{' '}
              {formatPercent(totalSplitsPercentage)}
            </Trans>
          )}
        </span>
      )}
    </div>
  )
}
