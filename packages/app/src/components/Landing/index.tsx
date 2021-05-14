import { Button, Col, Row, Space } from 'antd'
import { colors } from 'constants/styles/colors'
import { CSSProperties } from 'react'

import DefineProject from './DefineProject'
import Faq from './Faq'
import Footer from './Footer'

export default function Landing() {
  const totalMaxWidth = 1080

  const bigHeader = (text: string) => (
    <h1
      style={{ fontSize: '3.2rem', fontWeight: 600, lineHeight: 1.2, margin: 0 }}
    >
      {text}
    </h1>
  )

  const smallHeader = (text: string) => (
    <h2 style={{ fontWeight: 600, margin: 0 }}>{text}</h2>
  )

  const listData = [
    'Indie artists, devs, journalists, & researchers',
    'Ethereum protocols & communities',
    'Public goods',
    'Open source businesses',
    'Just about any project with predictable costs',
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
                {/* {bigHeader('Fund your project on the open internet')} */}
                {bigHeader("The business model of the future")}
                <div>
                  <p style={{ fontWeight: 500, fontSize: '1.14rem' }}>
                    Projects say up front how much cashflow they need
                    in order to crush what they do. Once they're earning more
                    than that, the $ETH overflow can be claimed by their users,
                    patrons, & investors alongside them.{' '}
                  </p>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridAutoFlow: 'row',
                    rowGap: 8,
                    fontWeight: 600,
                  }}
                >
                  <p style={{ color: colors.juiceOrange, opacity: 1 }}>
                    Perfect for:
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
                    Get started
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

      <section style={section} className="hide-mobile">
        <div
          id="create"
          style={{
            ...wrapper,
            marginBottom: 120,
          }}
        >
          <div style={{ paddingTop: 80, marginBottom: 40 }}>
            {bigHeader('What are you working on?')}
          </div>
          <DefineProject />
        </div>
      </section>

      <section
        style={{
          padding: 30,
          paddingTop: 80,
          paddingBottom: 80,
          background: colors.juiceLight,
          color: colors.dark,
        }}
      >
        <div style={wrapper}>
          <Row align="middle" gutter={40}>
            <Col xs={24} md={14}>
              <div style={{ display: 'grid', rowGap: 20 }}>
                {bigHeader('Should you Juice?')}
                <div style={{ color: colors.dark }}>
                  <p className="ol">Almost definitely.</p>
                  <p className="ol">
                    With Juice, we end up getting community-driven online creations that automatically reward
                    the people who help them succeed. Projects are created and maintained by motivated punks
                    getting transparently paid what they ask for, and funded by a community of users, patrons, and investors
                    who have the opportunity to capitalize on the overflow they help create.
                  </p>
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

      <section style={{...section, marginTop: 0, paddingTop: 20, paddingBottom: 80, background: "rgb(57, 43, 70)"}}>
        <div
          style={{
            ...wrapper,
            marginTop: 80
          }}
        >

          <div style={{ display: 'grid', rowGap: 60 }}>
          {bigHeader('How it works')}
          <Row gutter={60}>
            {fourthCol('Do work 💅', [
              `Deploy a Juice contract that says how much cashflow you and your
                team want/need in order to absolutely crush what you do.`,<br></br>,<br></br>,`Your funding cycles can be however long you want, and can be recurring.`
            ])}
            {fourthCol('Get paid 💰', [
              `People can fund your project through the Juice dashboard as a
                patron or investor, or through your app as a paying user.`,<br></br>,<br></br>, `For
                example, if your users pay you a transaction fee or monthly
                cost within your app, just route it through your Juice contract so your people can share in your success.`
            ])}
            {fourthCol('Overflow ⛲️', [
              `If money overflows, your paying contributors claim the surplus
                alongside you, effectively pushing prices down as your community
                grows.`,<br></br>,<br></br>, `Early adopters get a discounted rate, and those hodlers
                who wait longest to claim get a juicier return.`,<br></br>,<br></br>,`While unclaimed,
                overflow earns interest.`
            ])}
            {fourthCol('Repeat 📈', [
              `If your funding cycles are recurring, any overflow you have will be used to fund your next funding cycle.`,<br></br>,<br></br>,`You can also reconfigure your funding needs as your project grows, and democratically involve your community in enacting these decisions along the way.  
                `,
            ])}
          </Row>
              </div>
        <div
          style={{
            fontWeight: 600,
            marginTop: 40,
            textAlign: 'center',
          }}
        >
          Create value for your community, crush your craft, make your money,
          and lift up your people.<br></br>
        </div>
        </div>
      </section>

      <section>
        <div
          id="faq"
          style={{
            ...wrapper,
            paddingTop: 20,
            paddingBottom: 80,
            maxWidth: 800
          }}
        >
        <div
          style={wrapper}
        >
          <div style={{ display: 'grid', rowGap: 60 }}>
          {bigHeader('FAQs')}
          <Faq />
          </div>
        </div>
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
