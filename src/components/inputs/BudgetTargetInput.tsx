import { BigNumber } from 'ethers'
import { useEffect, useState } from 'react'
import { perbicentToPercent } from 'utils/format/formatNumber'

import { Trans } from '@lingui/macro'

import { CurrencyName } from 'constants/currency'
import CurrencySwitch from '../currency/CurrencySwitch'
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
        <div className="mb-2 mt-2 flex items-center text-black dark:text-slate-100">
          <div className="mr-0 flex-grow font-medium">
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
