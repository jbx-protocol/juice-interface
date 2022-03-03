import {
  targetSubFeeToTargetFormatted,
  targetToTargetSubFeeFormatted,
} from 'components/shared/formItems/formHelpers'
import BudgetTargetInput from 'components/shared/inputs/BudgetTargetInput'
import { BigNumber } from 'ethers'
import { V2CurrencyOption } from 'models/v2/currencyOption'
import { useState } from 'react'
import { toV1Currency } from 'utils/v1/currency'
import { toV2Currency } from 'utils/v2/currency'

export default function FundingTargetInput({
  target,
  targetCurrency,
  onTargetChange,
  onTargetCurrencyChange,
  fee,
}: {
  target: string
  targetCurrency: V2CurrencyOption
  fee: BigNumber | undefined
  onTargetChange: (target: string) => void
  onTargetCurrencyChange: (targetCurrency: V2CurrencyOption) => void
}) {
  const [targetSubFee, setTargetSubFee] = useState<string>()

  return (
    <BudgetTargetInput
      target={target?.toString()}
      targetSubFee={targetSubFee}
      currency={toV1Currency(targetCurrency)}
      onTargetChange={val => {
        onTargetChange(val ?? '0')
        setTargetSubFee(targetToTargetSubFeeFormatted(val ?? '0', fee))
      }}
      onTargetSubFeeChange={val => {
        setTargetSubFee(val ?? '0')
        onTargetChange(targetSubFeeToTargetFormatted(val ?? '0', fee))
      }}
      onCurrencyChange={val => {
        onTargetCurrencyChange(toV2Currency(val))
      }}
      placeholder="0"
      fee={fee}
    />
  )
}
