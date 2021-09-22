import { Button, Col, Row, Space } from 'antd'
import Create from 'components/Create'
import Loading from 'components/shared/Loading'
import { ThemeOption } from 'constants/theme/theme-option'
import { ThemeContext } from 'contexts/themeContext'
import { useProjects } from 'hooks/Projects'
import { CSSProperties, useContext } from 'react'

import ProjectsGrid from '../shared/ProjectsGrid'
import Faq from './Faq'
import Footer from './Footer'
import { Project } from 'models/subgraph-entities/project'

export default function Landing() {
  const { theme, forThemeOption } = useContext(ThemeContext)

  const colors = theme.colors

  const totalMaxWidth = 1080

  const bigHeader = (text: string) => (
    <h1
      style={{
        fontSize: '2.4rem',
        fontWeight: 600,
        lineHeight: 1.2,
        margin: 0,
      }}
    >
      {text}
    </h1>
  )

  const previewProjects:
    | Pick<Project, 'handle' | 'uri' | 'totalPaid' | 'createdAt'>[]
    | undefined = useProjects({ pageSize: 4 })

  const smallHeader = (text: string) => (
    <h2 style={{ fontWeight: 600, margin: 0 }}>{text}</h2>
  )

  const listData = [
    'Indie artists, devs, creators',
    'Ethereum protocols and DAOs',
    'Public goods and services',
    'Open source businesses',
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
    <div>
      {smallHeader(header)}
      <p style={{ marginBottom: 0, marginTop: 5 }}>
        {body.map((b, i) => (
          <span key={i}>{b} </span>
        ))}
      </p>
    </div>
  )

  return (
    <div>
      <section style={section}>
        <div style={wrapper}>
          <Row gutter={30} align="middle">
            <Col
              xs={24}
              md={13}
              style={{
                display: 'flex',
                alignItems: 'center',
                paddingBottom: 60,
              }}
            >
              <div
                style={{
                  display: 'grid',
                  rowGap: 30,
                }}
              >
                {bigHeader('Community funding for people and projects')}
                <div
                  style={{
                    fontWeight: 500,
                    fontSize: '1rem',
                  }}
                >
                  Build a community around a project, fund it, and program its
                  spending. Light enough for a group of friends, powerful enough
                  for a global network of anons.
                  <br />
                  <br />
                  Powered by public smart contracts on{' '}
                  <a
                    style={{
                      color: colors.text.primary,
                      fontWeight: 500,
                      borderBottom: '1px solid ' + colors.stroke.action.primary,
                    }}
                    href="https://ethereum.org/en/what-is-ethereum/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ethereum
                  </a>
                  .
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridAutoFlow: 'row',
                    rowGap: 8,
                    fontWeight: 600,
                  }}
                >
                  <p style={{ color: colors.text.brand.primary, opacity: 1 }}>
                    Built for:
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
                  <div style={{ display: 'inline-block' }}>
                    <Button
                      type="primary"
                      size="large"
                      onClick={scrollToCreate}
                    >
                      Design your project
                    </Button>
                  </div>
                </div>
              </div>
            </Col>

            <Col xs={24} md={11}>
              <img
                style={{
                  minHeight: 300,
                  maxWidth: '100%',
                  objectFit: 'contain',
                }}
                src={
                  forThemeOption &&
                  forThemeOption({
                    [ThemeOption.dark]: '/assets/banana-od.png',
                    [ThemeOption.light]: '/assets/banana-ol.png',
                  })
                }
              />
            </Col>
          </Row>
        </div>
      </section>

      <section
        style={{
          ...section,
          marginTop: 80,
          paddingTop: 20,
          paddingBottom: 60,
        }}
      >
        <div
          style={{
            ...wrapper,
          }}
        >
          {smallHeader('Projects using Juicebox')}
          <div style={{ marginTop: 20 }}>
            {previewProjects ? (
              <ProjectsGrid projects={previewProjects} />
            ) : (
              <Loading />
            )}
          </div>
          <div style={{ textAlign: 'center' }}>
            <a href="/#/projects">
              <Button>All projects</Button>
            </a>
          </div>
        </div>
      </section>

      <section
        style={{
          ...section,
          paddingTop: 60,
          paddingBottom: 40,
        }}
      >
        <div
          style={{
            ...wrapper,
          }}
        >
          <Row align="middle">
            <Col xs={24} sm={11}>
              <img
                style={{
                  maxHeight: 480,
                  maxWidth: '100%',
                  objectFit: 'contain',
                  marginBottom: 40,
                }}
                src="/assets/pina.png"
              />
            </Col>
            <Col xs={24} sm={13}>
              <div style={{ display: 'grid', rowGap: 20, marginBottom: 40 }}>
                {fourthCol('Programmable spending', [
                  `Commit portions of your revenue to go to the people or projects you want to support, or the contributors you want to pay. When you get paid, so do they.`,
                ])}
                {fourthCol('ERC20 community tokens', [
                  `When someone pays your project either as a patron or a user of your app, they earn a proportional amount of your project's token. When you win, your token holders win, so they'll want you to win even more.`,
                ])}
                {fourthCol('Redistributable surplus', [
                  `Set a funding target to cover predictable expenses. Any extra revenue can be claimed by anyone holding your project's tokens alongside you.`,
                ])}
                {fourthCol('Transparency & accountability', [
                  `Changes to your project's funding require a community approval period to take effect. Your supporters don't have to trust you—even though they already do.`,
                ])}
                <p>
                  Note: Juicebox is new, unaudited, and not guaranteed to work
                  perfectly. Before spending money, do your own research:{' '}
                  <a
                    href="https://discord.gg/6jXrJSyDFf"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ask questions
                  </a>
                  ,{' '}
                  <a
                    href="https://github.com/jbx-protocol/juicehouse"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    check out the code
                  </a>
                  , and understand the risks!
                </p>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      <section
        id="create"
        style={{
          ...section,
          marginTop: 0,
          paddingTop: 20,
          paddingBottom: 40,
        }}
      >
        <Create />
      </section>

      {/* <section style={section} className="hide-mobile">
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
      </section> */}

      <section
        style={{
          padding: 30,
          paddingTop: 80,
          paddingBottom: 80,
          background: colors.background.brand.secondary,
          color: colors.text.over.brand.secondary,
        }}
      >
        <div style={wrapper}>
          <Row align="middle" gutter={40}>
            <Col xs={24} md={14}>
              <div style={{ display: 'grid', rowGap: 20 }}>
                {bigHeader('Should you Juicebox?')}
                <div style={{ color: colors.text.over.brand.secondary }}>
                  <p className="ol">Almost definitely.</p>
                  <p className="ol">
                    With Juicebox, projects are built and maintained by
                    motivated punks getting paid transparently, and funded by a
                    community of users and patrons who are rewarded as the
                    projects they support succeed.
                  </p>
                  <p className="ol">
                    The future will be lead by creators, and owned by
                    communities.
                  </p>
                </div>
              </div>
            </Col>

            <Col xs={24} md={10}>
              <img
                style={{ maxWidth: '100%' }}
                src="/assets/blueberry-ol.png"
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
          <div
            style={{
              display: 'grid',
              rowGap: 60,
              paddingLeft: 20,
              paddingRight: 20,
            }}
          >
            {bigHeader('FAQs')}
            <Faq />
          </div>
        </div>
      </section>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <img
          style={{
            height: '40vh',
            maxHeight: 400,
            minHeight: 300,
            maxWidth: '100%',
            objectFit: 'contain',
            objectPosition: 'center',
            marginBottom: -10,
          }}
          src={
            forThemeOption &&
            forThemeOption({
              [ThemeOption.dark]: '/assets/orange_lady-od.png',
              [ThemeOption.light]: '/assets/orange_lady-ol.png',
            })
          }
        />
      </div>

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
          economy to make Juicebox possible.
        </h3>
      </div>

      <Footer />
    </div>
  )
}
