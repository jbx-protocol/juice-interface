import { Form, FormProps, Input } from 'antd'
import React from 'react'

import { TicketsFormFields } from '../../models/forms-fields/tickets-form'

export default function TicketsForm({
  props,
  header,
  disabled,
}: {
  props: FormProps<TicketsFormFields>
  header?: JSX.Element
  disabled?: boolean
}) {
  function capitalizeTicker(value: string) {
    props.form?.setFieldsValue({ symbol: value.toUpperCase() })
  }

  return (
    <Form layout="vertical" {...props}>
      {header ? <Form.Item>{header}</Form.Item> : null}
      <Form.Item
        extra="The name of your ticket token is used across web3."
        name="name"
        label="Name"
        rules={[{ required: true }]}
      >
        <Input
          suffix="Juice ticket"
          placeholder="Peach's"
          disabled={disabled}
        />
      </Form.Item>
      <Form.Item
        extra="The ticker of your ticket token is used across web3."
        name="symbol"
        label="Ticker"
        rules={[{ required: true }]}
      >
        <Input
          placeholder="PEACH"
          prefix="j"
          onChange={e => capitalizeTicker(e.target.value)}
          disabled={disabled}
        />
      </Form.Item>
    </Form>
  )
}
