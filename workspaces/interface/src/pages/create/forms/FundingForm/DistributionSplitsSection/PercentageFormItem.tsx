import { Form, FormInstance } from 'antd'
import NumberSlider from 'components/inputs/NumberSlider'
import { AddOrEditSplitFormFields } from './types'
import { percentageValidator } from './util'

export function PercentageFormItem({
  form,
}: {
  form: FormInstance<AddOrEditSplitFormFields>
}) {
  return (
    <Form.Item>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div style={{ flex: 1 }}>
          <NumberSlider
            onChange={(percentage: number | undefined) => {
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
