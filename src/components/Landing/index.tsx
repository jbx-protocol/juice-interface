import { t, Trans } from '@lingui/macro'
import { Button, Col, Row, Space } from 'antd'
import ExternalLink from 'components/shared/ExternalLink'
import FeedbackFormButton from 'components/shared/FeedbackFormButton'
import Grid from 'components/shared/Grid'
import Loading from 'components/shared/Loading'
import ProjectCard from 'components/shared/ProjectCard'

import { ThemeContext } from 'contexts/themeContext'
import { useProjectsQuery } from 'hooks/Projects'
import { CSSProperties, useContext } from 'react'
import { Link } from 'react-router-dom'
import useMobile from 'hooks/Mobile'
import { fathom } from 'lib/fathom'

import { ThemeOption } from 'constants/theme/theme-option'

import Faq from './Faq'
import Footer from './Footer'
import Payments from './Payments'
import { OverflowVideoLink } from './QAs'
import TrendingSection from './TrendingSection'

const BigHeader = ({
  text,
  style,
}: {
  text: string
  style?: CSSProperties
}) => {
  return (
    <h1
      style={{
        fontSize: '2.4rem',
        fontWeight: 600,
        lineHeight: 1.2,
        margin: 0,
        ...style,
      }}
    >
      {text}
    </h1>
  )
}

const SmallHeader = ({ text }: { text: string }) => (
  <h3 style={{ fontWeight: 600, margin: 0 }}>{text}</h3>
)

const FourthCol = ({
  header,
  children,
}: React.PropsWithChildren<{ header: string }>) => (
  <div>
    <SmallHeader text={header} />
    <p style={{ marginBottom: 0, marginTop: 5 }}>{children}</p>
  </div>
)

export default function Landing() {
  const { theme, forThemeOption } = useContext(ThemeContext)
  const colors = theme.colors
  const isMobile = useMobile()

  const totalMaxWidth = 1080

  const { data: previewProjects } = useProjectsQuery({
    pageSize: 4,
  })

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

  // const { data: protocolLogs } = useSubgraphQuery({
  //   entity: 'protocolLog',
  //   keys: ['erc20Count', 'paymentsCount', 'projectsCount', 'volumePaid'],
  // })

  // const stats = protocolLogs?.[0]

  const BuiltForList = () => (
    <div
      style={{
        display: 'grid',
        gridAutoFlow: 'row',
        rowGap: 8,
        fontWeight: 500,
      }}
    >
      <p
        style={{
          marginBottom: 4,
        }}
      >
        <Trans>Built for:</Trans>
      </p>
      {[
        t`DAOs and communities`,
        t`Crowdfunding campaigns`,
        t`Crypto and Web3 businesses`,
        t`Indie creators and builders`,
      ].map((data, i) => (
        <Space
          style={{ fontStyle: 'italic', paddingLeft: 8 }}
          key={`builtfor_${i}`}
          size="middle"
        >
          <img src="/assets/bolt.svg" alt="⚡️" />
          {data}
        </Space>
      ))}
    </div>
  )

  const CallToAction = () => {
    const isMobile = useMobile()

    return (
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        <Button
          type="primary"
          size="large"
          block={isMobile}
          href={'/#/create'}
          onClick={() => {
            fathom?.trackGoal('IIYVJKNC', 0)
          }}
          style={{
            marginRight: isMobile ? 0 : '0.8rem',
            marginBottom: isMobile ? '0.8rem' : 0,
          }}
        >
          <Trans>Launch your project</Trans>
        </Button>

        <Button size="large" block={isMobile} href="/#/projects">
          <Trans>Explore projects</Trans>
        </Button>
      </div>
    )
  }

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
                paddingBottom: 25,
              }}
            >
              <div>
                <Space direction="vertical" size="large">
                  <BigHeader
                    text={t`Fund anything. Grow together.`}
                    style={{ fontSize: !isMobile ? '3.8rem' : '2.3rem' }}
                  />
                  <div
                    style={{
                      marginBottom: '1rem',
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 500,
                        fontSize: '1rem',
                        marginBottom: '1rem',
                      }}
                    >
                      <Trans>
                        The Decentralized Funding Platform. Light enough for a
                        group of friends, powerful enough for a global network
                        of anons.{' '}
                        <Link
                          className="text-primary hover-text-decoration-underline"
                          to="/p/juicebox"
                          style={{
                            textDecoration: 'underline',
                            fontWeight: 'inherit',
                          }}
                        >
                          Community-owned
                        </Link>
                        , on Ethereum.
                      </Trans>
                    </div>

                    <BuiltForList />
                  </div>
                  <CallToAction />
                </Space>
              </div>
            </Col>

            <Col xs={24} md={11}>
              <img
                className="hide-mobile"
                style={{
                  minHeight: 300,
                  width: '100%',
                  maxWidth: '50vw',
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
                loading="lazy"
              />
            </Col>
          </Row>
        </div>
      </section>

      {/* <section
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
          <SmallHeader text={t`Protocol stats`} />
          <div>{stats?.projectsCount} projects</div>
          <div>{stats?.paymentsCount} payments</div>
          <div>
            <CurrencySymbol currency={'ETH'} />
            {formatWad(stats?.volumePaid, { precision: 0 })} volume
          </div>
          <div>{stats?.erc20Count} ERC20s deployed</div>
        </div>
      </section> */}

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
              <SmallHeader text={t`Projects using Juicebox`} />
              <div style={{ marginTop: 20 }}>
                {previewProjects ? (
                  <Grid list>
                    {previewProjects.map(p => (
                      <ProjectCard key={p.metadataUri} project={p} />
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
              <SmallHeader text={t`Latest payments`} />
              <div style={{ maxHeight: 600, overflow: 'auto', marginTop: 20 }}>
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
                loading="lazy"
              />
            </Col>
            <Col xs={24} sm={13}>
              <div style={{ display: 'grid', rowGap: 20, marginBottom: 40 }}>
                <FourthCol header={t`Programmable spending`}>
                  <Trans>
                    Commit portions of your funds to the people or projects you
                    want to support, or the contributors you want to pay. When
                    you get paid, so do they.
                  </Trans>
                </FourthCol>
                <FourthCol header={t`ERC-20 community tokens`}>
                  <Trans>
                    When someone pays your project, they'll receive your
                    project's tokens in return. Tokens can be redeemed for a
                    portion of your project's overflow funds; when you win, your
                    community wins with you. Leverage your project's token to
                    grant governance rights, community access, or other
                    membership perks.
                  </Trans>
                </FourthCol>
                <FourthCol header={t`Redistributable surplus`}>
                  <Trans>
                    Set a funding target to cover predictable expenses. Any
                    extra funds (<OverflowVideoLink>overflow</OverflowVideoLink>
                    ) can be claimed by anyone holding your project's tokens
                    alongside you.
                  </Trans>
                </FourthCol>
                <FourthCol header={t`Transparency & accountability`}>
                  <Trans>
                    Changes to your project's funding configuration require a
                    community-approved period to take effect, which acts as a
                    safeguard against rug pulls. Your supporters don't have to
                    trust you — even though they already do.
                  </Trans>
                </FourthCol>

                <p>
                  <Trans>
                    Note: Juicebox is new, unaudited, and not guaranteed to work
                    perfectly. Before spending money, do your own research:{' '}
                    <ExternalLink href="https://discord.gg/6jXrJSyDFf">
                      ask questions
                    </ExternalLink>
                    ,{' '}
                    <ExternalLink href="https://github.com/jbx-protocol/juice-interface">
                      check out the code
                    </ExternalLink>
                    , and understand the risks!
                  </Trans>
                </p>
              </div>
            </Col>
          </Row>
        </div>
      </section>

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
                <BigHeader text={t`Should you Juicebox?`} />
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
                loading="lazy"
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
            <BigHeader text={t`FAQs`} />
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
          loading="lazy"
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
        <p style={{ color: 'white', margin: 0 }}>
          <Trans>
            Big ups to the Ethereum community for crafting the infrastructure
            and economy to make Juicebox possible.
          </Trans>
        </p>
      </div>
      <FeedbackFormButton />
      <Footer />
    </div>
  )
}
