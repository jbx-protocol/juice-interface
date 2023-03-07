import { Form } from 'antd'

import { BigNumber } from '@ethersproject/bignumber'

import { Trans } from '@lingui/macro'

import { CurrencyName } from 'constants/currency'
import BudgetTargetInput from '../inputs/BudgetTargetInput'
import { FormItemExt } from './formItemExt'
import { DISTRIBUTION_LIMIT_EXPLANATION } from 'components/v2v3/V2V3Project/V2V3FundingCycleSection/settingExplanations'

export default function ProjectTarget({
  hideLabel,
  target,
  targetSubFee,
  currency,
  onTargetChange,
  onTargetSubFeeChange,
  onCurrencyChange,
  disabled,
  formItemProps,
  feePerbicent,
}: {
  target: string | undefined
  targetSubFee: string | undefined
  onTargetChange: (val: string | undefined) => void
  onTargetSubFeeChange: (val: string | undefined) => void
  currency: CurrencyName
  onCurrencyChange: (val: CurrencyName) => void
  disabled?: boolean
  feePerbicent?: BigNumber
} & FormItemExt) {
  return (
    <Form.Item
      extra={DISTRIBUTION_LIMIT_EXPLANATION}
      label={hideLabel ? undefined : <Trans>Funding target</Trans>}
      {...formItemProps}
    >
      <BudgetTargetInput
        target={target}
        targetSubFee={targetSubFee}
        onTargetChange={onTargetChange}
        onTargetSubFeeChange={onTargetSubFeeChange}
        currency={currency}
        onCurrencyChange={onCurrencyChange}
        disabled={disabled}
        placeholder="0"
        feePerbicent={feePerbicent}
      />
    </Form.Item>
  )
}
