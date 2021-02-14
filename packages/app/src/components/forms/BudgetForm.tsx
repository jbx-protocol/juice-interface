import { Form, FormProps, Input } from 'antd'
import React from 'react'

export default function BudgetForm({
  props,
  header,
}: {
  props: FormProps<{
    duration: number
    target: number
    link: string
  }>
  header?: string
}) {
  return (
    <Form layout="vertical" {...props}>
      {header ? (
        <Form.Item>
          <h2>{header}</h2>
        </Form.Item>
      ) : null}

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
          suffix="DAI"
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
        extra="A link to your mission statement and budget specs."
        name="link"
        label="Link"
      >
        <Input placeholder="https://docs.google.com/my-budget-info" />
      </Form.Item>
    </Form>
  )
}
