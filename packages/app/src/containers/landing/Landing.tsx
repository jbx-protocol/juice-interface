import { Button, Col, Row, Space, Timeline, TimelineItemProps } from 'antd'
import React, { CSSProperties } from 'react'
import { Link } from 'react-router-dom'

import Footer from '../../components/Footer'
import { colors } from '../../constants/styles/colors'

export default function Landing({
  userAddress,
  onNeedAddress,
}: {
  userAddress?: string
  onNeedAddress: VoidFunction
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

                {userAddress ? (
                  <Link to={userAddress}>
                    <Button type="primary">Create a project</Button>
                  </Link>
                ) : (
                  <Button onClick={onNeedAddress} type="primary">
                    Create a project
                  </Button>
                )}
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
        <Row style={wrapper}>
          <Col span={10}>
            <img
              style={{
                height: '75vh',
                maxHeight: 800,
                maxWidth: 400,
                minHeight: 440,
                objectFit: 'contain',
              }}
              src="/assets/blueberry.png"
              alt="blueberry"
            />
          </Col>

          <Col
            span={14}
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Space direction="vertical" size="large">
              <Timeline style={{ paddingLeft: 10 }}>
                <Timeline.Item {...timelineItemStyle}>
                  Make a budget saying how much money you want/need in order to
                  absolutely crush your mission statement.
                </Timeline.Item>
                <Timeline.Item {...timelineItemStyle}>
                  People pay you just like they would on Patreon, or
                  transparently from within your Solidity smart contracts.{' '}
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
                  If your budget overflows, your paying customers get to claim
                  the surplus, effectively pushing prices down as you grow.{' '}
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

              <div>
                <p>
                  The collective goal is to optimize for overflow over time.
                </p>

                {userAddress ? (
                  <Link to={userAddress}>
                    <Button type="primary">Create a project</Button>
                  </Link>
                ) : (
                  <Button onClick={onNeedAddress} type="primary">
                    Create a project
                  </Button>
                )}
              </div>
            </Space>
          </Col>
        </Row>
      </section>

      <section>
        <Row
          gutter={80}
          style={{
            ...wrapper,
            padding: 80,
          }}
        >
          <Col span={12}>
            <h2 style={{ fontWeight: 600 }}>
              Old business models don’t work on the open internet.
            </h2>
            <p>
              Users are now in charge, and they expect transparency, algorithmic
              assurances, and public governance out of the protocols they depend
              on.
            </p>
            <p>
              Though the power and the risk are shifting away from institutions
              and into the hands of individuals, the integrity of this
              regenerative economy still depends on buidlers, workers, creators,
              innovators, and maintainers. They’re out here self-organizing to
              make sure your bags stay SAFU and have a chance to grow.
            </p>
          </Col>

          <Col span={12}>
            <h2 style={{ fontWeight: 600 }}>
              Organic, consistent cashflow is key
            </h2>
            <p>
              Until now, there hasn’t been an organic way to provide consistent
              cashflow to these core teams and casual contributors, many of whom
              start out young and broke and unable to buy bags. We’ve been
              patching this need with legacy ideas like golden handcuffs,
              unreliable ideas like grants, and controversial ideas like
              whimsically minting token supply for dev treasuries.{' '}
            </p>
            <p>
              The internet of work, DeWork, needs a juicier solution – one that
              extends the best parts of DeFi, one that promotes cooperation,
              flexibility, and immediacy.
            </p>
            <p>Juice is that solution.</p>
          </Col>
        </Row>

        <div>
          <img
            src="/assets/fountain_of_juice.png"
            alt="Fountain of Juice"
            style={{ width: '100vw' }}
          />
        </div>
      </section>

      <section style={{ background: '#EBAF4D' }}>
        <div
          style={{
            ...wrapper,
            display: 'grid',
            gridAutoFlow: 'column',
            alignItems: 'center',
            columnGap: 60,
            padding: 80,
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
            {userAddress ? (
              <Link to={userAddress}>
                <Button type="primary">Build with Juice</Button>
              </Link>
            ) : (
              <Button onClick={onNeedAddress} type="primary">
                Build with Juice
              </Button>
            )}
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
        <h3 style={{ color: colors.juiceOrange, margin: 0 }}>
          Big ups to the Ethereum community for crafting the infrastructure and
          economy to make Juice possible.
        </h3>
      </div>

      <Footer />
    </div>
  )
}
