import { Contract } from '@ethersproject/contracts'
import { Button, Col, Divider, Form, Row, Space, Statistic, Steps } from 'antd'
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
  const [initializedTickets, setInitializedTickets] = useState<boolean>(false)

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
    ).then(() => setInitializedTickets(true))
  }

  async function tryNextStep() {
    const valid = await steps[currentStep].validate()
    if (valid) setCurrentStep(currentStep + 1)
  }

  function submitBudget() {
    if (!transactor || !contracts?.Juicer || !contracts?.Token) return

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
        _want,
        _brief,
        _link,
        _bias,
        _ownerAllocation,
        _beneficiaryAllocation,
        _beneficiaryAddress,
      ),
    )
  }

  const tokenOptions = [
    {
      label: 'TOKEN',
      value: contracts.Token.address,
    },
  ]

  const steps = [
    {
      title: 'Tickets',
      validate: () => ticketsForm.validateFields(),
      content: initializedTickets ? (
        'Tickets already initialized'
      ) : (
        <TicketsForm
          tokenOptions={tokenOptions}
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
    {
      title: 'Review',
      validate: () => budgetAdvancedForm.validateFields(),
      content: (
        <div>
          <div>
            <h1>Tickets</h1>
            <div style={{ marginTop: 20, marginBottom: 20 }}>
              <Space size="large">
                <Statistic
                  title="Name"
                  value={ticketsForm.getFieldValue('name')}
                ></Statistic>
                <Statistic
                  title="Symbol"
                  value={ticketsForm.getFieldValue('symbol')}
                ></Statistic>
                <Statistic
                  title="Token"
                  value={
                    tokenOptions.find(
                      opt =>
                        opt.value === ticketsForm.getFieldValue('rewardToken'),
                    )?.label
                  }
                ></Statistic>
              </Space>
            </div>
            <Button
              disabled={initializedTickets}
              htmlType="submit"
              type="primary"
              onClick={initTickets}
            >
              Init tickets
            </Button>
          </div>

          <Divider orientation="center"></Divider>

          <div>
            <Space size="large" direction="vertical">
              <h1>Budget</h1>
              <div>
                <Space size="large">
                  <Statistic
                    title="Duration"
                    value={budgetForm.getFieldValue('duration')}
                    suffix="days"
                  ></Statistic>
                  <Statistic
                    title="Amount"
                    value={budgetForm.getFieldValue('target')}
                    suffix="DAI"
                  ></Statistic>
                  <Statistic
                    title="Link"
                    value={budgetForm.getFieldValue('link')}
                  ></Statistic>
                </Space>
              </div>
              <div>
                <Statistic
                  title="Description"
                  value={budgetForm.getFieldValue('brief')}
                ></Statistic>
              </div>
              <Space size="large" align="end">
                <Statistic
                  style={{ minWidth: 100 }}
                  title="Bias"
                  value={budgetForm.getFieldValue('bias')}
                  suffix="%"
                ></Statistic>
                <Statistic
                  title="Beneficiary address"
                  value={budgetForm.getFieldValue('beneficiaryAddress')}
                ></Statistic>
                <Statistic
                  title="Beneficiary surplus"
                  value={budgetForm.getFieldValue('beneficiaryAllocation')}
                  suffix="%"
                ></Statistic>
                <Statistic
                  title="Beneficiary owner"
                  value={budgetForm.getFieldValue('ownerAllocation')}
                  suffix="%"
                ></Statistic>
              </Space>
              <Button
                disabled={!initializedTickets}
                htmlType="submit"
                type="primary"
                onClick={submitBudget}
              >
                Create budget
              </Button>
            </Space>
          </div>
        </div>
      ),
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
                Back
              </Button>
            )}

            {currentStep === steps.length - 1 ? (
              <div></div>
            ) : (
              <Button onClick={() => tryNextStep()}>Next</Button>
            )}
          </div>
        </Col>

        {steps[currentStep].info ? (
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
              {steps[currentStep].info?.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </Col>
        ) : null}
      </Row>
    </div>
  )
}
