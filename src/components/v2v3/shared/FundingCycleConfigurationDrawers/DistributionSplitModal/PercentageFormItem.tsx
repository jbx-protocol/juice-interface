import { Form, FormInstance } from 'antd'
import NumberSlider from 'components/inputs/NumberSlider'
import { amountFromPercent } from 'utils/v2v3/distributions'
import { AddOrEditSplitFormFields } from './types'
import { percentageValidator } from './utils'

export function PercentageFormItem({
  form,
  distributionLimit,
}: {
  form: FormInstance<AddOrEditSplitFormFields>
  distributionLimit?: string
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
      </div>
    </Form.Item>
  )
}
