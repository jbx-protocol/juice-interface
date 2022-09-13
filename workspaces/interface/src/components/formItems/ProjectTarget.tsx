import { Form } from 'antd'

import { BigNumber } from '@ethersproject/bignumber'

import { Trans } from '@lingui/macro'

import { CurrencyName } from 'constants/currency'
import BudgetTargetInput from '../inputs/BudgetTargetInput'
import { FormItemExt } from './formItemExt'

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
      extra={
        <Trans>
          The maximum amount of funds that can be distributed from this project
          in one funding cycle. Funds will be withdrawn in ETH no matter the
          currency you choose.
        </Trans>
      }
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
