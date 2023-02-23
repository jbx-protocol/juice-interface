import { BigNumber } from '@ethersproject/bignumber'
import { t, Trans } from '@lingui/macro'
import { Button, Space } from 'antd'
import { Allocation, AllocationSplit } from 'components/Allocation'
import { Callout } from 'components/Callout'
import { useFundingTarget } from 'components/Create/components/RecallCard/hooks'
import { OwnerPayoutCard } from 'components/PayoutCard'
import { PayoutCard } from 'components/PayoutCard/PayoutCard'
import { FormItemInput } from 'models/formItemInput'
import { PayoutsSelection } from 'models/payoutsSelection'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import { useCallback, useMemo } from 'react'
import { useEditingDistributionLimit } from 'redux/hooks/EditingDistributionLimit'
import { calculateExpenseFromPercentageOfWad } from 'utils/calculateExpenseFromPercentageOfWad'
import { parseWad } from 'utils/format/formatNumber'
import { V2V3_CURRENCY_ETH } from 'utils/v2v3/currency'
import { MAX_DISTRIBUTION_LIMIT } from 'utils/v2v3/math'

export const PayoutsList = (
  props: FormItemInput<AllocationSplit[]> & {
    payoutsSelection: PayoutsSelection
    isEditable?: boolean
  },
) => {
  const [distributionLimit, setDistributionLimit] =
    useEditingDistributionLimit()
  const fundingTarget = useFundingTarget()

  const totalPercent = useMemo(
    () =>
      props.value?.reduce((acc, allocation) => {
        return acc + allocation.percent
      }, 0) ?? 0,
    [props.value],
  )

  const expenses = useMemo(() => {
    if (!distributionLimit?.amount) return 0
    return calculateExpenseFromPercentageOfWad({
      percentage: totalPercent,
      wad: distributionLimit.amount,
    })
  }, [distributionLimit?.amount, totalPercent])

  const expensesExceedsFundingTarget = useMemo(() => {
    return totalPercent > 100
  }, [totalPercent])

  const availableModes: Set<'amount' | 'percentage'> = useMemo(
    () =>
      new Set(
        props.payoutsSelection === 'amounts' ? ['amount'] : ['percentage'],
      ),
    [props.payoutsSelection],
  )

  const setTotalAllocationAmount = useCallback(
    (total: BigNumber) => {
      setDistributionLimit({
        amount: total,
        currency: distributionLimit?.currency ?? V2V3_CURRENCY_ETH,
      })
    },
    [distributionLimit, setDistributionLimit],
  )

  const setCurrency = useCallback(
    (currency: V2V3CurrencyOption) => {
      setDistributionLimit({
        amount: distributionLimit?.amount ?? BigNumber.from(0),
        currency,
      })
    },
    [distributionLimit, setDistributionLimit],
  )

  const syncExpenses = useCallback(() => {
    if (!expenses) {
      console.warn(
        'Allocation.syncExpenses called with no expenses set in editing',
        { distributionLimit },
      )
      return
    }

    if (distributionLimit?.currency === undefined) {
      console.warn(
        'Allocation.syncExpenses called with no currency set in editing',
        { distributionLimit },
      )
      return
    }

    const newAllocationsWithUpdatedPercents =
      props.value?.map(allocation => {
        const individualExpense = calculateExpenseFromPercentageOfWad({
          percentage: allocation.percent,
          wad: distributionLimit.amount,
        })
        const newPercent = (individualExpense / expenses) * 100
        return {
          ...allocation,
          percent: newPercent,
        }
      }) ?? []
    props.onChange?.(newAllocationsWithUpdatedPercents)

    const newAmount = parseWad(expenses)
    setDistributionLimit({
      amount: newAmount,
      currency: distributionLimit.currency,
    })
  }, [distributionLimit, expenses, props, setDistributionLimit])

  const hasAllocations =
    !!props.value?.length ||
    (distributionLimit?.amount.gt(0) &&
      distributionLimit.amount.lt(MAX_DISTRIBUTION_LIMIT))

  const addButtonSize =
    !hasAllocations && props.payoutsSelection === 'amounts' ? 'large' : 'small'

  return (
    <Allocation
      {...props}
      allocationCurrency={distributionLimit?.currency}
      totalAllocationAmount={distributionLimit?.amount}
      setTotalAllocationAmount={setTotalAllocationAmount}
      setAllocationCurrency={setCurrency}
    >
      <Space className="w-full" direction="vertical" size="middle">
        {props.payoutsSelection === 'percentages' ||
        (distributionLimit && !distributionLimit.amount.eq(0)) ? (
          <OwnerPayoutCard payoutsSelection={props.payoutsSelection} />
        ) : null}
        <Allocation.List
          allocationName={t`payout`}
          isEditable={props.isEditable}
          addButtonSize={addButtonSize}
          availableModes={availableModes}
        >
          {(
            modal,
            { allocations, removeAllocation, setSelectedAllocation },
          ) => (
            <>
              {allocations.map(allocation => (
                <PayoutCard
                  payoutsSelection={props.payoutsSelection}
                  key={allocation.id}
                  allocation={allocation}
                  onDeleteClick={() => removeAllocation(allocation.id)}
                  onClick={() => {
                    setSelectedAllocation(allocation)
                    modal.open()
                  }}
                />
              ))}
            </>
          )}
        </Allocation.List>
        {hasAllocations && (
          <>
            <div className="flex items-center pt-4">
              <span>
                <Trans>Distribution Limit: {fundingTarget}</Trans>
              </span>
            </div>
            {!distributionLimit?.amount.eq(MAX_DISTRIBUTION_LIMIT) &&
              expensesExceedsFundingTarget && (
                <Callout.Warning collapsible={false}>
                  <div className="pb-2 text-base font-medium">
                    <Trans>Funding Target Exceeded</Trans>
                  </div>
                  <p>
                    <Trans>
                      The sum of your expenses is currently different to your
                      funding target. Do you want to sync your funding target to
                      match expenses?
                      <br />
                      <br />
                      If not, please edit one or more of your payouts.
                    </Trans>
                  </p>
                  <Button
                    type="text"
                    className="bg-warning-800 text-white dark:bg-warning-100 dark:text-black"
                    onClick={syncExpenses}
                  >
                    Sync now
                  </Button>
                </Callout.Warning>
              )}
          </>
        )}
      </Space>
    </Allocation>
  )
}
