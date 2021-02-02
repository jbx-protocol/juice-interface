import React, { useState } from 'react'
import Web3 from 'web3'

import { Contracts } from '../models/contracts'
import { Transactor } from '../models/transactor'
import { padding } from '../constants/styles/padding'
import { Button, Form, Input } from 'antd'

export default function InitTickets({
  transactor,
  contracts,
}: {
  transactor?: Transactor
  contracts?: Contracts
}) {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState<boolean>()

  function init() {
    if (!transactor || !contracts) return

    setLoading(true)

    const _name = Web3.utils.utf8ToHex(form.getFieldValue('name'))
    const _symbol = Web3.utils.utf8ToHex(form.getFieldValue('symbol'))
    const _rewardToken = contracts.Token.address

    console.log('🧃 Calling Juicer.issueTickets(name, symbol, rewardToken)', {
      _name,
      _symbol,
      _rewardToken,
    })

    transactor(
      contracts.Juicer.issueTickets(_name, _symbol, _rewardToken),
      () => (window.location.href = '/'),
    ).then(() => setLoading(false))
  }

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  }

  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  }

  return (
    <div
      style={{
        padding: padding.app,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Form
        {...layout}
        form={form}
        name="init-tickets"
        style={{ width: 400 }}
        onFinish={init}
      >
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input placeholder="Ticket" />
        </Form.Item>
        <Form.Item name="symbol" label="Symbol" rules={[{ required: true }]}>
          <Input placeholder="TIX" />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit" loading={loading}>
            Initialize tickets
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
