import { ThemeContext } from 'contexts/themeContext'
import { BigNumber } from 'ethers'
import { CurrencyOption } from 'models/currency-option'
import { CSSProperties, useContext, useEffect, useState } from 'react'
import { currencyName } from 'utils/currency'
import { fromPerbicent } from 'utils/formatNumber'

import InputAccessoryButton from '../InputAccessoryButton'
import FormattedNumberInput from './FormattedNumberInput'

export default function BudgetTargetInput({
  currency,
  target,
  targetSubFee,
  onTargetChange,
  onTargetSubFeeChange,
  onCurrencyChange,
  disabled,
  placeholder,
  fee,
}: {
  currency: CurrencyOption
  target: string | undefined
  targetSubFee: string | undefined
  onTargetChange: (target?: string) => void
  onTargetSubFeeChange: (target?: string) => void
  onCurrencyChange?: (currency: CurrencyOption) => void
  disabled?: boolean
  placeholder?: string
  fee: BigNumber | undefined
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const targetSubFeeStyles: CSSProperties = {
    color: colors.text.primary,
    marginBottom: 10,
    marginTop: 10,
    display: 'flex',
    alignItems: 'center',
  }

  const [_currency, setCurrency] = useState<CurrencyOption>()

  useEffect(() => setCurrency(currency), [currency])

  if (_currency === undefined) return null

  return (
    <div>
      <FormattedNumberInput
        value={target}
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
        onChange={target => onTargetChange(target?.toString())}
      />
      {fee?.gt(0) && (
        <div style={targetSubFeeStyles}>
          <div style={{ fontWeight: 500, width: 100, marginRight: 8 }}>
            <FormattedNumberInput
              value={targetSubFee}
              placeholder={placeholder}
              disabled={disabled}
              onChange={newTargetSubFee =>
                onTargetSubFeeChange(newTargetSubFee?.toString())
              }
            />
          </div>
          after {fromPerbicent(fee?.toString())}% JBX fee
        </div>
      )}
    </div>
  )
}
