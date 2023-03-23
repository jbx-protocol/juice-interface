import { BigNumber } from '@ethersproject/bignumber'
import { t } from '@lingui/macro'
import { Space } from 'antd'
import { Allocation, AllocationSplit } from 'components/Allocation'
import { OwnerPayoutCard } from 'components/PayoutCard'
import { PayoutCard } from 'components/PayoutCard/PayoutCard'
import { FormItemInput } from 'models/formItemInput'
import { PayoutsSelection } from 'models/payoutsSelection'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import { useCallback, useMemo } from 'react'
import { useEditingDistributionLimit } from 'redux/hooks/EditingDistributionLimit'
import { fromWad, parseWad } from 'utils/format/formatNumber'
import { ceilIfCloseToNextInteger } from 'utils/math'
import { totalSplitsPercent } from 'utils/splits'
import { V2V3_CURRENCY_ETH } from 'utils/v2v3/currency'
import { amountFromPercent } from 'utils/v2v3/distributions'
import { MAX_DISTRIBUTION_LIMIT } from 'utils/v2v3/math'

export const PayoutsList = (
  props: FormItemInput<AllocationSplit[]> & {
    payoutsSelection: PayoutsSelection
    isEditable?: boolean
  },
) => {
  const [distributionLimit, setDistributionLimit] =
    useEditingDistributionLimit()

  const totalPercent = useMemo(
    () => (props.value ? totalSplitsPercent(props.value) : 0),
    [props.value],
  )

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

  const onOwnerPayoutDeleted = useCallback(() => {
    if (!distributionLimit?.amount) return
    const totalAmount = parseFloat(fromWad(distributionLimit.amount))
    const ownerPayoutAmount = totalAmount - (totalPercent / 100) * totalAmount
    const totalAmountAfterRemoval = Math.max(0, totalAmount - ownerPayoutAmount)

    const adjustedAllocations = (props.value ?? []).map(alloc => {
      const currentAmount = amountFromPercent({
        percent: alloc.percent,
        amount: totalAmount.toString(),
      })
      const newPercent = (currentAmount / totalAmountAfterRemoval) * 100
      return { ...alloc, percent: newPercent }
    })
    props.onChange?.(adjustedAllocations)
    setTotalAllocationAmount(parseWad(totalAmountAfterRemoval))
  }, [distributionLimit?.amount, props, setTotalAllocationAmount, totalPercent])

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
        {(props.payoutsSelection === 'percentages' ||
          (distributionLimit && !distributionLimit.amount.eq(0))) &&
        ceilIfCloseToNextInteger(totalPercent) < 100 ? (
          <OwnerPayoutCard
            canBeDeleted={props.payoutsSelection === 'amounts'}
            payoutsSelection={props.payoutsSelection}
            onDelete={onOwnerPayoutDeleted}
          />
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
      </Space>
    </Allocation>
  )
}
