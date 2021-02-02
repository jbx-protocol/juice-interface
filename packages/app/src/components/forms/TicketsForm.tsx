import { Form, FormProps, Input, Select } from 'antd'
import React from 'react'

export default function TicketsForm({
  tokenOptions,
  props,
}: {
  tokenOptions: { label: string; value: string }[]
  props: FormProps<{ name: string; symbol: string; rewardToken: string }>
}) {
  return (
    <Form {...props}>
      <h2>Create your ticket tokens</h2>

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
        <Input placeholder="tMYPROJ" />
      </Form.Item>
      <Form.Item
        extra="The ERC-20 token that your ticket tokens are redeemable for."
        name="rewardToken"
        label="Reward token"
        initialValue={tokenOptions[0].value}
      >
        <Select>
          {tokenOptions.map(opt => (
            <Select.Option value={opt.value}>
              {opt.label}{' '}
              <span style={{ fontSize: '.7rem', opacity: 0.5 }}>
                {opt.value}
              </span>{' '}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    </Form>
  )
}
