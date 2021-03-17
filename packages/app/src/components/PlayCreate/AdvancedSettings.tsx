import { Button, Form, FormInstance, Input, Space } from 'antd'
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
  const [donationRecipientRequired, setBeneficiaryAddressRequired] = useState<
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
          rules={[{ required: true }]}
          initialValue={97}
        >
          <Input
            className="align-end"
            suffix="%"
            type="number"
            min={95}
            max={100}
            placeholder="97"
            autoComplete="off"
          />
        </Form.Item>
        <Form.Item
          extra="For every ticket given to someone who pays you, this percentage of tickets will be reserved for yourself."
          name="reserved"
          label="Reserved tickets"
          initialValue={5}
        >
          <Input
            className="align-end"
            suffix="%"
            type="number"
            autoComplete="off"
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
          name="donation"
          label="Donation amount"
          initialValue={0}
        >
          <Input
            className="align-end"
            suffix="%"
            type="number"
            onChange={e =>
              setBeneficiaryAddressRequired(parseFloat(e.target.value) > 0)
            }
            autoComplete="off"
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
