import { t, Trans } from '@lingui/macro'
import { Form, FormInstance } from 'antd'
import CurrencySwitch from 'components/CurrencySwitch'
import CurrencySymbol from 'components/CurrencySymbol'
import InputAccessoryButton from 'components/InputAccessoryButton'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import TooltipIcon from 'components/TooltipIcon'
import TooltipLabel from 'components/TooltipLabel'
import { CurrencyName } from 'constants/currency'
import { ThemeContext } from 'contexts/themeContext'
import { round } from 'lodash'
import { useContext } from 'react'
import { AddOrEditSplitFormFields, SplitType } from './types'
import { percentageValidator } from './util'

export function AmountFormItem({
  form,
  distributionLimit,
  feePercentage,
  editingSplitType,
  currencyName,
  isFirstSplit,
  onCurrencyChange,
}: {
  form: FormInstance<AddOrEditSplitFormFields>
  distributionLimit?: string
  feePercentage: string | undefined
  editingSplitType: SplitType
  currencyName: CurrencyName
  isFirstSplit: boolean
  onCurrencyChange?: (currencyName: CurrencyName) => void
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const amount = Form.useWatch('amount', form)

  const amountSubFee = amount
    ? parseFloat(amount) -
      (parseFloat(amount) * parseFloat(feePercentage ?? '0')) / 100
    : undefined

  function AfterFeeMessage() {
    return amountSubFee && amountSubFee > 0 ? (
      <TooltipLabel
        label={
          <Trans>
            <CurrencySymbol currency={currencyName} />
            {round(amountSubFee, 4)} after {feePercentage}% JBX membership fee
          </Trans>
        }
        tip={
          <Trans>
            Payouts to Ethereum addresses incur a {feePercentage}% fee. Your
            project will receive JBX in return at the current issuance rate.
          </Trans>
        }
      />
    ) : null
  }

  return (
    <Form.Item
      className="ant-form-item-extra-only"
      label={t`Distribution`}
      required
      extra={
        feePercentage && form.getFieldValue('percent') <= 100 ? (
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
      <div
        style={{
          display: 'flex',
          color: colors.text.primary,
          alignItems: 'center',
        }}
      >
        <Form.Item
          noStyle
          name="amount"
          required
          rules={[
            {
              validator: percentageValidator,
              validateTrigger: 'onCreate',
              required: true,
            },
          ]}
        >
          <span style={{ flex: 1 }}>
            <FormattedNumberInput
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
          </span>
        </Form.Item>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginLeft: 10,
          }}
        >
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
            iconStyle={{ marginLeft: 5 }}
          />
        </div>
      </div>
    </Form.Item>
  )
}
