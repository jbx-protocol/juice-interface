import { Form, FormProps, Input } from 'antd'
import React from 'react'

export default function TicketsForm({
  props,
  header,
}: {
  props: FormProps<{ name: string; symbol: string }>
  header?: string
}) {
  function capitalizeTicker(value: string) {
    props.form?.setFieldsValue({ symbol: value.toUpperCase() })
  }

  return (
    <Form layout="vertical" {...props}>
      {header ? (
        <Form.Item>
          <h2>{header}</h2>
        </Form.Item>
      ) : null}
      <Form.Item
        extra="The name of your ticket token is used across web3."
        name="name"
        label="Name"
        rules={[{ required: true }]}
      >
        <Input placeholder="Peach's Fruit Stand" />
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
