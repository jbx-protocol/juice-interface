import { CurrencyOption } from 'models/currency-option'
import { useEffect, useState } from 'react'
import { currencyName } from 'utils/currency'

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
  currency: CurrencyOption
  value: string | undefined
  onValueChange: (value?: string) => void
  onCurrencyChange: (currency: CurrencyOption) => void
  disabled?: boolean
  placeholder?: string
}) {
  const [_currency, setCurrency] = useState<CurrencyOption>()

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
          content={<span>{currencyName(_currency)}</span>}
          withArrow={true}
          placement="suffix"
        />
      }
      onChange={value => onValueChange(value?.toString())}
    />
  )
}
