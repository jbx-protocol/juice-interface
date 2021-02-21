import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { Button, Col, Form, Row, Space, Steps } from 'antd'
import { useState } from 'react'
import Web3 from 'web3'

import { advancedContractStep } from '../components/configure-budget-steps/advancedContractStep'
import { contractStep } from '../components/configure-budget-steps/contractStep'
import { reviewStep } from '../components/configure-budget-steps/reviewStep'
import { ticketsStep } from '../components/configure-budget-steps/ticketsStep'
import WtfCard from '../components/WtfCard'
import { ContractName } from '../constants/contract-name'
import { SECONDS_IN_DAY } from '../constants/seconds-in-day'
import { padding } from '../constants/styles/padding'
import { DAI } from '../constants/tokens/dai'
import useContractReader from '../hooks/ContractReader'
import { Budget } from '../models/budget'
import { AdvancedBudgetFormFields } from '../models/forms-fields/advanced-budget-form'
import { BudgetFormFields } from '../models/forms-fields/budget-form'
import { TicketsFormFields } from '../models/forms-fields/tickets-form'
import { Step } from '../models/step'
import { Transactor } from '../models/transactor'
import { addressExists } from '../utils/addressExists'
import { erc20Contract } from '../utils/erc20Contract'

export default function ConfigureBudget({
  transactor,
  contracts,
  userAddress,
  onNeedProvider,
  initializedBudget,
}: {
  transactor?: Transactor
  contracts?: Record<ContractName, Contract>
  userAddress?: string
  onNeedProvider: () => Promise<void>
  initializedBudget?: Budget
}) {
  const [ticketsForm] = Form.useForm<TicketsFormFields>()
  const [budgetForm] = Form.useForm<BudgetFormFields>()
  const [budgetAdvancedForm] = Form.useForm<AdvancedBudgetFormFields>()
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
      setInitializedTickets(addressExists(ticketsAddress))
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
    const step = steps[currentStep]

    if (step.validate) {
      try {
        await step.validate()
      } catch (e) {
        console.log('e', e)
        return
      }
    }

    setCurrentStep(currentStep + 1)
  }

  async function initTickets() {
    if (!transactor || !contracts) return onNeedProvider()

    const fields = ticketsForm.getFieldsValue(true)

    if (!fields.name || !fields.symbol) {
      setCurrentStep(1)
      setTimeout(async () => {
        await ticketsForm.validateFields()
      }, 0)
      return
    }

    setLoadingInitTickets(true)

    const _name = Web3.utils.utf8ToHex(fields.name)
    const _symbol = Web3.utils.utf8ToHex('t' + fields.symbol)

    console.log('🧃 Calling Juicer.issueTickets(name, symbol)', {
      _name,
      _symbol,
    })

    return transactor(
      contracts.TicketStore.issue(_name, _symbol),
      () => {
        setLoadingInitTickets(false)
        setInitializedTickets(true)
      },
      () => {
        setLoadingInitTickets(false)
      },
    )
  }

  function activateContract() {
    if (!transactor || !contracts) return onNeedProvider()

    const fields = {
      ...budgetForm.getFieldsValue(true),
      ...budgetAdvancedForm.getFieldsValue(true),
    }

    if (!fields.target || !fields.duration || !fields.name) {
      setCurrentStep(0)
      setTimeout(async () => {
        await budgetForm.validateFields()
      }, 0)
      return
    }

    setLoadingCreateBudget(true)

    const _target = BigNumber.from(fields.target).toHexString()
    const _duration = BigNumber.from(
      fields.duration *
        (process.env.NODE_ENV === 'development' ? 1 : SECONDS_IN_DAY),
    ).toHexString()
    const _link = fields.link ?? ''
    const _name = fields.name
    const _discountRate = BigNumber.from(fields.discountRate).toHexString()
    const _ownerAllocation = fields.ownerAllocation
      ? BigNumber.from(fields.ownerAllocation).toHexString()
      : 0
    const _beneficiaryAllocation = fields.beneficiaryAllocation
      ? BigNumber.from(fields.beneficiaryAllocation).toHexString()
      : 0
    const _beneficiaryAddress =
      fields.beneficiaryAddress?.trim() ??
      '0x0000000000000000000000000000000000000000'

    const _want = DAI

    console.log('🧃 Calling BudgetStore.configure(...)', {
      _target,
      _duration,
      _want,
      _name,
      _link,
      _discountRate,
      _ownerAllocation,
      _beneficiaryAllocation,
      _beneficiaryAddress,
    })

    transactor(
      contracts.BudgetStore.configure(
        _target,
        _duration,
        _want,
        _name,
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

  const steps: Step[] = [
    contractStep({ form: budgetForm }),
    ticketsStep({
      form: ticketsForm,
      ticketsName,
      ticketsSymbol,
      initializedTickets,
    }),
    advancedContractStep({ form: budgetAdvancedForm }),
    reviewStep({
      ticketsForm,
      budgetForm,
      budgetAdvancedForm,
      initializedTickets,
      initializedBudget,
      ticketsName,
      ticketsSymbol,
      initTickets,
      activateContract,
      loadingInitTickets,
      loadingCreateBudget,
      userAddress,
    }),
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
      <Steps
        size="small"
        current={currentStep}
        style={{
          marginBottom: 60,
        }}
      >
        {steps.map((step, i) => (
          <Steps.Step
            key={i}
            onClick={() => setCurrentStep(i)}
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

        <Col
          style={{
            paddingLeft: 80,
          }}
          span={14}
        >
          {steps[currentStep].info?.length ? (
            <WtfCard>
              {steps[currentStep].info?.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </WtfCard>
          ) : null}
        </Col>
      </Row>
    </div>
  )
}
