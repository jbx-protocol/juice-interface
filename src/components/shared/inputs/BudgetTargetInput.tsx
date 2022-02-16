import { ThemeContext } from 'contexts/themeContext'
import { BigNumber } from 'ethers'
import { V1CurrencyOption } from 'models/v1/currencyOption'
import { CSSProperties, useContext, useEffect, useState } from 'react'
import { currencyName } from 'utils/v1/currency'
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
  currency: V1CurrencyOption
  target: string | undefined
  targetSubFee: string | undefined
  onTargetChange: (target?: string) => void
  onTargetSubFeeChange: (target?: string) => void
  onCurrencyChange?: (currency: V1CurrencyOption) => void
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

  const [_currency, setCurrency] = useState<V1CurrencyOption>()

  useEffect(() => setCurrency(currency), [currency])

  if (_currency === undefined) return null

  function CurrencySwitch() {
    if (onCurrencyChange)
      return (
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
      )
    return (
      <InputAccessoryButton
        content={currencyName(_currency)}
        placement="suffix"
      />
    )
  }

  return (
    <div>
      <FormattedNumberInput
        value={target}
        placeholder={placeholder}
        disabled={disabled}
        accessory={<CurrencySwitch />}
        onChange={target => onTargetChange(target?.toString())}
      />
      {fee?.gt(0) && (
        <div style={targetSubFeeStyles}>
          <div style={{ fontWeight: 500, flexGrow: 1, marginRight: 8 }}>
            <FormattedNumberInput
              value={targetSubFee}
              placeholder={placeholder}
              disabled={disabled}
              accessory={<CurrencySwitch />}
              onChange={newTargetSubFee =>
                onTargetSubFeeChange(newTargetSubFee?.toString())
              }
            />
          </div>
          <div>after {fromPerbicent(fee?.toString())}% JBX fee</div>
        </div>
      )}
    </div>
  )
}
