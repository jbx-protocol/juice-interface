import { Button, Space, Tabs } from 'antd'
import React, { CSSProperties, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import Loading from '../components/Loading'
import Rewards from '../components/Rewards'
import { localProvider } from '../constants/local-provider'
import { layouts } from '../constants/styles/layouts'
import { padding } from '../constants/styles/padding'
import { useContractLoader } from '../hooks/ContractLoader'
import useContractReader from '../hooks/ContractReader'
import { Budget } from '../models/budget'
import { Contracts } from '../models/contracts'
import { Transactor } from '../models/transactor'
import OwnerBackOffice from './OwnerBackOffice'
import OwnerFinances from './OwnerFinances'
import { BigNumber } from '@ethersproject/bignumber'

export default function Owner({
  userAddress,
  transactor,
  contracts,
  onNeedProvider,
}: {
  userAddress?: string
  transactor?: Transactor
  contracts?: Contracts
  onNeedProvider: () => Promise<void>
}) {
  const [budgetId, setBudgetId] = useState<BigNumber>()
  const [budgetState, setBudgetState] = useState<
    'found' | 'missing' | 'canCreate'
  >()

  const { owner }: { owner?: string } = useParams()

  const isOwner = owner === userAddress

  const currentBudget = useContractReader<Budget>({
    contract: useContractLoader(localProvider, true)?.BudgetStore,
    functionName: 'getCurrentBudget',
    args: [owner],
    updateOn: [
      {
        contract: contracts?.Juicer,
        eventName: 'Pay',
        topics: owner ? [[], owner] : undefined,
      },
      {
        contract: contracts?.Juicer,
        eventName: 'Tap',
        topics: budgetId ? [budgetId.toHexString()] : undefined,
      },
    ],
    callback: budget => {
      if (budget) {
        setBudgetState('found')
        setBudgetId(budget.id)
      } else setBudgetState(isOwner ? 'canCreate' : 'missing')
    },
  })

  const ticketAddress = useContractReader<string>({
    contract: contracts?.TicketStore,
    functionName: 'tickets',
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
  //   .filter(e => e.project === owner)
  //   .filter(e => e.budgetId.toNumber() === currentBudget?.id.toNumber())

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
          <Link to="/">
            <Button type="primary">Create one now</Button>
          </Link>
        </div>
      )
    case 'found':
      const tabPaneStyle: CSSProperties = {
        paddingTop: padding.app,
        paddingBottom: 60,
      }

      return (
        <div>
          <Space direction="vertical" size="large">
            <div style={{ ...layouts.maxWidth }}>
              <div style={{ marginBottom: 30 }}>
                <h1
                  style={{
                    fontSize: '2.4rem',
                    margin: 0,
                  }}
                >
                  {currentBudget?.name}
                </h1>
                <h3>{owner}</h3>
              </div>
              <Rewards
                contracts={contracts}
                transactor={transactor}
                budget={currentBudget}
                userAddress={userAddress}
                ticketAddress={ticketAddress}
                onNeedProvider={onNeedProvider}
              />
            </div>

            <Tabs
              defaultActiveKey="1"
              size="large"
              style={{
                overflow: 'visible',
                width: '100vw',
              }}
              tabBarStyle={{
                ...layouts.maxWidth,
                width: '100vw',
                fontWeight: 600,
                marginBottom: 0,
                paddingTop: 0,
                paddingBottom: 0,
              }}
            >
              <Tabs.TabPane tab="Finances" key="1" style={tabPaneStyle}>
                <div style={{ ...layouts.maxWidth }}>
                  <OwnerFinances
                    contracts={contracts}
                    transactor={transactor}
                    currentBudget={currentBudget}
                    userAddress={userAddress}
                    owner={owner}
                    onNeedProvider={onNeedProvider}
                    ticketAddress={ticketAddress}
                  />
                </div>
              </Tabs.TabPane>
              <Tabs.TabPane
                tab="Back office stuff"
                key="2"
                style={tabPaneStyle}
              >
                <div style={{ ...layouts.maxWidth }}>
                  <OwnerBackOffice
                    contracts={contracts}
                    transactor={transactor}
                    currentBudget={currentBudget}
                    ticketAddress={ticketAddress}
                    onNeedProvider={onNeedProvider}
                    isOwner={isOwner}
                  />
                </div>
              </Tabs.TabPane>
            </Tabs>
          </Space>
        </div>
      )
    default:
      return <Loading />
  }
}
