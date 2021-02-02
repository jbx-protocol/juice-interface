import { Form, Input } from 'antd'
import { FormProps } from 'antd/lib/form/Form'
import React from 'react'

export default function BudgetAdvancedForm({
  props,
}: {
  props: FormProps<{
    ownerAllocation: number
    beneficiaryAddress: string
    beneficiaryAllocation: number
    bias: number
  }>
}) {
  const layout = {
    labelCol: { span: 10 },
    wrapperCol: { span: 12 },
  }

  return (
    <Form {...props} {...layout}>
      <Form.Item wrapperCol={{ offset: 10 }}>
        <h2>Advanced tuning</h2>
      </Form.Item>

      <Form.Item
        extra="The percentage of overflow that you’ll keep for yourself instead of returning to your contributors."
        name="ownerAllocation"
        label="Owner surplus"
        initialValue={0}
      >
        <Input dir="rtl" suffix="%" placeholder="5" />
      </Form.Item>
      <Form.Item
        extra="A contract that you wish to give part of your overflow to."
        name="beneficiaryAddress"
        label="Beneficiary contract"
      >
        <Input placeholder="0x01a2b3c..." />
      </Form.Item>
      <Form.Item
        extra="The percentage of overflow that you’ll pre-allocate to the beneficiary contract instead of returning to your contributors."
        name="beneficiaryAllocation"
        label="Beneficiary allocation"
        initialValue={0}
      >
        <Input dir="rtl" suffix="%" placeholder="5" />
      </Form.Item>
      <Form.Item
        extra="The rate (95-100) at which contributions to future budgets are valued compared to contributions to this budget."
        name="bias"
        label="Bias"
        initialValue={100}
      >
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          <Input
            defaultValue={100}
            dir="rtl"
            suffix="%"
            min={95}
            max={100}
            placeholder="100"
          />
        </div>
      </Form.Item>
    </Form>
  )
}
