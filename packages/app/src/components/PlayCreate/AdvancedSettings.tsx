import { Button, Form, FormInstance, Input, Space } from 'antd'
import NumberSlider from 'components/shared/inputs/NumberSlider'
import React, { useState } from 'react'

export type AdvancedSettingsFormFields = {
  discountRate: string
  donationRecipient: string
  donationAmount: string
  reserved: string
}

export default function AdvancedSettings({
  form,
  onSave,
  onSkip,
}: {
  form: FormInstance<AdvancedSettingsFormFields>
  onSave: VoidFunction
  onSkip: VoidFunction
}) {
  const [donationRecipientRequired, setDonationRecipientRequired] = useState<
    boolean
  >(false)

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
          initialValue={5}
        >
          <NumberSlider
            value={form.getFieldValue('reserved')}
            suffix="%"
            onChange={(val?: number) =>
              form.setFieldsValue({ reserved: val?.toString() })
            }
          />
        </Form.Item>
        <Form.Item
          extra="An address that you wish to give a percentage of your overflow to."
          name="donationRecipient"
          label="Donation address"
          rules={[{ required: donationRecipientRequired }]}
        >
          <Input placeholder="0x01a2b3c..." autoComplete="off" />
        </Form.Item>
        <Form.Item
          extra=""
          name="donationAmount"
          label="Donation amount"
          initialValue={0}
        >
          <NumberSlider
            value={form.getFieldValue('donation')}
            suffix="%"
            onChange={(val?: number) => {
              form.setFieldsValue({ donationAmount: val?.toString() })
              setDonationRecipientRequired(!!val)
            }}
          />
        </Form.Item>
      </Form>

      <Space>
        <Button type="primary" onClick={onSave}>
          Save
        </Button>
        <Button onClick={onSkip}>Skip</Button>
      </Space>
    </Space>
  )
}
