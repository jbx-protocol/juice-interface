import { Button, Form, FormInstance, Space } from 'antd'
import NumberSlider from 'components/shared/inputs/NumberSlider'
import React from 'react'

export type FundingDetailsFormFields = {
  discountRate: string
  reserved: string
  bondingCurveRate: string
  fee: string
}

export default function FundingDetails({
  form,
  onSave,
}: {
  form: FormInstance<FundingDetailsFormFields>
  onSave: VoidFunction
}) {
  return (
    <Space direction="vertical" size="large">
      <h1>Extra details</h1>

      <Form form={form} layout="vertical">
        <Form.Item
          extra="The rate (95%-100%) at which payments to future budgeting time frames are valued compared to payments to the current one."
          name="discountRate"
          label="Discount rate"
        >
          <NumberSlider
            min={95}
            value={form.getFieldValue('discountRate')}
            suffix="%"
            onChange={(val?: number) =>
              form.setFieldsValue({ discountRate: val?.toString() })
            }
          />
        </Form.Item>
        <Form.Item
          extra="The percentage of your project's overflow that you'd like to reserve for yourself. In practice, you'll just receive some of your own tickets whenever someone pays you."
          name="reserved"
          label="Reserved tickets"
        >
          <NumberSlider
            value={form.getFieldValue('reserved')}
            suffix="%"
            onChange={(val?: number) =>
              form.setFieldsValue({ reserved: val?.toString() })
            }
          />
        </Form.Item>
        <Form.Item name="bondingCurveRate" label="Bonding curve rate">
          <NumberSlider
            min={0}
            max={1000}
            step={1}
            value={form.getFieldValue('bondingCurveRate')}
            onChange={(val?: number) =>
              form.setFieldsValue({ bondingCurveRate: val?.toString() })
            }
          />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button
              htmlType="submit"
              type="primary"
              onClick={async () => {
                await form.validateFields()
                onSave()
              }}
            >
              Save
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Space>
  )
}
