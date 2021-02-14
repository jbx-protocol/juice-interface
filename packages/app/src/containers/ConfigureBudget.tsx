import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { JsonRpcProvider } from '@ethersproject/providers'
import { Button, Col, Divider, Form, Row, Space, Statistic, Steps } from 'antd'
import { useState } from 'react'
import Web3 from 'web3'

import BudgetAdvancedForm from '../components/forms/BudgetAdvancedForm'
import BudgetForm from '../components/forms/BudgetForm'
import TicketsForm from '../components/forms/TicketsForm'
import Loading from '../components/Loading'
import { ContractName } from '../constants/contract-name'
import { SECONDS_IN_DAY } from '../constants/seconds-in-day'
import { colors } from '../constants/styles/colors'
import { padding } from '../constants/styles/padding'
import { shadowCard } from '../constants/styles/shadow-card'
import useContractReader from '../hooks/ContractReader'
import { Transactor } from '../models/transactor'
import { erc20Contract } from '../utils/erc20Contract'
import { orEmpty } from '../utils/orEmpty'
import { isEmptyAddress } from '../utils/isEmptyAddress'

export default function ConfigureBudget({
  transactor,
  contracts,
  owner,
  provider,
}: {
  transactor?: Transactor
  contracts?: Record<ContractName, Contract>
  owner?: string
  provider?: JsonRpcProvider
}) {
  const [ticketsForm] = Form.useForm<{
    name: string
    symbol: string
  }>()
  const [budgetForm] = Form.useForm<{
    duration: number
    target: number
    link: string
  }>()
  const [budgetAdvancedForm] = Form.useForm<{
    discountRate: number
    beneficiaryAddress: string
    beneficiaryAllocation: number
    ownerAllocation: number
  }>()
  const [loadingInitTickets, setLoadingInitTickets] = useState<boolean>(false)
  const [loadingCreateBudget, setLoadingCreateBudget] = useState<boolean>(false)
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [initializedTickets, setInitializedTickets] = useState<boolean>()

  const ticketsAddress = useContractReader<string>({
    contract: contracts?.TicketStore,
    functionName: 'tickets',
    args: [owner],
    callback: address => {
      if (!owner || !address || initializedTickets !== undefined) return
      setInitializedTickets(!isEmptyAddress(address))
    },
  })

  const ticketsSymbol = useContractReader<string>({
    contract: erc20Contract(ticketsAddress, provider),
    functionName: 'symbol',
    formatter: (value?: string) =>
      value ? Web3.utils.hexToString(value) : undefined,
  })

  const ticketsName = useContractReader<string>({
    contract: erc20Contract(ticketsAddress, provider),
    functionName: 'name',
    formatter: (value?: string) =>
      value ? Web3.utils.hexToString(value) : undefined,
  })

  if (!transactor || !contracts || initializedTickets === undefined)
    return <Loading />

  async function tryNextStep() {
    const valid = await steps[currentStep].validate()
    if (valid) setCurrentStep(currentStep + 1)
  }

  function initTickets() {
    if (!transactor || !contracts) return

    setLoadingInitTickets(true)

    const fields = ticketsForm.getFieldsValue(true)

    const _name = Web3.utils.utf8ToHex(fields.name)
    const _symbol = Web3.utils.utf8ToHex('t' + fields.symbol)

    console.log('🧃 Calling Juicer.issueTickets(name, symbol)', {
      _name,
      _symbol,
    })

    return transactor(contracts.Juicer.issueTickets(_name, _symbol), () => {
      setLoadingInitTickets(false)
      setInitializedTickets(true)
    })
  }

  function submitBudget() {
    if (!transactor || !contracts?.Juicer || !contracts?.Token) return

    setLoadingCreateBudget(true)

    const fields = {
      ...budgetForm.getFieldsValue(true),
      ...budgetAdvancedForm.getFieldsValue(true),
    }

    const _target = BigNumber.from(fields.target).toHexString()
    const _duration = BigNumber.from(
      fields.duration *
        (process.env.NODE_ENV === 'development' ? 1 : SECONDS_IN_DAY),
    ).toHexString()
    const _link = fields.link
    const _discountRate = BigNumber.from(fields.discountRate).toHexString()
    const _ownerAllocation = fields.ownerAllocation
      ? BigNumber.from(fields.ownerAllocation).toHexString()
      : 0
    const _beneficiaryAllocation = fields.beneficiaryAllocation
      ? BigNumber.from(fields.beneficiaryAllocation).toHexString()
      : 0
    const _beneficiaryAddress =
      fields.beneficiaryAddress?.trim().length ??
      '0x0000000000000000000000000000000000000000'

    console.log('🧃 Calling Juicer.configureBudget(...)', {
      _target,
      _duration,
      _link,
      _discountRate,
      _ownerAllocation,
      _beneficiaryAllocation,
      _beneficiaryAddress,
    })

    transactor(
      contracts.Juicer.configureBudget(
        _target,
        _duration,
        _link,
        _discountRate,
        _ownerAllocation,
        _beneficiaryAllocation,
        _beneficiaryAddress,
      ),
      () => {
        setLoadingCreateBudget(false)
        if (owner) window.location.hash = owner
      },
    )
  }

  const steps = [
    {
      title: 'Budget',
      validate: () => budgetForm.validateFields(),
      content: (
        <BudgetForm
          props={{ form: budgetForm }}
          header="Configure your budget"
        />
      ),
      info: [
        'Your budget begins accepting payments right away. It’ll accept funds up until its time frame runs out.',
        'A new budget will be created automatically once the current one expires to continue collecting money. It’ll use the same configuration as the previous one if you haven’t since passed a vote to reconfigured it – more on this later.',
      ],
    },
    {
      title: 'Tickets',
      validate: () => ticketsForm.validateFields(),
      content: initializedTickets ? (
        <div>
          <h2>Tickets already initialized.</h2>
          <Space direction="vertical" size="large">
            <Statistic
              title="Name"
              value={
                initializedTickets
                  ? ticketsName
                  : ticketsForm.getFieldValue('name')
              }
            />
            <Statistic
              title="Symbol"
              value={
                initializedTickets
                  ? ticketsSymbol
                  : 't' + ticketsForm.getFieldValue('symbol')
              }
            />
          </Space>
        </div>
      ) : (
        <TicketsForm
          props={{ form: ticketsForm }}
          header="Create your ERC-20 ticket token"
        />
      ),
      info: [
        'The Juice protocol will use these ERC-20 tokens of yours like tickets, handing them out to people in exchange for payments towards your budgets. ',
        "You'll provide a ticker symbol for your Tickets, and the reward token that your budgets' overflow will be swapped in to for these Tickets to claim.",
        'A ticket is redeemable for 61.8% of its proportional rewards. Meaning, if there are 100 reward tokens available, 10% of the total ticket supply could be redeemed for 6.18 reward tokens. The rest is left to share between the remaining ticket hodlers.',
        '---',
        'You can propose reconfigurations to your budget at any time. Your ticket holders will have 3 days to vote yay or nay. If there are more yays than nays, the new budget will be used once the active one expires.',
      ],
    },
    {
      title: 'Advanced',
      validate: () => budgetAdvancedForm.validateFields(),
      content: (
        <BudgetAdvancedForm
          props={{ form: budgetAdvancedForm }}
          header="Advanced tuning"
        />
      ),
      info: [
        'Your budget’s overflow is claimable by anyone who redeems your Tickets. Tickets are handed out to everyone who contributes funds to your projects, but it’s also possible to mint some tokens for yourself and for a beneficiary contract as an incentive to push for more overflow.',
        'Beneficiary contracts can be used for pre-programming a philanthropic contribution, such as Gitcoin grant matching.',
        '---',
        "Lastly, the discount rate rate affects your Budget's monetary policy. It adjusts how you value your Budget contributions over time.",
        "For example, if your discount rate is set to 97%, then someone who pays 100 towards your next month's Budget will only receive 97% the amount of tickets received by someone who paid 100 towards this months budget.",
        'Effectively this gives humans who believe your cumulative overflow will increase over time an incentive to pay you today, HODL their tickets, and redeem them at a future date for more.',
      ],
    },
    {
      title: 'Review',
      validate: () => budgetAdvancedForm.validateFields(),
      content: (
        <div>
          <div>
            <h1>Tickets</h1>
            <div
              style={{
                marginTop: 20,
                marginBottom: 20,
              }}
            >
              <Space size="large">
                <Statistic
                  title="Name"
                  value={
                    initializedTickets
                      ? ticketsName
                      : ticketsForm.getFieldValue('name')
                  }
                />
                <Statistic
                  title="Symbol"
                  value={
                    initializedTickets
                      ? ticketsSymbol
                      : 't' + ticketsForm.getFieldValue('symbol')
                  }
                />
              </Space>
            </div>
            <Button
              disabled={initializedTickets}
              htmlType="submit"
              type="primary"
              onClick={initTickets}
              loading={loadingInitTickets}
            >
              Init tickets
            </Button>
          </div>

          <Divider orientation="center" />

          <Space size="large" direction="vertical">
            <h1>Budget</h1>
            <div>
              <Space size="large">
                <Statistic
                  title="Duration"
                  value={budgetForm.getFieldValue('duration')}
                  suffix="days"
                />
                <Statistic
                  title="Amount"
                  value={budgetForm.getFieldValue('target')}
                  suffix="DAI"
                />
                <Statistic
                  title="Link"
                  value={budgetForm.getFieldValue('link')}
                />
              </Space>
            </div>
            <Space size="large" align="end">
              <Statistic
                style={{ minWidth: 100 }}
                title="Discount rate"
                value={budgetAdvancedForm.getFieldValue('discountRate')}
                suffix="%"
              />
              <Statistic
                title="Owner surplus"
                value={budgetAdvancedForm.getFieldValue('ownerAllocation') ?? 0}
                suffix="%"
              />
              <Statistic
                title="Beneficiary surplus"
                value={
                  budgetAdvancedForm.getFieldValue('beneficiaryAllocation') ?? 0
                }
                suffix="%"
              />
            </Space>
            <Space size="large" align="end">
              <Statistic
                title="Beneficiary address"
                valueStyle={{
                  fontSize: '1rem',
                  lineBreak: 'anywhere',
                }}
                value={orEmpty(
                  budgetAdvancedForm.getFieldValue('beneficiaryAddress'),
                )}
              />
            </Space>
            <Button
              disabled={!initializedTickets}
              htmlType="submit"
              type="primary"
              onClick={submitBudget}
              loading={loadingCreateBudget}
            >
              Create budget
            </Button>
          </Space>
        </div>
      ),
      info: ['asdf'],
    },
  ]

  return (
    <div
      style={{
        padding: padding.app,
        maxWidth: '90vw',
        width: 1080,
        margin: 'auto',
      }}
    >
      <Steps size="small" current={currentStep} style={{ marginBottom: 60 }}>
        {steps.map((step, i) => (
          <Steps.Step
            key={i}
            onClick={() => (i === steps.length - 1 ? null : setCurrentStep(i))}
            title={step.title}
          />
        ))}
      </Steps>

      <Row gutter={80} align="top">
        <Col span={10}>
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

        <Col span={14}>
          {steps[currentStep].info?.length ? (
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
          ) : null}
        </Col>
      </Row>
    </div>
  )
}
