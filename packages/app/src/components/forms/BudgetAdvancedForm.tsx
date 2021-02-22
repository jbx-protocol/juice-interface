import { Form, Input } from 'antd'
import { FormProps } from 'antd/lib/form/Form'
import React, { useState } from 'react'

import { AdvancedBudgetFormFields } from '../../models/forms-fields/advanced-budget-form'

export default function BudgetAdvancedForm({
  props,
  header,
  disabled,
}: {
  props: FormProps<AdvancedBudgetFormFields>
  header?: JSX.Element
  disabled?: boolean
}) {
  const [beneficiaryAddressRequired, setBeneficiaryAddressRequired] = useState<
    boolean
  >(false)

  return (
    <Form
      {...props}
      layout="vertical"
      initialValues={{
        ownerAllocation: 0,
        beneficiaryAllocation: 0,
        discountRate: 97,
        ...props.initialValues,
      }}
    >
      {header ? <Form.Item>{header}</Form.Item> : null}

      <Form.Item
        extra="The percentage of distributed tickets that will become mintable for yourself once the budgeting period ends."
        name="ownerAllocation"
        label="Reserved tickets"
      >
        <Input
          className="align-end"
          suffix="%"
          type="number"
          disabled={disabled}
        />
      </Form.Item>
      <Form.Item extra="" name="beneficiaryAllocation" label="Donate">
        <Input
          className="align-end"
          suffix="%"
          type="number"
          onChange={e =>
            setBeneficiaryAddressRequired(parseFloat(e.target.value) > 0)
          }
          disabled={disabled}
        />
      </Form.Item>
      <Form.Item
        extra="An address that you wish to give a percentage of your overflow to."
        name="beneficiaryAddress"
        label="Donation address"
        rules={[{ required: beneficiaryAddressRequired }]}
      >
        <Input placeholder="0x01a2b3c..." disabled={disabled} />
      </Form.Item>
      <Form.Item
        extra="The rate (95%-100%) at which payments to future budgeting periods are valued compared to payments to the current one."
        name="discountRate"
        label="Discount rate"
        rules={[{ required: true }]}
      >
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          <Input
            className="align-end"
            suffix="%"
            type="number"
            min={95}
            max={100}
            placeholder="100"
            disabled={disabled}
          />
        </div>
      </Form.Item>
    </Form>
  )
}
