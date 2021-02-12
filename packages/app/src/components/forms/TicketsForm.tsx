import { Form, FormProps, Input, Select } from 'antd'
import React from 'react'

import { LabelVal } from '../../models/label-val'

export default function TicketsForm({
  props,
  header,
  tokenOptions,
}: {
  props: FormProps<{ name: string; symbol: string; rewardToken: string }>
  header?: string
  tokenOptions?: LabelVal<string>[]
}) {
  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 12 },
  }

  return tokenOptions?.length ? (
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
        <Input placeholder="Peach's Fruit Stand" />
      </Form.Item>
      <Form.Item
        extra="The ticker of your ticket token is used across web3."
        name="symbol"
        label="Ticker"
        rules={[{ required: true }]}
      >
        <Input prefix="t" placeholder="PEACH" />
      </Form.Item>
      <Form.Item
        extra="The ERC-20 token that your ticket tokens are redeemable for."
        name="rewardToken"
        label="Reward token"
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
    </Form>
  ) : null
}
