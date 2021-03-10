import { Button, Col, Row, Space, Tabs } from 'antd'
import { ContractName } from 'constants/contract-name'
import { layouts } from 'constants/styles/layouts'
import { padding } from 'constants/styles/padding'
import { UserContext } from 'contexts/userContext'
import useContractReader from 'hooks/ContractReader'
import { CSSProperties, useContext, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDeepCompareEffectNoCheck } from 'use-deep-compare-effect'

import { colors } from '../../constants/styles/colors'
import { addressExists } from '../../utils/addressExists'
import { CardSection } from '../shared/CardSection'
import Loading from '../shared/Loading'
import BudgetsHistory from './BudgetsHistory'
import CurrentBudget from './CurrentBudget'
import OwnerBackOffice from './OwnerBackOffice'
import Rewards from './Rewards'
import UpcomingBudget from './UpcomingBudget'

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
                <h3 style={{ color: colors.grape }}>
                  {currentBudget?.project}
                </h3>
              </div>
              <Row gutter={60}>
                <Col xs={24} lg={12}>
                  <CardSection>
                    <CurrentBudget ticketAddress={ticketAddress} />
                  </CardSection>
                </Col>
                <Col xs={24} lg={12}>
                  <Rewards ticketAddress={ticketAddress} />
                </Col>
              </Row>
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
                    <BudgetsHistory startId={currentBudget?.previous} />
                  </div>
                </div>
              </Tabs.TabPane>
              {addressExists(ticketAddress) ? null : (
                <Tabs.TabPane
                  tab="Back office stuff"
                  key="backOffice"
                  style={tabPaneStyle}
                >
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
