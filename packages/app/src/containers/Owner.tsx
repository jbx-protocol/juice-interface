import { JsonRpcProvider } from '@ethersproject/providers'
import {
  Button,
  Col,
  DescriptionsProps,
  Divider,
  Input,
  Row,
  Space,
} from 'antd'
import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Web3 from 'web3'
import BudgetDetail from '../components/BudgetDetail'
import BudgetsHistory from '../components/BudgetsHistory'
import Loading from '../components/Loading'
import Reserves from '../components/Reserves'
import Rewards from '../components/Rewards'
import { colors } from '../constants/styles/colors'
import { layouts } from '../constants/styles/layouts'
import { padding } from '../constants/styles/padding'
import { shadowCard } from '../constants/styles/shadow-card'
import useContractReader from '../hooks/ContractReader'
import { Budget } from '../models/budget'
import { Contracts } from '../models/contracts'
import { Transactor } from '../models/transactor'
import { erc20Contract } from '../utils/erc20Contract'
import ReconfigureBudget from './ReconfigureBudget'

export default function Owner({
  userAddress,
  transactor,
  contracts,
  provider,
}: {
  userAddress?: string
  transactor?: Transactor
  contracts?: Contracts
  provider?: JsonRpcProvider
}) {
  const [sustainAmount, setSustainAmount] = useState<number>(0)
  const [showReconfigureModal, setShowReconfigureModal] = useState<boolean>()
  const [budgetState, setBudgetState] = useState<
    'found' | 'missing' | 'canCreate'
  >()
  const [loadingPayOwner, setLoadingPayOwner] = useState<boolean>()

  const { owner }: { owner?: string } = useParams()

  const spacing = 30

  const isOwner = owner === userAddress

  const currentBudget = useContractReader<Budget>({
    contract: contracts?.BudgetStore,
    functionName: 'getCurrentBudget',
    args: [owner],
    callback: budget => {
      if (budget) setBudgetState('found')
      else setBudgetState(isOwner ? 'canCreate' : 'missing')
    },
  })

  const ticketAddress = useContractReader<string>({
    contract: contracts?.TicketStore,
    functionName: 'tickets',
    args: [owner],
  })

  const ticketName = useContractReader<string>({
    contract: erc20Contract(ticketAddress, provider),
    functionName: 'name',
    formatter: (value?: string) =>
      value ? Web3.utils.hexToString(value) : undefined,
  })
  const wantTokenName = useContractReader<string>({
    contract: erc20Contract(currentBudget?.want, provider),
    functionName: 'name',
  })

  const queuedBudget = useContractReader<Budget>({
    contract: contracts?.BudgetStore,
    functionName: 'getQueuedBudget',
    args: [owner],
  })

  // const currentSustainEvents = (useEventListener({
  //   contracts,
  //   contractName: ContractName.Juicer,
  //   eventName: 'SustainBudget',
  //   provider: localProvider,
  //   startBlock: 1,
  //   getInitial: true,
  //   topics: currentBudget?.id ? [BigNumber.from(currentBudget?.id)] : [],
  // }) as SustainEvent[])
  //   .filter(e => e.owner === owner)
  //   .filter(e => e.budgetId.toNumber() === currentBudget?.id.toNumber())

  function payOwner() {
    if (!transactor || !contracts?.Juicer || !currentBudget?.owner) return

    setLoadingPayOwner(true)

    const eth = new Web3(Web3.givenProvider).eth

    const amount =
      sustainAmount !== undefined
        ? eth.abi.encodeParameter('uint256', sustainAmount)
        : undefined

    console.log('🧃 Calling Juicer.sustain(owner, amount, userAddress)', {
      owner: currentBudget.owner,
      amount,
      userAddress,
    })

    transactor(
      contracts.Juicer.payOwner(currentBudget.owner, amount, userAddress),
      () => {
        setSustainAmount(0)
        setLoadingPayOwner(false)
      },
    )
  }

  function header(text: string) {
    return (
      <h2
        style={{
          margin: 0,
          color: 'black',
          fontWeight: 600,
        }}
      >
        {text}
      </h2>
    )
  }

  function section(content?: JSX.Element, headerText?: string) {
    if (!content) return null

    return (
      <div>
        {headerText ? header(headerText) : null}
        <div
          style={{
            ...shadowCard,
            overflow: 'hidden',
          }}
        >
          {content}
        </div>
      </div>
    )
  }

  // const sustainments = (
  //   <div>
  //     <h3>Thanks to...</h3>
  //     {currentSustainEvents.length ? (
  //       currentSustainEvents.map((e, i) => (
  //         <div
  //           style={{
  //             marginBottom: 20,
  //             lineHeight: 1.2,
  //           }}
  //           key={i}
  //         >
  //           <div>Amount: {e.amount?.toNumber()}</div>
  //           <div>Sustainer: {e.sustainer}</div>
  //           <div>Beneficiary: {e.beneficiary}</div>
  //         </div>
  //       ))
  //     ) : (
  //       <div>No sustainments yet</div>
  //     )}
  //   </div>
  // )

  const descriptionsStyle: DescriptionsProps = {
    labelStyle: { fontWeight: 600 },
    size: 'middle',
    bordered: true,
  }

  switch (budgetState) {
    case 'missing':
      return (
        <div
          style={{
            padding: padding.app,
            height: '100%',
            ...layouts.centered,
          }}
        >
          <h2>No budget found for</h2>
          <p>{owner}</p>
        </div>
      )
    case 'canCreate':
      return (
        <div
          style={{
            padding: padding.app,
            height: '100%',
            ...layouts.centered,
          }}
        >
          <h2>You haven't created a budget yet!</h2>
          <Link to="create">
            <Button type="primary">Create one now</Button>
          </Link>
        </div>
      )
    case 'found':
      return (
        <div
          style={{
            background: colors.light,
            padding: padding.app,
          }}
        >
          <div style={{ display: 'flex' }}>
            <div style={{ flex: 1 }}>
              <h1>{ticketName}</h1>
              <h3>{owner}</h3>
            </div>

            <Space size="large" align="start">
              <Rewards
                contracts={contracts}
                transactor={transactor}
                budget={currentBudget}
                userAddress={userAddress}
                ticketAddress={ticketAddress}
                provider={provider}
                descriptionsStyle={descriptionsStyle}
              />
              <Reserves
                contracts={contracts}
                transactor={transactor}
                budget={currentBudget}
                descriptionsStyle={descriptionsStyle}
                ticketAddress={ticketAddress}
                provider={provider}
              ></Reserves>
            </Space>
          </div>

          <Divider orientation="center" />

          <Space size={spacing} direction="vertical">
            <Row gutter={spacing}>
              <Col span={12}>
                {section(
                  <div>
                    <BudgetDetail
                      userAddress={userAddress}
                      budget={currentBudget}
                      contracts={contracts}
                      transactor={transactor}
                    />
                    <Divider style={{ margin: 0 }} />
                    <Space
                      style={{
                        width: '100%',
                        justifyContent: 'flex-end',
                        padding: 25,
                      }}
                    >
                      <Input
                        name="sustain"
                        placeholder="0"
                        suffix={wantTokenName}
                        type="number"
                        onChange={e =>
                          setSustainAmount(parseFloat(e.target.value))
                        }
                      />
                      <Button
                        type="primary"
                        onClick={payOwner}
                        loading={loadingPayOwner}
                      >
                        Pay owner
                      </Button>
                    </Space>
                  </div>,
                  'Active Budget',
                )}
              </Col>

              <Col span={12}>
                {section(
                  queuedBudget ? (
                    <BudgetDetail
                      userAddress={userAddress}
                      budget={currentBudget}
                      contracts={contracts}
                      transactor={transactor}
                    />
                  ) : (
                    <div style={{ padding: 25 }}>No upcoming budgets</div>
                  ),
                  'Next Budget',
                )}
                {isOwner ? (
                  <div style={{ marginTop: 40, textAlign: 'right' }}>
                    <Button onClick={() => setShowReconfigureModal(true)}>
                      Reconfigure budget
                    </Button>
                    <ReconfigureBudget
                      transactor={transactor}
                      contracts={contracts}
                      currentValue={currentBudget}
                      visible={showReconfigureModal}
                      onCancel={() => setShowReconfigureModal(false)}
                    />
                  </div>
                ) : null}
              </Col>
            </Row>

            <Row gutter={spacing}>
              <Col span={12}>
                {section(
                  <BudgetsHistory
                    startId={currentBudget?.previous}
                    contracts={contracts}
                    transactor={transactor}
                    userAddress={userAddress}
                  />,
                  'Budget History',
                )}
              </Col>
            </Row>
          </Space>
        </div>
      )
    default:
      return <Loading />
  }
}
