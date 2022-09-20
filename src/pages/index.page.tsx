import { t, Trans } from '@lingui/macro'
import { Button, Col, Row, Space } from 'antd'
import { AppWrapper } from 'components/common'
import { FeedbackFormButton } from 'components/FeedbackFormButton'

import { ThemeContext } from 'contexts/themeContext'
import useMobile from 'hooks/Mobile'
import { fathom } from 'lib/fathom'
import { CSSProperties, useContext } from 'react'

import { ThemeOption } from 'constants/theme/theme-option'

import Image from 'next/image'
import Link from 'next/link'
import Faq from './home/Faq'
import Footer from './home/Footer'
import { HowItWorksSection } from './home/HowItWorksSection'
import { StatsSection } from './home/StatsSection'
import { HeroHeading, HeroSubheading } from './home/strings'
import { TopProjectsSection } from './home/TopProjectsSection'
import TrendingSection from './home/TrendingSection'
import bananaOd from '/public/assets/banana-od.webp'
import bananaOl from '/public/assets/banana-ol.webp'
import blueBerry from '/public/assets/blueberry-ol.png'
import bolt from '/public/assets/icons/bolt.svg'
import orangeLadyOd from '/public/assets/orange_lady-od.png'
import orangeLadyOl from '/public/assets/orange_lady-ol.png'

const BigHeader = ({
  text,
  style,
}: {
  text: string | JSX.Element
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

function Landing() {
  const { theme, forThemeOption } = useContext(ThemeContext)
  const colors = theme.colors
  const isMobile = useMobile()

  const totalMaxWidth = 1080

  const wrapper: CSSProperties = {
    maxWidth: totalMaxWidth,
    margin: '0 auto',
  }

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
        t`DAOs`,
        t`Crowdfunding`,
        t`NFT projects`,
        t`Indie creators and builders`,
      ].map((data, i) => (
        <Space style={{ paddingLeft: 8 }} key={i} size="middle">
          <Image src={bolt} alt="⚡️" />
          {data}
        </Space>
      ))}
    </div>
  )

  const CallToAction = () => {
    const isMobile = useMobile()

    return (
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 8,
          flexDirection: isMobile ? 'column' : 'row',
        }}
      >
        <Link href="/create">
          <Button
            type="primary"
            size="large"
            block={isMobile}
            onClick={() => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              ;(fathom as any)?.trackGoal('IIYVJKNC', 0)
            }}
            style={{
              marginRight: isMobile ? 0 : '0.8rem',
              marginBottom: isMobile ? '0.8rem' : 0,
            }}
          >
            <Trans>Launch your project</Trans>
          </Button>
        </Link>
        <Button size="large" block={isMobile} href="/projects">
          <Trans>Explore projects</Trans>
        </Button>
      </div>
    )
  }

  return (
    <div>
      <section
        style={{
          paddingLeft: 40,
          paddingRight: 40,
          marginTop: 40,
          marginBottom: 100,
        }}
      >
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
                    text={<HeroHeading />}
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
                      <HeroSubheading />
                    </div>

                    <BuiltForList />
                  </div>
                  <CallToAction />
                </Space>
              </div>
            </Col>

            <Col xs={24} md={11}>
              <Image
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
                    [ThemeOption.dark]: bananaOd,
                    [ThemeOption.light]: bananaOl,
                  })
                }
                alt="Chill banana drinking juice"
              />
            </Col>
          </Row>
        </div>
      </section>

      <TopProjectsSection />

      <StatsSection />

      <TrendingSection />

      <HowItWorksSection />

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
              <Image
                style={{ maxWidth: '100%' }}
                src={blueBerry}
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
              padding: '0 1.5rem',
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
        <Image
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
              [ThemeOption.dark]: orangeLadyOd,
              [ThemeOption.light]: orangeLadyOl,
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

export default function LandingPage() {
  return (
    <AppWrapper>
      <Landing />
    </AppWrapper>
  )
}
