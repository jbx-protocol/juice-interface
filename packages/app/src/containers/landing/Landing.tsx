import { Button, Col, Row, Space } from 'antd'
import React, { CSSProperties } from 'react'

import Footer from '../../components/Footer'
import { colors } from '../../constants/styles/colors'
import { Budget } from '../../models/budget'
import { Contracts } from '../../models/contracts'
import { Transactor } from '../../models/transactor'
import ConfigureBudget from '../ConfigureBudget'

export default function Landing({
  userAddress,
  activeBudget,
  contracts,
  transactor,
  onNeedProvider,
}: {
  userAddress?: string
  activeBudget?: Budget
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

  const listData = [
    'Ethereum public goods',
    'Open source projects',
    'Indy artists, journalists, and researchers',
    'Any internet-enabled service with predictable costs',
  ]

  const section: CSSProperties = {
    paddingLeft: 40,
    paddingRight: 40,
    marginTop: 40,
    marginBottom: 40,
  }

  const wrapper: CSSProperties = {
    maxWidth: totalMaxWidth,
    margin: '0 auto',
  }

  function scrollToCreate() {
    document.getElementById('create')?.scrollIntoView({ behavior: 'smooth' })
  }

  const arrowDivider = (
    <div
      style={{
        width: '100%',
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 20,
      }}
    >
      <img
        style={{ height: 45, objectFit: 'contain' }}
        src="/assets/arrow.png"
        alt="arrow"
      />
    </div>
  )

  return (
    <div>
      <section style={section}>
        <div style={wrapper}>
          <Row>
            <Col
              xs={24}
              md={14}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <div
                style={{
                  display: 'grid',
                  rowGap: 40,
                  marginBottom: 40,
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
                      <Space key={i} size="middle">
                        <img
                          src="/assets/bolt.png"
                          style={{ height: 24 }}
                          alt="⚡️"
                        />
                        {data}
                      </Space>
                    ))}
                  </div>
                </div>

                <div className="hide-mobile">
                  <Button type="primary" onClick={scrollToCreate} size="large">
                    Do it
                  </Button>
                </div>
              </div>
            </Col>

            <Col xs={24} md={10}>
              <img
                style={{
                  height: '75vh',
                  maxHeight: 800,
                  minHeight: 440,
                  maxWidth: '100%',
                  objectFit: 'contain',
                }}
                src="/assets/orange_lady.png"
                alt="GET JUICED"
              />
            </Col>
          </Row>
        </div>
      </section>

      <section style={section}>
        <div
          style={{
            maxWidth: 480,
            margin: '0 auto',
          }}
        >
          <Space direction="vertical">
            <h2>How it's done</h2>
            <p>
              Make a Juice contract that says how much cashflow you and your
              team want/need in order to absolutely crush your project's mission
              statement.
              <br></br>
              <span style={{ fontSize: '30px' }}>💰💅💪</span>
            </p>
            {arrowDivider}
            <p>
              People can either pay you like they would on Patreon, or
              transparently from within Solidity smart contracts.
              <a
                href="https://twitter.com/hashtag/BusinessModelAsAService"
                target="_blank"
                rel="noopener noreferrer"
              >
                #BusinessModelAsAService
              </a>
            </p>
            {arrowDivider}
            <p>
              If money overflows, your paying customers claim the surplus,
              effectively pushing prices down as your community grows. Early
              adopters get a discounted rate, and those HODLers who wait longest
              to claim get a juicier return. While unclaimed, overflow earns mad
              interest on Yearn.
              <br></br>
              <span style={{ fontSize: '30px' }}>⛲️</span>
            </p>
            {arrowDivider}
            <p>
              Your budgeting periods can be however long you want, and can be
              recurring. You can make them bigger as your project grows, with
              the approval of those paying customers that have not yet claimed
              their fair share of your overflowed surplus.
              <br></br>
              <span style={{ fontSize: '30px' }}>📈</span>
            </p>
            {arrowDivider}
            <p>
              Create value for your community, crush your craft, make your
              money, and lift up your people.{' '}
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
              </a>{' '}
              <a
                href="https://twitter.com/hashtag/RegenFinance"
                target="_blank"
                rel="noopener noreferrer"
              >
                #RegenFinance
              </a>
              <br></br>
              <span style={{ fontSize: '30px' }}>🧃⚡️</span>
            </p>
          </Space>
        </div>
      </section>

      <section style={section} className="hide-mobile">
        <div
          id="create"
          style={{
            ...wrapper,
            marginTop: 100,
            marginBottom: 80,
          }}
        >
          {bigHeader('Do it')}
          <ConfigureBudget
            userAddress={userAddress}
            contracts={contracts}
            transactor={transactor}
            onNeedProvider={onNeedProvider}
            activeBudget={activeBudget}
          />
        </div>
      </section>

      <section
        style={{
          padding: 30,
          paddingTop: 80,
          paddingBottom: 80,
          background: colors.light,
        }}
      >
        <div style={wrapper}>
          <Row align="middle" gutter={40}>
            <Col xs={24} md={14}>
              {bigHeader('Should you Juice?')}
              <p>Almost definately.</p>
              <p>
                With Juice, we end up getting online community-driven goods and
                services with no ads, data integrity, and business operation
                accountability. All built by motivated punks getting
                transparently paid exactly what they ask for, and with a price
                tag that effectively tends toward zero as the overflow grows.
              </p>
              <br></br>
              <h2>What's it cost?</h2>
              <p>
                Juice is an open protocol that makes money using Juice itself.
                You can check out the contractualized budget specs{' '}
                <a href="https://juice.work/0x00000000" target="new">
                  here
                </a>
                .
              </p>
              <p>
                5% of all money made using Juice is sent to help pay for this
                budget. In exchange, you get the opportunity to benefit from the
                overflow that the ecosystem accumulates over time, and voting
                power on how Juice's cashflow needs should evolve.
              </p>
            </Col>

            <Col xs={24} md={10}>
              <img
                style={{ maxWidth: '100%' }}
                src="/assets/banana_dwgj.png"
                alt="Banana chilling and saying 'DO WORK GET JUICED'"
              />
            </Col>
          </Row>
        </div>
      </section>

      <div
        style={{
          background: 'black',
          padding: 40,
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
