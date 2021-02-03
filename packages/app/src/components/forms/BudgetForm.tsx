import { Form, Input } from 'antd'
import { FormProps } from 'antd/lib/form/Form'
import React from 'react'

export default function BudgetForm({
  props,
  header,
}: {
  props: FormProps<{
    duration: number
    target: number
    brief: string
    link: string
  }>
  header?: string
}) {
  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 12 },
  }

  return (
    <Form {...layout} {...props}>
      {header ? (
        <Form.Item wrapperCol={{ offset: 6 }}>
          <h2>{header}</h2>
        </Form.Item>
      ) : null}

      <Form.Item
        extra="The duration of your budgets."
        name="duration"
        label="Duration"
        rules={[{ required: true }]}
      >
        <Input placeholder="30" dir="rtl" suffix="days" />
      </Form.Item>
      <Form.Item
        extra="The amout your project needs for each Budget period."
        name="target"
        label="Amount"
        rules={[{ required: true }]}
      >
        <Input placeholder="0" dir="rtl" suffix="DAI" />
      </Form.Item>
      <Form.Item
        extra="A brief description of what your Budgets are used for."
        name="brief"
        label="Description"
      >
        <Input.TextArea placeholder="Getting juice with friends..." />
      </Form.Item>
      <Form.Item
        extra="A link to more in depth information about your Budget."
        name="link"
        label="Link"
      >
        <Input placeholder="https://docs.google.com/my-budget-info" />
      </Form.Item>
    </Form>
  )
}
