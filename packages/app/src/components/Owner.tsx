import { Button, Col, Divider, Row, Space } from 'antd'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import Web3 from 'web3'

import { colors } from '../constants/styles/colors'
import { padding } from '../constants/styles/padding'
import { shadowCard } from '../constants/styles/shadow-card'
import useContractReader from '../hooks/ContractReader'
import { Budget } from '../models/budget'
import { Contracts } from '../models/contracts'
import { Transactor } from '../models/transactor'
import BudgetDetail from './BudgetDetail'
import KeyValRow from './KeyValRow'
import ReconfigureBudget from './ReconfigureBudget'
import TicketsBalance from './TicketsBalance'

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
      if (owner && !budget) window.location.href = '/create/' + owner
    },
  })

  // const tix = useContractReader<Budget>({
  //   contract: contracts?.TicketStore,
  //   functionName: 'tickets',
  //   args: [owner],
  // })

  // console.log('tixx', tix)

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

  function sustain() {
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
      contracts.Juicer.sustainOwner(
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
            padding: 20,
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

  return (
    <div style={{ background: colors.light }}>
      <TicketsBalance
        contracts={contracts}
        issuerAddress={owner}
        ticketsHolderAddress={providerAddress}
        transactor={transactor}
      />

      <div style={{ padding: padding.app }}>
        <h1>PROJ NAME</h1>
        <h3>{owner}</h3>

        <Divider orientation="center"></Divider>

        <div>
          <Space size={spacing} direction="vertical">
            <Row gutter={spacing}>
              <Col>
                {section(
                  <div>
                    <BudgetDetail
                      providerAddress={providerAddress}
                      budget={currentBudget}
                      showSustained={true}
                      showTimeLeft={true}
                      contracts={contracts}
                      transactor={transactor}
                    />
                    {KeyValRow(
                      'Sustain money pool',
                      <span>
                        <input
                          style={{ marginRight: 10 }}
                          name="sustain"
                          placeholder="0"
                          onChange={e =>
                            setSustainAmount(parseFloat(e.target.value))
                          }
                        ></input>
                        <Button onClick={sustain}>Sustain</Button>
                      </span>,
                    )}
                  </div>,
                  'Active Budget',
                )}
              </Col>
              <Col>{section(<div></div>, 'Rewards')}</Col>
            </Row>

            <Row>
              <Col>
                {section(
                  <a
                    href={
                      '/history/' +
                      (currentBudget?.total?.toNumber()
                        ? currentBudget?.id?.toNumber()
                        : currentBudget?.previous?.toNumber())
                    }
                  >
                    View history (not working yet)
                  </a>,
                )}
              </Col>
            </Row>

            {queuedBudget ? (
              section(<BudgetDetail budget={queuedBudget} />, 'Next Budget')
            ) : (
              <div>No upcoming budgets</div>
            )}

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
          </Space>
        </div>
      </div>
    </div>
  )
}
