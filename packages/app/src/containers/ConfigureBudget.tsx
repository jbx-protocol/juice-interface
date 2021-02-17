import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { Button, Col, Divider, Form, Row, Space, Statistic, Steps } from 'antd'
import { useState } from 'react'
import Web3 from 'web3'

import BudgetAdvancedForm from '../components/forms/BudgetAdvancedForm'
import BudgetForm from '../components/forms/BudgetForm'
import TicketsForm from '../components/forms/TicketsForm'
import { ContractName } from '../constants/contract-name'
import { SECONDS_IN_DAY } from '../constants/seconds-in-day'
import { colors } from '../constants/styles/colors'
import { padding } from '../constants/styles/padding'
import { shadowCard } from '../constants/styles/shadow-card'
import useContractReader from '../hooks/ContractReader'
import { Transactor } from '../models/transactor'
import { erc20Contract } from '../utils/erc20Contract'
import { isEmptyAddress } from '../utils/isEmptyAddress'
import { orEmpty } from '../utils/orEmpty'

export default function ConfigureBudget({
  transactor,
  contracts,
  userAddress,
  onNeedProvider,
}: {
  transactor?: Transactor
  contracts?: Record<ContractName, Contract>
  userAddress?: string
  onNeedProvider: () => Promise<void>
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
    args: [userAddress],
    callback: ticketsAddress => {
      if (!userAddress || !ticketsAddress || initializedTickets !== undefined)
        return
      setInitializedTickets(!isEmptyAddress(ticketsAddress))
    },
  })

  const ticketsContract = erc20Contract(ticketsAddress)

  const ticketsSymbol = useContractReader<string>({
    contract: ticketsContract,
    functionName: 'symbol',
    formatter: (value?: string) =>
      value ? Web3.utils.hexToString(value) : undefined,
  })

  const ticketsName = useContractReader<string>({
    contract: ticketsContract,
    functionName: 'name',
    formatter: (value?: string) =>
      value ? Web3.utils.hexToString(value) : undefined,
  })

  async function tryNextStep() {
    const valid = await steps[currentStep].validate()
    if (valid) setCurrentStep(currentStep + 1)
  }

  function initTickets() {
    if (!transactor || !contracts) return onNeedProvider()

    setLoadingInitTickets(true)

    const fields = ticketsForm.getFieldsValue(true)

    const _name = Web3.utils.utf8ToHex(fields.name)
    const _symbol = Web3.utils.utf8ToHex('t' + fields.symbol)

    console.log('🧃 Calling Juicer.issueTickets(name, symbol)', {
      _name,
      _symbol,
    })

    return transactor(
      contracts.Juicer.issueTickets(_name, _symbol),
      () => {
        setLoadingInitTickets(false)
        setInitializedTickets(true)
      },
      () => {
        setLoadingInitTickets(false)
      },
    )
  }

  function submitBudget() {
    if (!transactor || !contracts) return onNeedProvider()

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
    const _link = fields.link ?? ''
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
        if (userAddress) window.location.hash = userAddress
      },
    )
  }

  const steps = [
    {
      title: 'Contract',
      validate: () => budgetForm.validateFields(),
      content: (
        <BudgetForm
          props={{ form: budgetForm }}
          header="Your contract's terms"
        />
      ),
      info: [
        "Your contract will create a budgeting period that'll begin accepting payments right away, and up until the time frame runs out.",
        'A new budgeting period will be created automatically once the current one expires so that you can continue collecting money.',
        "You can make changes to your contract's specs for future budgeting periods under a certain condition – more on this in step 2.",
      ],
    },
    {
      title: 'Tickets (optional)',
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
        'Your contract will use these ERC-20 tokens like tickets, handing them out to people as a receipt for payments received.',
        "Tickets can be redeemed for your contract's overflow on a bonding curve – a ticket is redeemable for 38.2% of its proportional overflowed tokens. Meaning, if there are 100 overflow tokens available and 100 of your tickets in circulation, 10 tickets could be redeemed for 3.82 of the overflow tokens. The rest is left to share between the remaining ticket hodlers.",
        '---',
        "You can propose reconfigurations to your contract's specs at any time. Your ticket holders will have 3 days to vote yay or nay. If there are more yays than nays, the new specs will be used once the active budgeting period expires.",
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
        "Your contract's overflow is claimable by anyone who redeems your Tickets. Tickets are handed out to everyone who makes payments, but you should also reserve some tokens for yourself so that you benefit from your own surplus.",
        "You can mint a budgeting period's reserved tickets once it expires.",
        '---',
        'You can also pre-program a donation from your overflow, like for Gitcoin grant matching.',
        '---',
        "Lastly, the discount rate can give earlier adopters a better rate when claiming overflow. It's how you value your contributions over time.",
        'For example, if your discount rate is set to 97%, then someone who pays 100 towards your next budgeting period will only receive 97% the amount of tickets received by someone who paid 100 towards the current one.',
        'Effectively this gives people who believe your cumulative overflow will increase over time an added incentive to pay you today, HODL their tickets, and redeem them at a future date.',
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
              Issue tickets
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
              Activate contract
            </Button>
          </Space>
        </div>
      ),
      info: [
        "You'll be sending two transactions: The first one to issue your tickets, and then the second to kick off your contract so you can start getting paid.",
      ],
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

      <Row align="top">
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

            <Space>
              {currentStep === steps.length - 1 ? null : (
                <Button onClick={() => tryNextStep()}>Next</Button>
              )}
              {userAddress ? null : (
                <Button onClick={onNeedProvider} type="primary">
                  Connect a wallet
                </Button>
              )}
            </Space>
          </div>
        </Col>

        <Col style={{ paddingLeft: 80 }} span={14}>
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
