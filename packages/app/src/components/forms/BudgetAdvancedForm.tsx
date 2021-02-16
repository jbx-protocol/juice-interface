import { Form, Input } from 'antd'
import { FormProps } from 'antd/lib/form/Form'
import React, { useState } from 'react'

export default function BudgetAdvancedForm({
  props,
  header,
}: {
  props: FormProps<{
    ownerAllocation: number
    beneficiaryAddress: string
    beneficiaryAllocation: number
    discountRate: number
  }>
  header?: string
}) {
  const [beneficiaryAddressRequired, setBeneficiaryAddressRequired] = useState<
    boolean
  >(false)

  const initialDiscountRate = 97

  return (
    <Form
      {...props}
      layout="vertical"
      initialValues={{
        ownerAllocation: 0,
        beneficiaryAllocation: 0,
        discountRate: initialDiscountRate,
        ...props.initialValues,
      }}
    >
      {header ? (
        <Form.Item>
          <h2>{header}</h2>
        </Form.Item>
      ) : null}

      <Form.Item
        extra="The percentage of distributed tickets that will become mintable for you once the budgeting period ends."
        name="ownerAllocation"
        label="Reserved tickets"
      >
        <Input
          className="align-end"
          suffix="%"
          type="number"
          defaultValue="5"
        />
      </Form.Item>
      <Form.Item extra="" name="beneficiaryAllocation" label="Donate">
        <Input
          className="align-end"
          suffix="%"
          type="number"
          defaultValue="0"
          onChange={e =>
            setBeneficiaryAddressRequired(parseFloat(e.target.value) > 0)
          }
        />
      </Form.Item>
      <Form.Item
        extra="A contract that you wish to give a percentage of your overflow to."
        name="beneficiaryAddress"
        label="Donation address"
        rules={[{ required: beneficiaryAddressRequired }]}
      >
        <Input placeholder="0x01a2b3c..." />
      </Form.Item>
      <Form.Item
        extra="The rate (95%-100%) at which payments to future budgeting periods are valued compared to payments to the current one."
        name="discountRate"
        label="Discount rate"
        rules={[{ required: true }]}
      >
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          <Input
            defaultValue={
              props.initialValues?.discountRate ?? initialDiscountRate
            }
            className="align-end"
            suffix="%"
            type="number"
            min={95}
            max={100}
            placeholder="100"
          />
        </div>
      </Form.Item>
    </Form>
  )
}
