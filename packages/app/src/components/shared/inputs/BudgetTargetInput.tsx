import { BudgetCurrency } from 'models/budget-currency'
import React, { useEffect, useState } from 'react'
import { budgetCurrencyName } from 'utils/budgetCurrency'

import InputAccessoryButton from '../InputAccessoryButton'
import FormattedNumberInput from './FormattedNumberInput'

export default function BudgetTargetInput({
  currency,
  value,
  onValueChange,
  onCurrencyChange,
  disabled,
  placeholder,
}: {
  currency: BudgetCurrency
  value: string | undefined
  onValueChange: (value?: string) => void
  onCurrencyChange: (currency: BudgetCurrency) => void
  disabled?: boolean
  placeholder?: string
}) {
  const [_currency, setCurrency] = useState<BudgetCurrency>()

  useEffect(() => setCurrency(currency), [currency])

  if (_currency === undefined) return null

  return (
    <FormattedNumberInput
      value={value}
      placeholder={placeholder}
      disabled={disabled}
      accessory={
        <InputAccessoryButton
          onClick={() => {
            const newCurrency = _currency === '1' ? '0' : '1'
            setCurrency(newCurrency)
            onCurrencyChange(newCurrency)
          }}
          content={<span>{budgetCurrencyName(_currency)}</span>}
          withArrow={true}
          placement="suffix"
        />
      }
      onChange={value => onValueChange(value?.toString())}
    />
  )
}
