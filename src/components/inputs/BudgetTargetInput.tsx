import { ThemeContext } from 'contexts/themeContext'
import { BigNumber } from '@ethersproject/bignumber'
import { CSSProperties, useContext, useEffect, useState } from 'react'
import { perbicentToPercent } from 'utils/formatNumber'

import { Trans } from '@lingui/macro'

import FormattedNumberInput from './FormattedNumberInput'
import { CurrencyName } from 'constants/currency'
import CurrencySwitch from '../CurrencySwitch'

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
  showTargetSubFeeInput = true,
}: {
  currency: CurrencyName
  target: string | undefined
  targetSubFee: string | undefined
  onTargetChange: (target?: string) => void
  onTargetSubFeeChange?: (target?: string) => void
  onCurrencyChange?: (currency: CurrencyName) => void
  disabled?: boolean
  placeholder?: string
  feePerbicent: BigNumber | undefined
  showTargetSubFeeInput?: boolean
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

  const [_currency, setCurrency] = useState<CurrencyName>()

  useEffect(() => setCurrency(currency), [currency])

  if (_currency === undefined) return null

  const _currencySwitch = onCurrencyChange ? (
    <CurrencySwitch
      onCurrencyChange={(currencyName: CurrencyName) => {
        setCurrency(currencyName)
        onCurrencyChange(currencyName)
      }}
      currency={_currency}
    />
  ) : undefined

  return (
    <div>
      <FormattedNumberInput
        value={target}
        placeholder={placeholder}
        disabled={disabled}
        accessory={_currencySwitch}
        onChange={target => onTargetChange(target?.toString())}
      />
      {feePerbicent?.gt(0) && showTargetSubFeeInput && (
        <div style={targetSubFeeStyles}>
          <div style={{ fontWeight: 500, flexGrow: 1, marginRight: 8 }}>
            <FormattedNumberInput
              value={targetSubFee}
              placeholder={placeholder}
              disabled={disabled}
              accessory={_currencySwitch}
              onChange={newTargetSubFee =>
                onTargetSubFeeChange?.(newTargetSubFee?.toString())
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
