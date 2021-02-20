import { Form, FormProps, Input } from 'antd'
import React from 'react'

import { TicketsFormFields } from '../../models/forms-fields/tickets-form'

export default function TicketsForm({
  props,
  header,
}: {
  props: FormProps<TicketsFormFields>
  header?: string
}) {
  function capitalizeTicker(value: string) {
    props.form?.setFieldsValue({ symbol: value.toUpperCase() })
  }

  return (
    <Form layout="vertical" {...props}>
      <Form.Item>
        {header ? <h2>{header}</h2> : null}
        <p>
          You can always do this later. Your contract will use I-Owe-You tickets
          in the meantime.
        </p>
      </Form.Item>
      <Form.Item
        extra="The name of your ticket token is used across web3."
        name="name"
        label="Name"
        rules={[{ required: true }]}
      >
        <Input suffix="Juice ticket" placeholder="Peach's" />
      </Form.Item>
      <Form.Item
        extra="The ticker of your ticket token is used across web3."
        name="symbol"
        label="Ticker"
        rules={[{ required: true }]}
      >
        <Input
          prefix="t"
          placeholder="PEACH"
          onChange={e => capitalizeTicker(e.target.value)}
        />
      </Form.Item>
    </Form>
  )
}
