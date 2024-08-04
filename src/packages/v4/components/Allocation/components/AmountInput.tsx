import CurrencySwitch from 'components/currency/CurrencySwitch'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'

import { AmountPercentageInput } from 'components/Allocation/types'
import { V4_CURRENCY_ETH, V4_CURRENCY_USD } from 'packages/v4/utils/currency'
import { useCallback, useState } from 'react'
import { Allocation } from '../Allocation'

export const AmountInput = ({
  value,
  onChange,
}: {
  value?: AmountPercentageInput
  onChange?: (input: AmountPercentageInput | undefined) => void
}) => {
  const [_amount, _setAmount] = useState<AmountPercentageInput>({ value: '' })
  const amount = value ?? _amount
  const setAmount = onChange ?? _setAmount

  const { allocationCurrency, setCurrency } = Allocation.useAllocationInstance()
  const currency = allocationCurrency ?? V4_CURRENCY_ETH

  const onAmountInputChange = useCallback(
    (amount: AmountPercentageInput | undefined) => {
      if (amount && !isNaN(parseFloat(amount.value))) {
        setAmount(amount)
        return
      }
    },
    [setAmount],
  )

  return (
    <div className="flex w-full items-center gap-4">
      <FormattedNumberInput
        className="flex-1"
        value={amount.value}
        onChange={val => onAmountInputChange(val ? { value: val } : undefined)}
        accessory={
          <CurrencySwitch
            currency={currency === V4_CURRENCY_ETH ? 'ETH' : 'USD'}
            onCurrencyChange={c =>
              setCurrency(c === 'ETH' ? V4_CURRENCY_ETH : V4_CURRENCY_USD)
            }
            className="rounded"
          />
        }
      />
    </div>
  )
}
