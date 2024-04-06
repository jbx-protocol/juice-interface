import { usePayoutSplitAmountPercentage } from 'components/Create/hooks/usePayoutSplitAmountPercentage'
import { Parenthesis } from 'components/Parenthesis'
import { Allocation } from 'components/v2v3/shared/Allocation/Allocation'
import { PayoutsSelection } from 'models/payoutsSelection'
import { useMemo } from 'react'
import { formatCurrencyAmount } from 'utils/format/formatCurrencyAmount'
import { formatPercent } from 'utils/format/formatPercent'

export const Amount = ({
  allocationId, // if undefined, assume owner
  payoutsSelection,
}: {
  allocationId?: string
  payoutsSelection: PayoutsSelection
}) => {
  const isOwner = allocationId === undefined

  const { allocations, totalAllocationAmount, allocationCurrency } =
    Allocation.useAllocationInstance()

  const { amount, percent } = usePayoutSplitAmountPercentage({
    allocationId: allocationId,
    allocations,
    totalAllocationAmount: totalAllocationAmount,
  })
  const formattedAmount = useMemo(() => {
    if (amount === undefined) return undefined
    let _amount = amount
    if (isOwner && amount <= 0) {
      _amount = 0
    }
    return formatCurrencyAmount({
      amount: _amount,
      currency: allocationCurrency,
    })
  }, [allocationCurrency, amount, isOwner])

  const formattedPercent = useMemo(() => {
    let _percent = percent
    if (isOwner && percent <= 0) {
      _percent = 0
    }
    return formatPercent(_percent)
  }, [isOwner, percent])

  const [primaryText, secondaryText] = useMemo(() => {
    if (payoutsSelection === 'amounts') {
      return [formattedAmount, formattedPercent]
    }
    if (payoutsSelection === 'percentages') {
      return [formattedPercent, formattedAmount]
    }

    throw new Error('Unexpected end of function')
  }, [formattedAmount, formattedPercent, payoutsSelection])

  return (
    <div className="flex justify-end gap-2">
      {!!primaryText && primaryText}
      <span className="text-grey-400 dark:text-slate-200">
        <Parenthesis>{!!secondaryText && secondaryText}</Parenthesis>
      </span>
    </div>
  )
}
