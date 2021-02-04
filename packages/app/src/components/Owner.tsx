import { Button, Col, Divider, Input, Row, Space } from 'antd'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import Web3 from 'web3'

import { colors } from '../constants/styles/colors'
import { padding } from '../constants/styles/padding'
import { shadowCard } from '../constants/styles/shadow-card'
import { erc20Contract } from '../helpers/erc20Contract'
import useContractReader from '../hooks/ContractReader'
import { Budget } from '../models/budget'
import { Contracts } from '../models/contracts'
import { Transactor } from '../models/transactor'
import BudgetDetail from './BudgetDetail'
import BudgetsHistory from './BudgetsHistory'
import ReconfigureBudget from './ReconfigureBudget'
import Rewards from './Rewards'

export default function Owner({
  providerAddress,
  transactor,
  contracts,
}: {
  providerAddress?: string
  transactor?: Transactor
  contracts?: Contracts
}) {
  const [sustainAmount, setSustainAmount] = useState<number>(0)
  const [showReconfigureModal, setShowReconfigureModal] = useState<boolean>()

  const { owner }: { owner?: string } = useParams()

  const spacing = 30

  const isOwner = owner === providerAddress

  const currentBudget = useContractReader<Budget>({
    contract: contracts?.BudgetStore,
    functionName: 'getCurrentBudget',
    args: [owner],
    callback: budget => {
      if (owner && !budget) window.location.href = '/create'
    },
  })

  const ticketAddress = useContractReader<string>({
    contract: contracts?.TicketStore,
    functionName: 'tickets',
    args: [owner],
  })

  const ticketName = useContractReader<string>({
    contract: erc20Contract(ticketAddress),
    functionName: 'name',
    formatter: (value: string) => Web3.utils.hexToString(value),
  })

  const wantTokenName = useContractReader<string>({
    contract: erc20Contract(currentBudget?.want),
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

    const eth = new Web3(Web3.givenProvider).eth

    const amount =
      sustainAmount !== undefined
        ? eth.abi.encodeParameter('uint256', sustainAmount)
        : undefined

    console.log(
      '🧃 Calling Juicer.sustain(owner, amount, want, providerAddress)',
      {
        owner: currentBudget.owner,
        amount,
        want: currentBudget.want,
        providerAddress,
      },
    )

    transactor(
      contracts.Juicer.payOwner(
        currentBudget.owner,
        amount,
        currentBudget.want,
        providerAddress,
      ),
      () => setSustainAmount(0),
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

  if (!currentBudget) return null

  return (
    <div style={{ background: colors.light, padding: padding.app }}>
      <h1>{ticketName}</h1>
      <h3>{owner}</h3>

      <Divider orientation="center" />

      <Space size={spacing} direction="vertical">
        <Row gutter={spacing}>
          <Col span={12}>
            {section(
              <div>
                <BudgetDetail
                  providerAddress={providerAddress}
                  budget={currentBudget}
                  showSustained={true}
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
                    onChange={e => setSustainAmount(parseFloat(e.target.value))}
                  />
                  <Button type="primary" onClick={payOwner}>
                    Pay owner
                  </Button>
                </Space>
              </div>,
              'Active Budget',
            )}
          </Col>

          <Col span={12}>
            {section(
              <Rewards
                contracts={contracts}
                transactor={transactor}
                budget={currentBudget}
                providerAddress={providerAddress}
              />,
              'Rewards',
            )}
          </Col>
        </Row>

        <Row gutter={spacing}>
          <Col span={12}>
            {isOwner ? (
              <div>
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
            {queuedBudget ? (
              section(<BudgetDetail budget={queuedBudget} />, 'Next Budget')
            ) : (
              <div>No upcoming budgets</div>
            )}
          </Col>
        </Row>

        <Row gutter={spacing}>
          <Col span={12}>
            {section(
              <BudgetsHistory
                startId={currentBudget.previous}
                contracts={contracts}
                transactor={transactor}
                providerAddress={providerAddress}
              />,
              'Budget History',
            )}
          </Col>
        </Row>
      </Space>
    </div>
  )
}
