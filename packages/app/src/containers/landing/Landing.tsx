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
  onNeedProvider,
}: {
  userAddress?: string
  hasBudget?: boolean
  contracts?: Contracts
  transactor?: Transactor
  onNeedProvider: () => Promise<void>
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
    'Any internet deliverable with predictable costs',
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
                    Juice is a cashflow machine for:
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
                    Get to work
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
            margin: '-20px auto',
          }}
        >
          <Space direction="vertical" size="large">
            <h2>How it's done</h2>
            <Timeline style={{ paddingLeft: 10 }}>
              <Timeline.Item {...timelineItemStyle}>
                Make a Juice contract that says how much cashflow you and your
                team want/need in order to absolutely crush your project's
                mission statement.
              </Timeline.Item>
              <Timeline.Item {...timelineItemStyle}>
                People pay you kinda like they would on Patreon, or
                transparently from within your Solidity smart contracts.{' '}
                <a
                  href="https://twitter.com/hashtag/BusinessModelAsAService"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  #BusinessModelAsAService
                </a>{' '}
              </Timeline.Item>
              <Timeline.Item {...timelineItemStyle}>
                If money overflows, your paying customers get to claim the
                surplus, effectively pushing prices down as your community
                grows. Early adopters get a discounted rate, and those HODLers
                who wait longest to claim get a juicier return.{' '}
                <a
                  href="https://twitter.com/hashtag/RegenFinance"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  #RegenFinance
                </a>
              </Timeline.Item>
              <Timeline.Item {...timelineItemStyle}>
                Your accounting periods can be however long you want, and can be
                recurring. You can make them bigger as your project evolves,
                with the approval of those paying customers that have not yet
                claimed their fair share of your overflowed surplus.
              </Timeline.Item>
            </Timeline>

            <p>
              Remember, we're all out here investing in each other for the
              contributions we're making either to the open internet, or using
              it. Make your money, crush your craft, and lift up your people.{' '}
              <a
                href="https://twitter.com/hashtag/DeFi"
                target="_blank"
                rel="noopener noreferrer"
              >
                #DeFi
              </a>{' '}
              <a
                href="https://twitter.com/hashtag/dework"
                target="_blank"
                rel="noopener noreferrer"
              >
                #DeWork
              </a>
            </p>
          </Space>
        </div>
      </section>

      {hasBudget ? null : (
        <section>
          <div
            id="create"
            style={{
              ...wrapper,
              marginTop: 100,
              marginBottom: 80,
            }}
          >
            {bigHeader('Get to work')}
            <ConfigureBudget
              userAddress={userAddress}
              contracts={contracts}
              transactor={transactor}
              onNeedProvider={onNeedProvider}
            />
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
            {bigHeader('Should you Juice?')}
            <p>There's a good chance.</p>
            <p>
              With Juice, people end up getting online community-driven goods
              and services with no ads, data integrity, and business operation
              accountability. All built by motivated punks getting transparently
              paid exactly what they ask for, and with a price tag that
              effectively tends toward zero as the overflow grows.
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
          paddingTop: 40,
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 20, marginBottom: 20 }}>🧃⚡️</div>
        <h3 style={{ color: 'white', margin: 0 }}>
          Big ups to the Ethereum community for crafting the infrastructure and
          economy to make Juice possible.
        </h3>
      </div>

      <Footer />
    </div>
  )
}
