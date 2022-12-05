import { BigNumber } from '@ethersproject/bignumber'
import { t, Trans } from '@lingui/macro'
import { Form, FormInstance } from 'antd'
import ETHAmount from 'components/currency/ETHAmount'
import CurrencySwitch from 'components/CurrencySwitch'
import CurrencySymbol from 'components/CurrencySymbol'
import InputAccessoryButton from 'components/InputAccessoryButton'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import TooltipIcon from 'components/TooltipIcon'
import TooltipLabel from 'components/TooltipLabel'
import { CurrencyName } from 'constants/currency'
import { formatWad, parseWad, stripCommas } from 'utils/format/formatNumber'
import { amountSubFee, formatFee } from 'utils/v2v3/math'
import { AddOrEditSplitFormFields, SplitType } from './types'
import { percentageValidator } from './utils'

export function AmountFormItem({
  form,
  distributionLimit,
  distributionType,
  fee,
  editingSplitType,
  currencyName,
  isFirstSplit,
  onCurrencyChange,
}: {
  form: FormInstance<AddOrEditSplitFormFields>
  distributionType: 'amount' | 'percent' | 'both'
  isEditPayoutPage?: boolean
  distributionLimit?: string
  fee: BigNumber | undefined
  editingSplitType: SplitType
  currencyName: CurrencyName
  isFirstSplit: boolean
  onCurrencyChange?: (currencyName: CurrencyName) => void
}) {
  const amount = Form.useWatch('amount', form)

  function AfterFeeMessage() {
    if (!fee || !amount || amount === '0') return null

    const feePercentage = formatFee(fee)
    try {
      const amountSubFeeValue = amountSubFee(parseWad(stripCommas(amount)), fee)

      return (
        <TooltipLabel
          label={
            <Trans>
              {currencyName === 'ETH' ? (
                <ETHAmount amount={amountSubFeeValue} />
              ) : (
                <>
                  <CurrencySymbol currency={currencyName} />
                  {formatWad(amountSubFeeValue, { precision: 4 })}
                </>
              )}{' '}
              after {feePercentage}% JBX membership fee
            </Trans>
          }
          tip={
            <Trans>
              Payouts to Ethereum addresses incur a {feePercentage}% fee. Your
              project will receive JBX in return at the current issuance rate.
            </Trans>
          }
        />
      )
    } catch (e) {
      console.error(e)
      return null
    }
  }

  return (
    <Form.Item
      className="ant-form-item-extra-only"
      label={t`Distribution amount`}
      required
      extra={
        fee && form.getFieldValue('percent') <= 100 ? (
          <>
            {editingSplitType === 'address' ? (
              <div>
                <AfterFeeMessage />
              </div>
            ) : (
              <Trans>
                Distributing funds to Juicebox projects won't incur fees.
              </Trans>
            )}
          </>
        ) : null
      }
    >
      <div className="flex items-center text-black dark:text-slate-100">
        <Form.Item
          name="amount"
          noStyle
          required
          rules={[
            {
              validator: percentageValidator,
              validateTrigger: 'onCreate',
              required: true,
            },
          ]}
        >
          <FormattedNumberInput
            className="flex-1"
            placeholder={'0'}
            accessory={
              isFirstSplit && onCurrencyChange ? (
                <CurrencySwitch
                  onCurrencyChange={onCurrencyChange}
                  currency={currencyName}
                />
              ) : (
                <InputAccessoryButton content={currencyName} />
              )
            }
          />
        </Form.Item>
        {distributionType === 'amount' ? (
          <div className="ml-2 flex items-center">
            <Trans>{form.getFieldValue('percent') ?? '0'}%</Trans>
            <TooltipIcon
              tip={
                <Trans>
                  If you don't raise the sum of all your payouts (
                  <CurrencySymbol currency={currencyName} />
                  {distributionLimit}), this address will receive{' '}
                  {form.getFieldValue('percent')}% of all the funds you raise.
                </Trans>
              }
              placement={'topLeft'}
              iconClassName={'ml-1'}
            />
          </div>
        ) : null}
      </div>
    </Form.Item>
  )
}
