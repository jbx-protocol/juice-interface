import { JsonRpcProvider } from '@ethersproject/providers'
import { Button, Col, Row, Space, Timeline, TimelineItemProps } from 'antd'
import React, { CSSProperties } from 'react'

import Footer from '../../components/Footer'
import { colors } from '../../constants/styles/colors'
import { Contracts } from '../../models/contracts'
import { Transactor } from '../../models/transactor'
import ConfigureBudget from '../ConfigureBudget'

export default function Landing({
  userAddress,
  hasBudget,
  contracts,
  transactor,
  userProvider,
  onNeedProvider,
}: {
  userAddress?: string
  hasBudget?: boolean
  contracts?: Contracts
  transactor?: Transactor
  userProvider?: JsonRpcProvider
  onNeedProvider?: VoidFunction
}) {
  const totalMaxWidth = 1080

  const bigHeader = (text: string) => (
    <h1 style={{ fontSize: '3rem', fontWeight: 600, lineHeight: 1.2 }}>
      {text}
    </h1>
  )

  const timelineItemStyle: TimelineItemProps = {
    color: colors.juiceOrange,
  }

  const listData = [
    'Ethereum protocols, DAOs, and public goods',
    'Open source stuff',
    'Indy projects',
    'Any mission with predictable expenses',
  ]

  const wrapper: CSSProperties = {
    maxWidth: totalMaxWidth,
    margin: '0 auto',
  }

  function scrollToCreate() {
    document.getElementById('create')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div>
      <section style={{ padding: 40 }}>
        <div style={wrapper}>
          <Row gutter={40}>
            <Col span={14} style={{ display: 'flex', alignItems: 'center' }}>
              <div
                style={{
                  display: 'grid',
                  rowGap: 40,
                }}
              >
                {bigHeader('Taste the fruits of your labor')}

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    fontStyle: 'italic',
                  }}
                >
                  <p
                    style={{
                      fontWeight: 500,
                    }}
                  >
                    Juice is a regenerative business model for:
                  </p>
                  <div
                    style={{
                      paddingLeft: 8,
                      display: 'grid',
                      gridAutoFlow: 'row',
                      rowGap: 8,
                      fontWeight: 600,
                      fontSize: '1rem',
                    }}
                  >
                    {listData.map((data, i) => (
                      <Space key={i}>
                        <img src="/assets/bolt.png" style={{ height: 24 }} />{' '}
                        {data}
                      </Space>
                    ))}
                  </div>
                </div>

                <div>
                  <Button type="primary" onClick={scrollToCreate}>
                    Create a project
                  </Button>
                </div>
              </div>
            </Col>
            <Col span={10}>
              <img
                style={{
                  height: '75vh',
                  maxHeight: 800,
                  minHeight: 440,
                }}
                src="/assets/orange_lady.png"
                alt="GET JUICED"
              />
            </Col>
          </Row>
        </div>
      </section>

      <section>
        <div
          style={{
            maxWidth: 540,
            margin: '100px auto',
          }}
        >
          <Space direction="vertical" size="large">
            <h2>How it works</h2>
            <Timeline style={{ paddingLeft: 10 }}>
              <Timeline.Item {...timelineItemStyle}>
                Make a budget saying how much money you want/need in order to
                absolutely crush your mission statement.
              </Timeline.Item>
              <Timeline.Item {...timelineItemStyle}>
                People pay you just like they would on Patreon, or transparently
                from within your Solidity smart contracts.{' '}
                <a
                  href="https://twitter.com/hashtag/BusinessModelAsAService"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  #BusinessModelAsAService
                </a>{' '}
                <a
                  href="https://twitter.com/hashtag/dework"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  #DeWork
                </a>
              </Timeline.Item>
              <Timeline.Item {...timelineItemStyle}>
                If your budget overflows, your paying customers get to claim the
                surplus, effectively pushing prices down as you grow.{' '}
                <a
                  href="https://twitter.com/hashtag/RegenFinance"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  #RegenFinance
                </a>
              </Timeline.Item>
              <Timeline.Item {...timelineItemStyle}>
                Your budgets can be recurring. You can make changes as your
                project evolves, with the approval of those paying customers
                that have not yet claimed their fair share of your overflowed
                surplus.
              </Timeline.Item>
            </Timeline>

            <p>The collective goal is to optimize for overflow over time.</p>
          </Space>
        </div>
      </section>

      {hasBudget ? null : (
        <section>
          <div
            id="create"
            style={{
              ...wrapper,
              marginBottom: 80,
            }}
          >
            {bigHeader('Create a project')}
            {userProvider ? (
              <ConfigureBudget
                owner={userAddress}
                contracts={contracts}
                transactor={transactor}
                provider={userProvider}
              />
            ) : (
              <Button onClick={onNeedProvider} type="primary">
                Connect a wallet
              </Button>
            )}
          </div>
        </section>
      )}

      <section
        style={{
          padding: 80,
          background: colors.light,
        }}
      >
        <div
          style={{
            ...wrapper,
            display: 'grid',
            gridAutoFlow: 'column',
            alignItems: 'center',
            columnGap: 60,
          }}
        >
          <div>
            {bigHeader('Should I Juice?')}
            <p>There's a good chance.</p>
            <p>
              Juice gives projects a reason to be measured and open with their
              intent, and gives those who get value out of the project a
              cultured way to pay for it.
            </p>
            <p>
              People end up getting community-driven goods and services with no
              ads, data integrity, full business operation accountability, and
              an open source code base. All built by motivated punks getting
              paid what they ask for, and with a price tag that effectively
              tends toward zero as the juice flow grows.
            </p>
          </div>

          <img
            style={{ maxWidth: 440 }}
            src="/assets/banana_dwgj.png"
            alt="Banana chilling and saying 'DO WORK GET JUICED'"
          />
        </div>
      </section>

      <div
        style={{
          background: 'black',
          padding: 40,
          paddingTop: 60,
          textAlign: 'center',
        }}
      >
        <h3 style={{ color: 'white', margin: 0 }}>
          Big ups to the Ethereum community for crafting the infrastructure and
          economy to make Juice possible.
        </h3>
      </div>

      <Footer />
    </div>
  )
}
