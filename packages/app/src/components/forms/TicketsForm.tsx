import { Form, FormProps, Input } from 'antd'
import React from 'react'

export default function TicketsForm({
  props,
  header,
}: {
  props: FormProps<{ name: string; symbol: string; rewardToken: string }>
  header?: string
}) {
  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 12 },
  }

  return (
    <Form {...props} {...layout}>
      {header ? (
        <Form.Item wrapperCol={{ offset: 6 }}>
          <h2>{header}</h2>
        </Form.Item>
      ) : null}

      <Form.Item
        extra="The name of your ticket token is used across web3."
        name="name"
        label="Name"
        rules={[{ required: true }]}
      >
        <Input placeholder="Ticket" />
      </Form.Item>
      <Form.Item
        extra="The ticker of your ticket token is used across web3."
        name="symbol"
        label="Ticker"
        rules={[{ required: true }]}
      >
        <Input prefix="t" placeholder="MYPROJ" />
      </Form.Item>
      <Form.Item
        extra="The ERC-20 token that your ticket tokens are redeemable for."
        name="rewardToken"
        label="Reward token"
      >
        <Input placeholder="0x6b175474e89094c44da98b954eedeac495271d0f" />
      </Form.Item>
    </Form>
  )
}
