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
  const [currentStep, setCurrentStep] = useState<number>(0)

  if (!transactor || !contracts) return null

  const eth = new Web3(Web3.givenProvider).eth

  function initTickets() {
    if (!transactor || !contracts) return

    const fields = ticketsForm.getFieldsValue(true)

    const _name = Web3.utils.utf8ToHex(fields.name)
    const _symbol = Web3.utils.utf8ToHex(fields.symbol)
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

  async function tryNextStep() {
    const valid = await steps[currentStep].validate()
    if (valid) setCurrentStep(currentStep + 1)
  }

  async function onSubmit() {
    if (!transactor || !contracts?.Juicer || !contracts?.Token) return

    await initTickets()

    const fields = {
      ...budgetForm.getFieldsValue(true),
      ...budgetAdvancedForm.getFieldsValue(true),
    }

    console.log('fields', fields)

    const _target = eth.abi.encodeParameter('uint256', fields.target)
    const _duration = eth.abi.encodeParameter(
      'uint256',
      fields.duration * SECONDS_IN_DAY,
    )
    const _want = ticketsForm.getFieldsValue(true).rewardToken
    const _link = fields.link
    const _brief = fields.brief
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
        _brief,
        _want,
        _link,
        _bias,
        _ownerAllocation,
        _beneficiaryAllocation,
        _beneficiaryAddress,
      ),
    )
  }

  const steps = [
    {
      title: 'Tickets',
      validate: () => ticketsForm.validateFields(),
      content: (
        <TicketsForm
          tokenOptions={[
            {
              label: 'TOKEN',
              value: contracts.Token.address,
            },
          ]}
          props={{
            form: ticketsForm,
            layout: 'vertical',
          }}
        ></TicketsForm>
      ),
    },
    {
      title: 'Budget',
      validate: () => budgetForm.validateFields(),
      content: (
        <BudgetForm
          props={{
            form: budgetForm,
            layout: 'vertical',
          }}
        ></BudgetForm>
      ),
    },
    {
      title: 'Advanced',
      validate: () => budgetAdvancedForm.validateFields(),
      content: (
        <BudgetAdvancedForm
          props={{
            form: budgetAdvancedForm,
            layout: 'vertical',
          }}
        ></BudgetAdvancedForm>
      ),
    },
  ]

  return (
    <div>
      <Steps size="small" current={currentStep}>
        {steps.map((step, i) => (
          <Steps.Step
            key={i}
            onClick={() => setCurrentStep(i)}
            title={step.title}
          />
        ))}
      </Steps>

      <div
        style={{
          marginTop: 40,
          marginBottom: 40,
        }}
      >
        {steps[currentStep].content}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
        }}
      >
        {currentStep === 0 ? (
          <div></div>
        ) : (
          <Button onClick={() => setCurrentStep(currentStep - 1)}>
            Previous
          </Button>
        )}

        {currentStep === steps.length - 1 ? (
          <Button htmlType="submit" type="primary" onClick={onSubmit}>
            Submit
          </Button>
        ) : (
          <Button onClick={() => tryNextStep()}>Next</Button>
        )}
      </div>
    </div>
  )
}
