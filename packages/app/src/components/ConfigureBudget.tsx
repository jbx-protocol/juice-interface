import { Contract } from '@ethersproject/contracts'
import { Button, Form, Input, Steps } from 'antd'
import { useState } from 'react'
import Web3 from 'web3'

import { ContractName } from '../constants/contract-name'
import { SECONDS_IN_DAY } from '../constants/seconds-in-day'
import { Transactor } from '../models/transactor'
import BudgetAdvancedForm from './forms/BudgetAdvancedForm'
import BudgetForm from './forms/BudgetForm'
import TicketsForm from './forms/TicketsForm'

export default function ConfigureBudget({
  transactor,
  contracts,
}: {
  transactor?: Transactor
  contracts?: Record<ContractName, Contract>
}) {
  const [ticketsForm] = Form.useForm<{
    name: string
    symbol: string
    rewardToken: string
  }>()
  const [budgetForm] = Form.useForm<{
    duration: number
    target: number
    brief: string
    link: string
  }>()
  const [budgetAdvancedForm] = Form.useForm<{
    bias: number
    beneficiaryAddress: string
    beneficiaryAllocation: number
    ownerAllocation: number
  }>()
  const [formStage, setFormStage] = useState<number>(0)

  const eth = new Web3(Web3.givenProvider).eth

  function initTickets() {
    if (!transactor || !contracts) return

    const fields = ticketsForm.getFieldsValue()

    const _name = Web3.utils.utf8ToHex(fields.name)
    const _symbol = Web3.utils.utf8ToHex(fields.name)
    const _rewardToken = contracts.Token.address

    console.log('🧃 Calling Juicer.issueTickets(name, symbol, rewardToken)', {
      _name,
      _symbol,
      _rewardToken,
    })

    return transactor(
      contracts.Juicer.issueTickets(_name, _symbol, _rewardToken),
      () => (window.location.href = '/'),
    )
  }

  async function onSubmit() {
    if (!transactor || !contracts?.Juicer || !contracts?.Token) return

    await initTickets()

    const fields = {
      ...budgetForm.getFieldsValue(),
      ...budgetAdvancedForm.getFieldsValue(),
    }

    const _target = eth.abi.encodeParameter('uint256', fields.target)
    const _duration = eth.abi.encodeParameter(
      'uint256',
      fields.duration * SECONDS_IN_DAY,
    )
    const _want = ticketsForm.getFieldsValue().rewardToken
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

    console.log('🧃 Calling Juicer.configureBudget(...)', {
      _target,
      _duration,
      _want,
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
      <TicketsForm
        tokenOptions={[
          {
            label: 'TOKEN',
            value: contracts.Token.address,
          },
        ]}
        form={ticketsForm}
      ></TicketsForm>

      <BudgetForm form={budgetForm}></BudgetForm>

      <BudgetAdvancedForm form={budgetAdvancedForm}></BudgetAdvancedForm>

      <Steps size="small" current={formStage}>
        <Steps.Step onClick={() => setFormStage(0)} title="Tickets" />
        <Steps.Step onClick={() => setFormStage(1)} title="Budget" />
        <Steps.Step onClick={() => setFormStage(2)} title="Advanced" />
      </Steps>
      <div style={{ textAlign: 'right', marginTop: 20 }}>
        {formStage < 2 ? (
          <Button onClick={() => setFormStage(formStage + 1)}>Next</Button>
        ) : (
          <Button
            style={{ marginTop: 20 }}
            htmlType="submit"
            type="primary"
            onClick={onSubmit}
          >
            Submit
          </Button>
        )}
      </div>
    </div>
  )
}
