import { t, Trans } from '@lingui/macro'
import { Button, Col, Row, Space } from 'antd'
import V1Create from 'components/v1/V1Create'
import Loading from 'components/shared/Loading'
import FeedbackFormLink from 'components/shared/FeedbackFormLink'

import { ThemeContext } from 'contexts/themeContext'
import { useProjectsQuery } from 'hooks/v1/Projects'
import { CSSProperties, useContext } from 'react'

import Grid from 'components/shared/Grid'

import ProjectCard from 'components/shared/ProjectCard'

import { Link } from 'react-router-dom'

import { ThemeOption } from 'constants/theme/theme-option'

import Faq from './Faq'
import Footer from './Footer'
import Payments from './Payments'
import TrendingSection from './TrendingSection'

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

  const { data: previewProjects } = useProjectsQuery({
    pageSize: 4,
  })

  const smallHeader = (text: string) => (
    <h3 style={{ fontWeight: 600, margin: 0 }}>{text}</h3>
  )

  const listData = [
    t`Indie artists, devs, creators`,
    t`Ethereum protocols and DAOs`,
    t`Public goods and services`,
    t`Open source businesses`,
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
                {bigHeader(t`Community funding for people and projects`)}
                <div
                  style={{
                    fontWeight: 500,
                    fontSize: '1rem',
                  }}
                >
                  <Trans>
                    Build a community around a project, fund it, and program its
                    spending. Light enough for a group of friends, powerful
                    enough for a global network of anons.
                  </Trans>
                  <br />
                  <br />
                  <Trans>
                    Powered by public smart contracts on{' '}
                    <a
                      style={{
                        color: colors.text.primary,
                        fontWeight: 500,
                        borderBottom:
                          '1px solid ' + colors.stroke.action.primary,
                      }}
                      href="https://ethereum.org/en/what-is-ethereum/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Ethereum
                    </a>
                    .
                  </Trans>
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
                    <Trans>Built for:</Trans>
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
                      <Trans>Design your project</Trans>
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
                alt="Chill banana drinking juice"
              />
            </Col>
          </Row>
        </div>
      </section>

      <TrendingSection />

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
          <Row gutter={60}>
            <Col xs={24} md={12} style={{ marginBottom: 100 }}>
              {smallHeader(t`Projects using Juicebox`)}
              <div style={{ marginTop: 20 }}>
                {previewProjects ? (
                  <Grid list>
                    {previewProjects.map(p => (
                      <ProjectCard key={p.uri} project={p} />
                    ))}
                  </Grid>
                ) : (
                  <Loading />
                )}
              </div>
              <div style={{ textAlign: 'center', marginTop: 20 }}>
                <Link to="/projects?tab=all">
                  <Button>
                    <Trans>All projects</Trans>
                  </Button>
                </Link>
              </div>
            </Col>
            <Col xs={24} md={12} style={{ marginBottom: 100 }}>
              {smallHeader(t`Latest payments`)}
              <div style={{ maxHeight: 600, overflow: 'auto' }}>
                <Payments />
              </div>
            </Col>
          </Row>
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
                alt="Pinepple geek artist holding a paintbrush"
              />
            </Col>
            <Col xs={24} sm={13}>
              <div style={{ display: 'grid', rowGap: 20, marginBottom: 40 }}>
                {fourthCol(t`Programmable spending`, [
                  t`Commit portions of your funds to the people or projects you want to support, or the contributors you want to pay. When you get paid, so do they.`,
                ])}
                {fourthCol(t`ERC20 community tokens`, [
                  t`When someone pays your project as a patron or a user of your app, they earn a portion of your project's token. When you win, your token holders win, so they'll want you to win even more.`,
                ])}
                {fourthCol(t`Redistributable surplus`, [
                  t`Set a funding target to cover predictable expenses. Any extra funds can be claimed by anyone holding your project's tokens alongside you.`,
                ])}
                {fourthCol(t`Transparency & accountability`, [
                  t`Changes to your project's funding require a community approval period to take effect. Your supporters don't have to trust you—even though they already do.`,
                ])}
                <p>
                  <Trans>
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
                      href="https://github.com/jbx-protocol/juice-interface"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      check out the code
                    </a>
                    , and understand the risks!
                  </Trans>
                </p>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      {window.innerWidth > 600 && (
        <section
          id="create"
          style={{
            ...section,
            marginTop: 0,
            paddingTop: 20,
            paddingBottom: 40,
          }}
        >
          <V1Create />
        </section>
      )}

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
                {bigHeader(t`Should you Juicebox?`)}
                <div style={{ color: colors.text.over.brand.secondary }}>
                  <p className="ol">
                    <Trans>Almost definitely.</Trans>
                  </p>
                  <p className="ol">
                    <Trans>
                      With Juicebox, projects are built and maintained by
                      motivated punks getting paid transparently, and funded by
                      a community of users and patrons who are rewarded as the
                      projects they support succeed.
                    </Trans>
                  </p>
                  <p className="ol">
                    <Trans>
                      The future will be led by creators, and owned by
                      communities.
                    </Trans>
                  </p>
                </div>
              </div>
            </Col>

            <Col xs={24} md={10}>
              <img
                style={{ maxWidth: '100%' }}
                src="/assets/blueberry-ol.png"
                alt="Sexy blueberry with bright pink lipstick spraying a can of spraypaint"
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
            {bigHeader(t`FAQs`)}
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
          alt="Powerlifting orange hitting an olympic deadlift"
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
          <Trans>
            Big ups to the Ethereum community for crafting the infrastructure
            and economy to make Juicebox possible.
          </Trans>
        </h3>
      </div>
      <FeedbackFormLink />
      <Footer />
    </div>
  )
}
