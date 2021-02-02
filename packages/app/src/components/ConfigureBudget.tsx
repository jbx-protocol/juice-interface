import { Contract } from '@ethersproject/contracts'
import { Button, Form, Input, Select, Steps } from 'antd'
import TextArea from 'antd/lib/input/TextArea'
import Web3 from 'web3'

import { ContractName } from '../constants/contract-name'
import { SECONDS_IN_DAY } from '../constants/seconds-in-day'
import { Transactor } from '../models/transactor'
import { useState } from 'react'

export default function ConfigureBudget({
  transactor,
  contracts,
}: {
  transactor?: Transactor
  contracts?: Record<ContractName, Contract>
}) {
  const [form] = Form.useForm<{
    target: number
    duration: number
    title: string
    want: string
    description: string
    link: string
    bias: number
    beneficiaryAddress: string
    beneficiaryAllocation: number
    ownerAllocation: number
  }>()
  const [formStage, setFormStage] = useState<number>(0)

  const fields = form.getFieldsValue()

  const eth = new Web3(Web3.givenProvider).eth

  function onSubmit() {
    if (!transactor || !contracts?.Juicer || !contracts?.Token) return

    const _target = eth.abi.encodeParameter('uint256', fields.target)
    const _duration = eth.abi.encodeParameter(
      'uint256',
      fields.duration * SECONDS_IN_DAY,
    )
    const _want = fields.want
    const _title = fields.title && Web3.utils.utf8ToHex(fields.title)
    const _link = fields.link && Web3.utils.utf8ToHex(fields.link)
    const _bias = eth.abi.encodeParameter('uint256', fields.bias)
    const _ownerAllocation = eth.abi.encodeParameter(
      'uint256',
      fields.ownerAllocation,
    )
    const _beneficiaryAllocation = eth.abi.encodeParameter(
      'uint256',
      fields.beneficiaryAllocation,
    )
    const _beneficiaryAddress = fields.beneficiaryAddress ?? '0'

    console.log('🧃 Calling Controller.configureBudget(...)', {
      _target,
      _duration,
      _want,
      _title,
      _link,
      _bias,
      _ownerAllocation,
      _beneficiaryAllocation,
      _beneficiaryAddress,
    })

    transactor(
      contracts.Juicer.configureBudget(
        _target,
        _duration,
        _want,
        _title,
        _link,
        _bias,
        _ownerAllocation,
        _beneficiaryAllocation,
        _beneficiaryAddress,
      ),
    )
  }

  if (!transactor || !contracts) return null

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  }

  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  }

  return (
    <div>
      <Form layout="vertical" form={form} onFinish={onSubmit}>
        <Form.Item hidden={formStage !== 0}>
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
            name="want"
            label="Reward token"
            rules={[{ required: true }]}
          >
            <Select defaultValue={contracts.Token.address}>
              <Select.Option value={contracts.Token.address}>
                TOKEN
              </Select.Option>
            </Select>
          </Form.Item>
        </Form.Item>

        <Form.Item hidden={formStage !== 1}>
          <h2>Configure your budgets</h2>
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
            name="description"
            label="Description"
          >
            <TextArea placeholder="Getting juice with friends..." />
          </Form.Item>
          <Form.Item
            extra="A link to more in depth information about your Budget."
            name="link"
            label="Link"
          >
            <Input placeholder="https://docs.google.com/my-budget-info" />
          </Form.Item>
        </Form.Item>

        <Form.Item hidden={formStage !== 2}>
          <h2>Advanced tuning</h2>
          <Form.Item
            extra="The percentage of overflow that you’ll keep for yourself instead of returning to your contributors."
            name="ownerAllocation"
            label="Owner surplus"
          >
            <Input defaultValue={0} dir="rtl" suffix="%" placeholder="5" />
          </Form.Item>
          <Form.Item
            extra="A contract that you wish to give part of your overflow to."
            name="beneficiaryAddress"
            label="Beneficiary contract"
          >
            <Input placeholder="0x01a2b3c..." />
          </Form.Item>
          <Form.Item
            extra="The percentage of overflow that you’ll pre-allocate tothe beneficiary contract instead of returning to your contributors."
            name="beneficiaryAllocation"
            label="Beneficiary allocation"
          >
            <Input defaultValue={0} dir="rtl" suffix="%" placeholder="5" />
          </Form.Item>
          <Form.Item
            extra="The rate at which contributions to future budgets are valued compared to contributions to this budget."
            name="bias"
            label="Bias"
          >
            <div style={{ display: 'flex', alignItems: 'baseline' }}>
              <Input
                defaultValue={100}
                dir="rtl"
                suffix="%"
                min={95}
                max={100}
                placeholder="100"
              />
              <span style={{ width: 240, marginLeft: 10 }}>
                (Between 95%-100%)
              </span>
            </div>
          </Form.Item>
        </Form.Item>
      </Form>

      <Steps size="small" current={formStage}>
        <Steps.Step onClick={() => setFormStage(0)} title="Tickets" />
        <Steps.Step onClick={() => setFormStage(1)} title="Budget" />
        <Steps.Step onClick={() => setFormStage(2)} title="Advanced" />
      </Steps>
      <div style={{ textAlign: 'right', marginTop: 20 }}>
        {formStage < 2 ? (
          <Button onClick={() => setFormStage(formStage + 1)}>Next</Button>
        ) : (
          <Button style={{ marginTop: 20 }} htmlType="submit" type="primary">
            Submit
          </Button>
        )}
      </div>
    </div>
  )
}
