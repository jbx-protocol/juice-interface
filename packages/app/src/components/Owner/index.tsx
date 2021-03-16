import { Button, Space, Tabs } from 'antd'
import { ContractName } from 'constants/contract-name'
import { layouts } from 'constants/styles/layouts'
import { padding } from 'constants/styles/padding'
import { UserContext } from 'contexts/userContext'
import { useUserBudgetSelector } from 'hooks/AppSelector'
import useContractReader from 'hooks/ContractReader'
import { useErc20Contract } from 'hooks/Erc20Contract'
import { CSSProperties, useContext, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDeepCompareEffectNoCheck } from 'use-deep-compare-effect'
import { addressExists } from 'utils/addressExists'

import Loading from '../shared/Loading'
import BudgetsHistory from './BudgetsHistory'
import OwnerBackOffice from './OwnerBackOffice'
import Project from './Project'
import UpcomingBudget from './UpcomingBudget'

export default function Owner() {
  const [budgetState, setBudgetState] = useState<
    'found' | 'missing' | 'canCreate'
  >()

  const budget = useUserBudgetSelector()
  const { userAddress } = useContext(UserContext)

  const { owner }: { owner?: string } = useParams()

  const isOwner = owner === userAddress

  const ticketAddress = useContractReader<string>({
    contract: ContractName.TicketStore,
    functionName: 'tickets',
    args: useMemo(() => (owner ? [owner] : null), [owner]),
    updateOn: useMemo(
      () =>
        owner
          ? [
              {
                contract: ContractName.TicketStore,
                eventName: 'Issue',
                topics: [owner],
              },
            ]
          : undefined,
      [owner],
    ),
  })

  const ticketContract = useErc20Contract(ticketAddress)

  const ticketSymbol = useContractReader<string>({
    contract: ticketContract,
    functionName: 'symbol',
  })

  useDeepCompareEffectNoCheck(() => {
    if (budget) setBudgetState('found')
    if (budget === null) setBudgetState(isOwner ? 'canCreate' : 'missing')
  }, [isOwner, budget])

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
            <Project
              ticketSymbol={ticketSymbol}
              ticketAddress={ticketAddress}
              budget={budget}
              style={layouts.maxWidth}
            />

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
              <Tabs.TabPane tab="Future" key="future" style={tabPaneStyle}>
                <div style={{ ...layouts.maxWidth }}>
                  <div style={{ maxWidth: 600 }}>
                    <UpcomingBudget owner={owner} />
                  </div>
                </div>
              </Tabs.TabPane>
              <Tabs.TabPane tab="History" key="history" style={tabPaneStyle}>
                <div style={{ ...layouts.maxWidth }}>
                  <div style={{ maxWidth: 600 }}>
                    <BudgetsHistory startId={budget?.previous} />
                  </div>
                </div>
              </Tabs.TabPane>
              {addressExists(ticketAddress) ? null : (
                <Tabs.TabPane tab="Tickets" key="tickets" style={tabPaneStyle}>
                  <div style={{ ...layouts.maxWidth }}>
                    <OwnerBackOffice
                      ticketAddress={ticketAddress}
                      isOwner={isOwner}
                    />
                  </div>
                </Tabs.TabPane>
              )}
            </Tabs>
          </Space>
        </div>
      )
    default:
      return <Loading />
  }
}
