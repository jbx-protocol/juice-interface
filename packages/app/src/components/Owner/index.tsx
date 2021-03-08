import { Button, Space, Tabs } from 'antd'
import { ContractName } from 'constants/contract-name'
import { layouts } from 'constants/styles/layouts'
import { padding } from 'constants/styles/padding'
import { UserContext } from 'contexts/userContext'
import useContractReader from 'hooks/ContractReader'
import { CSSProperties, useContext, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDeepCompareEffectNoCheck } from 'use-deep-compare-effect'

import Loading from '../shared/Loading'
import OwnerBackOffice from './OwnerBackOffice'
import OwnerFinances from './OwnerFinances'
import Rewards from './Rewards'

export default function Owner() {
  const [budgetState, setBudgetState] = useState<
    'found' | 'missing' | 'canCreate'
  >()

  const { userAddress, currentBudget } = useContext(UserContext)

  const { owner }: { owner?: string } = useParams()

  const isOwner = owner === userAddress

  const ticketAddress = useContractReader<string>({
    contract: ContractName.TicketStore,
    functionName: 'tickets',
    args: owner ? [owner] : null,
  })

  useDeepCompareEffectNoCheck(() => {
    if (currentBudget) setBudgetState('found')
    if (currentBudget === null)
      setBudgetState(isOwner ? 'canCreate' : 'missing')
  }, [isOwner, currentBudget])

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
              <Rewards ticketAddress={ticketAddress} />
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
                  <OwnerFinances owner={owner} ticketAddress={ticketAddress} />
                </div>
              </Tabs.TabPane>
              <Tabs.TabPane
                tab="Back office stuff"
                key="2"
                style={tabPaneStyle}
              >
                <div style={{ ...layouts.maxWidth }}>
                  <OwnerBackOffice
                    ticketAddress={ticketAddress}
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
