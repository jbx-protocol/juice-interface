import { Button, Col, Row, Space } from 'antd'
import { colors } from 'constants/styles/colors'
import { Budget } from 'models/budget'
import { CSSProperties } from 'react'

import ConfigureBudget from '../ConfigureBudget'
import Tweets from '../Tweets'
import Faq from './Faq'
import Footer from './Footer'

export default function Landing({ activeBudget }: { activeBudget?: Budget }) {
  const totalMaxWidth = 1080

  const bigHeader = (text: string) => (
    <h1
      style={{ fontSize: '3rem', fontWeight: 600, lineHeight: 1.2, margin: 0 }}
    >
      {text}
    </h1>
  )

  const smallHeader = (text: string) => (
    <h2 style={{ fontWeight: 600, margin: 0 }}>{text}</h2>
  )

  const listData = [
    "Apps on Ethereum's Optimism L2",
    'Internet public goods',
    'Open source businesses',
    'Indie artists, journalists, & researchers',
    'Just about any web project with predictable costs',
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

  const fourthCol = (header: string, body: (JSX.Element | string)[]) => (
    <Col xs={24} md={12} lg={6} style={{ marginBottom: 60 }}>
      {smallHeader(header)}
      <p style={{ marginBottom: 0 }}>
        {body.map((b, i) => (
          <span key={i}>{b} </span>
        ))}
      </p>
    </Col>
  )

  return (
    <div>
      <section style={section}>
        <div style={wrapper}>
          <Row gutter={30}>
            <Col
              xs={24}
              md={14}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <div
                style={{
                  display: 'grid',
                  rowGap: 30,
                  paddingBottom: 60,
                }}
              >
                {bigHeader('A business model for the open internet')}

                <p style={{ fontWeight: 500, fontSize: '1rem' }}>
                  Projects on Juice say up-front how much cashflow they need to
                  crush what they do. Once they're earning more than that, the
                  overflow can be claimed by their users, patrons, & investors.{' '}
                  <a
                    href="https://twitter.com/hashtag/DeWork"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    #DeWork
                  </a>
                </p>

                <div
                  style={{
                    display: 'grid',
                    gridAutoFlow: 'row',
                    rowGap: 8,
                    fontWeight: 600,
                  }}
                >
                  <p style={{ color: colors.juiceOrange, opacity: 1 }}>
                    Juice is ideal for:
                  </p>
                  {listData.map((data, i) => (
                    <Space
                      style={{ fontStyle: 'italic', paddingLeft: 8 }}
                      key={i}
                      size="middle"
                    >
                      <img
                        src="/assets/bolt.png"
                        style={{ height: 24 }}
                        alt="⚡️"
                      />
                      {data}
                    </Space>
                  ))}
                </div>

                <div className="hide-mobile">
                  <Button type="primary" onClick={scrollToCreate} size="large">
                    Play with it
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
                src="/assets/orange_lady-od.png"
                alt="GET JUICED"
              />
            </Col>
          </Row>
        </div>
      </section>

      <section style={section}>
        <div
          style={{
            ...wrapper,
            marginTop: 100,
          }}
        >
          <Row gutter={60}>
            {fourthCol('Do work 💅', [
              `Make a Juice contract that says how much cashflow you and your
                team want/need in order to absolutely crush your project's
                mission statement over a set time frame.`,
            ])}
            {fourthCol('Get paid 💰', [
              `People can fund your project through the Juice dashboard as a
                patron or investor, or through your app as a paying user. For
                example, if your users pay you a transaction fee or monthly
                cost, just route it through Juice's contracts.`,
              <a
                href="https://twitter.com/hashtag/composability"
                target="_blank"
                rel="noopener noreferrer"
              >
                #composability
              </a>,
              <br />,
              <a
                href="https://twitter.com/hashtag/BusinessModelAsAService"
                target="_blank"
                rel="noopener noreferrer"
              >
                #BusinessModelAsAService
              </a>,
            ])}
            {fourthCol('Overflow ⛲️', [
              `If money overflows, your paying customers claim the surplus
                alongside you, effectively pushing prices down as your community
                grows. Early adopters get a discounted rate, and those HODLers
                who wait longest to claim get a juicier return. While unclaimed,
                overflow earns interest.`,
              <a
                href="https://twitter.com/hashtag/DeFi"
                target="_blank"
                rel="noopener noreferrer"
              >
                #DeFi
              </a>,
              <a
                href="https://twitter.com/hashtag/RegenFinance"
                target="_blank"
                rel="noopener noreferrer"
              >
                #RegenFinance
              </a>,
            ])}
            {fourthCol('Repeat 📈', [
              `Your budgeting time frames can be however long you want, and can be
                recurring. You can make them bigger as your project grows, with
                the approval of those paying customers that have not yet claimed
                their fair share of your overflowed surplus.`,
            ])}
          </Row>
        </div>
      </section>

      <section style={section} className="hide-mobile">
        <div
          id="create"
          style={{
            ...wrapper,
            marginBottom: 80,
          }}
        >
          {bigHeader('Play with it')}
          <ConfigureBudget activeBudget={activeBudget} />
        </div>
      </section>

      <section style={wrapper}>
        <div
          style={{
            marginBottom: 60,
            fontWeight: 600,
            textAlign: 'center',
          }}
        >
          Create value for your community, crush your craft, make your money,
          and lift up your people.<br></br>
          <span style={{ fontSize: '30px' }}>🧃⚡️</span>
        </div>
      </section>

      <section
        style={{
          padding: 30,
          paddingTop: 80,
          paddingBottom: 80,
          background: colors.light,
          color: colors.dark,
        }}
      >
        <div style={wrapper}>
          <Row align="middle" gutter={40}>
            <Col xs={24} md={14}>
              <div style={{ display: 'grid', rowGap: 20 }}>
                {bigHeader('Should you Juice?')}
                <div>
                  <p className="ol">Almost definitely.</p>
                  <p className="ol">
                    With Juice, we end up getting community-driven online goods
                    and services with no ads, data integrity, and business
                    operation accountability. All built by motivated punks
                    getting transparently paid what they ask for, while
                    rewarding everyone who helped create the overflow an
                    opportunity to capitalize on it.
                  </p>
                  <a
                    className="ol"
                    href="https://twitter.com/hashtag/dework"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: colors.secondaryDark }}
                  >
                    #DeWork
                  </a>
                </div>
              </div>
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

      <section>
        <div
          id="faq"
          style={{
            ...wrapper,
            paddingTop: 80,
            paddingBottom: 80,
            maxWidth: 800,
          }}
        >
          <Faq />
        </div>
      </section>

      <section>
        <div style={{ ...wrapper, padding: 30 }}>
          <Tweets />
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
