import { t, Trans } from '@lingui/macro'
import { Divider, Space } from 'antd'
import { CsvUpload } from 'components/CsvUpload/CsvUpload'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { Split } from 'models/splits'
import { useCallback, useContext, useEffect, useMemo } from 'react'
import { getTotalSplitsPercentage } from 'utils/v2v3/distributions'

import { Callout } from 'components/Callout'
import { Allocation, AllocationSplit } from 'components/Allocation'
import { OwnerPayoutCard } from 'components/PayoutCard'
import { PayoutCard } from 'components/PayoutCard/PayoutCard'
import { formatFundingTarget } from 'utils/format/formatFundingTarget'
import { allocationToSplit, splitToAllocation } from 'utils/splitToAllocation'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import { parseV2SplitsCsv } from 'utils/csv'
import { formatCurrencyAmount } from 'utils/formatCurrencyAmount'
import { MAX_DISTRIBUTION_LIMIT } from 'utils/v2v3/math'
import { twMerge } from 'tailwind-merge'
import { PayoutsSelection } from 'models/payoutsSelection'
import { calculateExpenseFromPercentageOfWad } from 'utils/calculateExpenseFromPercentageOfWad'
import { formatPercent } from 'utils/format/formatPercent'

export const V2V3EditPayouts = ({
  editingSplits,
  setEditingSplits,
  open,
}: {
  editingSplits: Split[]
  setEditingSplits: (splits: Split[]) => void
  open?: boolean
}) => {
  const {
    payoutSplits: contextPayoutSplits,
    distributionLimit,
    distributionLimitCurrency: distributionLimitCurrencyBigNumber,
  } = useContext(V2V3ProjectContext)

  const isLockedAllocation = useCallback(
    (allocation: AllocationSplit) => {
      const now = new Date().valueOf() / 1000
      if (!allocation.lockedUntil || allocation.lockedUntil < now) return false

      // Checks if the given split exists in the projectContext splits.
      // If it doesn't, then it means it was just added or edited is which case
      // we want to still be able to edit it
      const confirmedAllocIncludesAlloc =
        contextPayoutSplits
          ?.map(splitToAllocation)
          .find(confirmed => confirmed.id === allocation.id) !== undefined

      return confirmedAllocIncludesAlloc
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
    if (
      !distributionLimit ||
      distributionLimit.eq(0) ||
      distributionLimit.eq(MAX_DISTRIBUTION_LIMIT)
    ) {
      return 'percentages'
    }
    return 'amounts'
  }, [distributionLimit])

  const availablePayoutModesInModal = useMemo(() => {
    // TODO: This is a discrepency between `AllocationList::availableModes` and `PayoutsSelection`.
    const set = new Set<'percentage' | 'amount'>(['percentage'])
    if (payoutsSelection === 'amounts') set.add('amount')
    return set
  }, [payoutsSelection])

  const distributionLimitCurrency = useMemo(
    () => distributionLimitCurrencyBigNumber?.toNumber() as V2V3CurrencyOption,
    [distributionLimitCurrencyBigNumber],
  )

  const expenses = useMemo(() => {
    if (!distributionLimit) return 0
    return calculateExpenseFromPercentageOfWad({
      percentage: totalSplitsPercentage,
      wad: distributionLimit,
    })
  }, [distributionLimit, totalSplitsPercentage])

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

  return (
    <>
      <Space className="mb-8 w-full" direction="vertical" size="middle">
        <div>
          <Trans>
            Reconfigure payouts as percentages of your distribution limit.
          </Trans>
        </div>
        <Callout.Info>
          <Trans>Changes to payouts will take effect immediately.</Trans>
        </Callout.Info>
      </Space>

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
        <Space className="w-full" direction="vertical" size="middle">
          <OwnerPayoutCard payoutsSelection={payoutsSelection} />
          <Allocation.List
            allocationName={t`payout`}
            availableModes={availablePayoutModesInModal}
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
        </Space>
      </Allocation>

      {payoutsSelection === 'amounts' && (
        <div
          className={twMerge(
            'flex items-center pt-4',
            totalSplitsPercentageInvalid
              ? 'text-warning-600 dark:text-warning-100'
              : undefined,
          )}
        >
          <span>
            Current Funding Target:{' '}
            {formatFundingTarget({
              distributionLimitWad: distributionLimit,
              distributionLimitCurrency,
            })}
          </span>
          <Divider type="vertical" className="mx-4 h-6" />
          <span>
            Expenses:{' '}
            {formatCurrencyAmount({
              amount: expenses,
              currency: distributionLimitCurrency,
            })}
          </span>
        </div>
      )}

      {totalSplitsPercentageInvalid && (
        <span className="text-error-500 dark:text-error-400">
          {payoutsSelection === 'amounts' ? (
            <Trans>Expenses cannot exceed the current funding target</Trans>
          ) : (
            <Trans>
              Payouts cannot exceed 100%. Total:{' '}
              {formatPercent(totalSplitsPercentage)}
            </Trans>
          )}
        </span>
      )}
    </>
  )
}
