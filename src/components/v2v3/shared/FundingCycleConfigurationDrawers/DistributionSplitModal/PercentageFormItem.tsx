import { Trans } from '@lingui/macro'
import { Form, FormInstance } from 'antd'
import CurrencySymbol from 'components/CurrencySymbol'
import NumberSlider from 'components/inputs/NumberSlider'
import TooltipIcon from 'components/TooltipIcon'
import { CurrencyName } from 'constants/currency'
import { amountFromPercent } from 'utils/v2v3/distributions'
import { AddOrEditSplitFormFields } from './types'
import { percentageValidator } from './utils'

export function PercentageFormItem({
  form,
  distributionLimit,
  distributionType,
  currencyName,
}: {
  form: FormInstance<AddOrEditSplitFormFields>
  distributionType: 'amount' | 'percent' | 'both'
  distributionLimit?: string
  currencyName: CurrencyName
}) {
  return (
    <Form.Item>
      <div className="flex items-center">
        <div className="flex-1">
          <NumberSlider
            onChange={(percentage: number | undefined) => {
              const newAmount = amountFromPercent({
                percent: percentage ?? 0,
                amount: distributionLimit ?? '0',
              })

              form.setFieldsValue({ amount: newAmount.toString() })
              form.setFieldsValue({ percent: percentage })
            }}
            step={0.01}
            defaultValue={0}
            sliderValue={form.getFieldValue('percent') ?? 0}
            suffix="%"
            name="percent"
            formItemProps={{
              rules: [{ validator: percentageValidator }],
            }}
          />
        </div>
        {distributionType === 'both' ? (
          <TooltipIcon
            tip={
              <Trans>
                If you don't raise the sum of your payouts (
                <CurrencySymbol currency={currencyName} />
                {distributionLimit}), this address will receive{' '}
                {form.getFieldValue('percent')}% of the ETH you raise.
              </Trans>
            }
            placement={'topLeft'}
            iconClassName={'ml-3 mb-4'}
          />
        ) : null}
      </div>
    </Form.Item>
  )
}
