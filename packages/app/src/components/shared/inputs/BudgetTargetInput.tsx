import { CaretDownOutlined } from '@ant-design/icons'
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
  currency?: BudgetCurrency
  value?: string
  onValueChange: (value?: string) => void
  onCurrencyChange: (currency: BudgetCurrency) => void
  disabled?: boolean
  placeholder?: string
}) {
  const [_currency, setCurrency] = useState<BudgetCurrency>()

  useEffect(() => setCurrency(currency), [currency])

  if (_currency === undefined) return null

  return (
    <div style={{ display: 'flex', alignItems: 'baseline' }}>
      <FormattedNumberInput
        style={{ flex: 1 }}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={value => onValueChange(value?.toString())}
      />
      <InputAccessoryButton
        onClick={() => {
          const newCurrency = _currency === '1' ? '0' : '1'
          setCurrency(newCurrency)
          onCurrencyChange(newCurrency)
        }}
        content={
          <span>
            {budgetCurrencyName(_currency)}{' '}
            <CaretDownOutlined
              style={{ fontSize: 10, marginLeft: -4, marginRight: -4 }}
            />
          </span>
        }
        placement="suffix"
      />
    </div>
  )
}
