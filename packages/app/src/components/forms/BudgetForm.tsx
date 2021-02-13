import { Form, FormProps, Input, Select } from 'antd'
import React from 'react'

import { LabelVal } from '../../models/label-val'

export default function BudgetForm({
  props,
  header,
  tokenOptions,
}: {
  props: FormProps<{
    duration: number
    target: number
    want: string
    link: string
  }>
  header?: string
  tokenOptions?: LabelVal<string>[]
}) {
  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 12 },
  }

  const tokenSymbol = tokenOptions?.find(
    opt => opt.value === props.form?.getFieldValue('want'),
  )?.label

  return (
    <Form {...layout} {...props}>
      {header ? (
        <Form.Item wrapperCol={{ offset: 6 }}>
          <h2>{header}</h2>
        </Form.Item>
      ) : null}

      <Form.Item
        extra="The ERC-20 token that your budget will receive payments in."
        name="want"
        label="Payment token"
      >
        <Select>
          {tokenOptions?.map((opt, i) => (
            <Select.Option key={i} value={opt.value}>
              {opt.label}
              <span
                style={{
                  fontSize: '.7rem',
                  marginLeft: 6,
                }}
              >
                {opt.value}
              </span>
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        extra="The amount of money you want/need in order to absolutely crush your mission statement."
        name="target"
        label="Amount"
        rules={[{ required: true }]}
      >
        <Input
          className="align-end"
          placeholder="0"
          type="number"
          suffix={tokenSymbol}
        />
      </Form.Item>
      <Form.Item
        extra="The length of this budgeting period."
        name="duration"
        label="Time frame"
        rules={[{ required: true }]}
      >
        <Input
          className="align-end"
          placeholder="30"
          type="number"
          suffix="days"
        />
      </Form.Item>
      <Form.Item
        extra="A link to your mission statement and Budget specs."
        name="link"
        label="Link"
      >
        <Input placeholder="https://docs.google.com/my-budget-info" />
      </Form.Item>
    </Form>
  )
}
