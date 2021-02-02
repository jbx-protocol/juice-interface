import { Contract } from '@ethersproject/contracts'
import { Button, Col, Form, Row, Steps } from 'antd'
import { useState } from 'react'
import Web3 from 'web3'

import { ContractName } from '../constants/contract-name'
import { SECONDS_IN_DAY } from '../constants/seconds-in-day'
import { colors } from '../constants/styles/colors'
import { shadowCard } from '../constants/styles/shadow-card'
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
          props={{ form: ticketsForm }}
        ></TicketsForm>
      ),
      info: [
        'First, create your own token. The Juice protocol will use these like tickets, handing them out to people in exchange for payments towards your Budgets. ',
        'They are redeemable for a share of your Budgets’ surplus over time.',
        "You'll provide a ticker symbol for your Tickets, and the reward token that these Tickets can be redeemed for.",
      ],
    },
    {
      title: 'Budget',
      validate: () => budgetForm.validateFields(),
      content: <BudgetForm props={{ form: budgetForm }}></BudgetForm>,
      info: [
        'Your Budget will begin accepting payments once it’s made. It’ll accept funds up until its duration runs out.',
        'A new Budget will be created automatically once the current one expires to continue collecting funds. It’ll use the same configuration as the previous one if you haven’t since reconfigured it.',
      ],
    },
    {
      title: 'Advanced',
      validate: () => budgetAdvancedForm.validateFields(),
      content: (
        <BudgetAdvancedForm
          props={{ form: budgetAdvancedForm }}
        ></BudgetAdvancedForm>
      ),
      info: [
        'Your budget’s overflow is claimable by anyone who redeems your Tickets. Tickets are handed out to everyone who contributes funds to your projects, but it’s also possible to mint some tokens for yourself and for a beneficiary contract as an incentive to push for more overflow.',
        'These reserved tokens can only be minted by budgets that overflow.',
        "Lastly, the bias variable affects your Budget's monetary policy. It adjusts how you value your Budget contributions over time. For example, if your Bias is set to 97%, then someone who pays $100 towards next month's Budget witll only receive 97% the amount of tickets that someone received when paying $100 towards this months budget. Effectively this gives folks who believe you will be able to increase your overflow an incentive to pay you today, HODL their tickets, and redeem them at a future date.",
      ],
    },
  ]

  return (
    <div>
      <Steps size="small" current={currentStep} style={{ marginBottom: 60 }}>
        {steps.map((step, i) => (
          <Steps.Step
            key={i}
            onClick={() => setCurrentStep(i)}
            title={step.title}
          />
        ))}
      </Steps>

      <Row gutter={80} align="top">
        <Col flex="50%">
          {steps[currentStep].content}

          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              marginTop: 80,
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
        </Col>

        <Col flex="50%" style={{ maxWidth: 360 }}>
          <div
            style={{
              ...shadowCard,
              padding: 20,
              background: colors.hint,
              border: '1px solid black',
            }}
          >
            <h3>WTF</h3>
            {steps[currentStep].info.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </Col>
      </Row>
    </div>
  )
}
