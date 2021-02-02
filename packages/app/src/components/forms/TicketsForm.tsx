import { Form, FormInstance, Input, Select } from 'antd'
import React from 'react'

import { Contracts } from '../../models/contracts'

export default function TicketsForm({
  tokenOptions,
  form,
}: {
  tokenOptions: { label: string; value: string }[]
  form: FormInstance<{ name: string; symbol: string; rewardToken: string }>
}) {
  return (
    <Form layout="vertical">
      <h2>Create your ticket tokens</h2>

      <Form.Item
        extra="The name of your ticket token is used across web3."
        name="project-name"
        label="Project Name"
        rules={[{ required: true }]}
      >
        <Input placeholder="Ticket" />
      </Form.Item>
      <Form.Item
        extra="The ticker of your ticket token is used across web3."
        name="name"
        label="Name"
        rules={[{ required: true }]}
      >
        <Input placeholder="tMYPROJ" />
      </Form.Item>
      <Form.Item
        extra="The ERC-20 token that your ticket tokens are redeemable for."
        name="rewardToken"
        label="Reward token"
        rules={[{ required: true }]}
      >
        <Select defaultValue={tokenOptions}>
          {tokenOptions?.map(opt => (
            <Select.Option value={opt.value}>{opt.label}</Select.Option>
          ))}
        </Select>
      </Form.Item>
    </Form>
  )
}
