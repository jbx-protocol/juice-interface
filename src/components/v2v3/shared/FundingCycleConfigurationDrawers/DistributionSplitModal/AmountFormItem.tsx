import { BigNumber } from '@ethersproject/bignumber'
import { t, Trans } from '@lingui/macro'
import { Form, FormInstance } from 'antd'
import CurrencySwitch from 'components/CurrencySwitch'
import CurrencySymbol from 'components/CurrencySymbol'
import { FeeTooltipLabel } from 'components/FeeTooltipLabel'
import InputAccessoryButton from 'components/buttons/InputAccessoryButton'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import TooltipIcon from 'components/TooltipIcon'
import { CurrencyName } from 'constants/currency'
import { parseWad, stripCommas } from 'utils/format/formatNumber'
import { V2V3_CURRENCY_ETH, V2V3_CURRENCY_USD } from 'utils/v2v3/currency'
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

    try {
      return (
        <FeeTooltipLabel
          amountWad={parseWad(stripCommas(amount))}
          currency={
            currencyName === 'ETH' ? V2V3_CURRENCY_ETH : V2V3_CURRENCY_USD
          }
          feePerBillion={fee}
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
      label={t`Payout amount`}
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
                Payouts to other Juicebox projects won't incur fees.
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
                  If you don't raise the sum of your payouts (
                  <CurrencySymbol currency={currencyName} />
                  {distributionLimit}), this address will receive{' '}
                  {form.getFieldValue('percent')}% of all the ETH you raise.
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
