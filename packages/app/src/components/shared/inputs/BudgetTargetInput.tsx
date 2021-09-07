import { ThemeContext } from 'contexts/themeContext'
import { BigNumber } from 'ethers'
import { CurrencyOption } from 'models/currency-option'
import { useContext, useEffect, useState } from 'react'
import { currencyName } from 'utils/currency'
import { formatWad, fromPerbicent, parseWad } from 'utils/formatNumber'
import { amountSubFee } from 'utils/math'

import CurrencySymbol from '../CurrencySymbol'
import InputAccessoryButton from '../InputAccessoryButton'
import FormattedNumberInput from './FormattedNumberInput'

export default function BudgetTargetInput({
  currency,
  value,
  onValueChange,
  onCurrencyChange,
  disabled,
  placeholder,
  fee,
}: {
  currency: CurrencyOption
  value: string | undefined
  onValueChange: (value?: string) => void
  onCurrencyChange?: (currency: CurrencyOption) => void
  disabled?: boolean
  placeholder?: string
  fee: BigNumber | undefined
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const [_currency, setCurrency] = useState<CurrencyOption>()

  useEffect(() => setCurrency(currency), [currency])

  if (_currency === undefined) return null

  return (
    <div>
      <FormattedNumberInput
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        accessory={
          onCurrencyChange ? (
            <InputAccessoryButton
              onClick={() => {
                const newCurrency = _currency === 1 ? 0 : 1
                setCurrency(newCurrency)
                onCurrencyChange(newCurrency)
              }}
              content={currencyName(_currency)}
              withArrow={true}
              placement="suffix"
            />
          ) : (
            <InputAccessoryButton
              content={currencyName(_currency)}
              placement="suffix"
            />
          )
        }
        onChange={value => onValueChange(value?.toString())}
      />
      {fee?.gt(0) && (
        <div style={{ color: colors.text.primary, marginBottom: 10 }}>
          <span style={{ fontWeight: 500 }}>
            <CurrencySymbol currency={currency} />
            {formatWad(amountSubFee(parseWad(value), fee))}
          </span>{' '}
          after {fromPerbicent(fee?.toString())}% JBX fee
        </div>
      )}
    </div>
  )
}
