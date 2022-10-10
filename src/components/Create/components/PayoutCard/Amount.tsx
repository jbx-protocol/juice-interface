import { Space } from 'antd'
import { usePayoutSplitAmountPercentage } from 'components/Create/hooks/PayoutSplitAmountPercentage'
import { formatPercent } from 'components/Create/utils/formatPercent'
import { Parenthesis } from 'components/Parenthesis'
import { ThemeContext } from 'contexts/themeContext'
import { PayoutsSelection } from 'models/payoutsSelection'
import { useContext, useMemo } from 'react'
import { formatCurrencyAmount } from 'utils/formatCurrencyAmount'
import { Allocation } from '../Allocation'

export const Amount = ({
  allocationId, // if undefined, assume owner
  payoutsSelection,
}: {
  allocationId?: string
  payoutsSelection: PayoutsSelection
}) => {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const { allocations, totalAllocationAmount, allocationCurrency } =
    Allocation.useAllocationInstance()

  const { amount, percent } = usePayoutSplitAmountPercentage({
    allocationId: allocationId,
    allocations,
    totalAllocationAmount: totalAllocationAmount,
  })
  const formattedAmount =
    amount !== undefined
      ? formatCurrencyAmount({
          amount,
          currency: allocationCurrency,
        })
      : undefined

  const [primaryText, secondaryText] = useMemo(() => {
    const formattedPercent = formatPercent(percent)
    if (payoutsSelection === 'amounts') {
      return [formattedAmount, formattedPercent]
    }
    if (payoutsSelection === 'percentages') {
      return [formattedPercent, formattedAmount]
    }

    throw new Error('Unexpected end of function')
  }, [formattedAmount, payoutsSelection, percent])

  return (
    <Space size="small">
      {!!primaryText && primaryText}
      <span style={{ color: colors.text.tertiary }}>
        <Parenthesis>{!!secondaryText && secondaryText}</Parenthesis>
      </span>
    </Space>
  )
}
