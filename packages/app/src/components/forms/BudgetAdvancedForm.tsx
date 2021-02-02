import { FormInstance, Form, Input } from 'antd'
import React from 'react'

export default function BudgetAdvancedForm({
  form,
}: {
  form: FormInstance<{
    ownerAllocation: number
    beneficiaryAddress: string
    beneficiaryAllocation: number
    bias: number
  }>
}) {
  return (
    <Form>
      <h2>Advanced tuning</h2>
      <Form.Item
        extra="The percentage of overflow that you’ll keep for yourself instead of returning to your contributors."
        name="ownerAllocation"
        label="Owner surplus"
      >
        <Input defaultValue={0} dir="rtl" suffix="%" placeholder="5" />
      </Form.Item>
      <Form.Item
        extra="A contract that you wish to give part of your overflow to."
        name="beneficiaryAddress"
        label="Beneficiary contract"
      >
        <Input placeholder="0x01a2b3c..." />
      </Form.Item>
      <Form.Item
        extra="The percentage of overflow that you’ll pre-allocate tothe beneficiary contract instead of returning to your contributors."
        name="beneficiaryAllocation"
        label="Beneficiary allocation"
      >
        <Input defaultValue={0} dir="rtl" suffix="%" placeholder="5" />
      </Form.Item>
      <Form.Item
        extra="The rate at which contributions to future budgets are valued compared to contributions to this budget."
        name="bias"
        label="Bias"
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
          <span style={{ width: 240, marginLeft: 10 }}>(Between 95%-100%)</span>
        </div>
      </Form.Item>
    </Form>
  )
}
