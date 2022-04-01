import { ThemeContext } from 'contexts/themeContext'
import { BigNumber } from '@ethersproject/bignumber'
import { V1CurrencyOption } from 'models/v1/currencyOption'
import { CSSProperties, useContext, useEffect, useState } from 'react'
import { V1CurrencyName } from 'utils/v1/currency'
import { perbicentToPercent } from 'utils/formatNumber'

import { Trans } from '@lingui/macro'

import InputAccessoryButton from '../InputAccessoryButton'
import FormattedNumberInput from './FormattedNumberInput'
import { V1_CURRENCY_ETH, V1_CURRENCY_USD } from 'constants/v1/currency'

export default function BudgetTargetInput({
  currency,
  target,
  targetSubFee,
  onTargetChange,
  onTargetSubFeeChange,
  onCurrencyChange,
  disabled,
  placeholder,
  feePerbicent,
}: {
  currency: V1CurrencyOption
  target: string | undefined
  targetSubFee: string | undefined
  onTargetChange: (target?: string) => void
  onTargetSubFeeChange: (target?: string) => void
  onCurrencyChange?: (currency: V1CurrencyOption) => void
  disabled?: boolean
  placeholder?: string
  feePerbicent: BigNumber | undefined
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

  const CurrencySwitch = () => {
    if (onCurrencyChange)
      return (
        <InputAccessoryButton
          onClick={() => {
            const newCurrency =
              _currency === V1_CURRENCY_USD ? V1_CURRENCY_ETH : V1_CURRENCY_USD
            setCurrency(newCurrency)
            onCurrencyChange(newCurrency)
          }}
          content={V1CurrencyName(_currency)}
          withArrow
          placement="suffix"
        />
      )
    return (
      <InputAccessoryButton
        content={V1CurrencyName(_currency)}
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
      {feePerbicent?.gt(0) && (
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
          <div>
            <Trans>
              after {perbicentToPercent(feePerbicent?.toString())}% JBX fee
            </Trans>
          </div>
        </div>
      )}
    </div>
  )
}
