import { t, Trans } from '@lingui/macro'
import { Col, Row } from 'antd'
import { AppWrapper } from 'components/common'
import { lightColors } from 'constants/styles/colors'
import { LAYOUT_MAX_WIDTH_PX } from 'constants/styles/layouts'
import { ThemeContext } from 'contexts/themeContext'
import Image from 'next/image'
import { CSSProperties, useContext } from 'react'
import { BigHeading } from './home/BigHeading'
import Faq from './home/Faq'
import Footer from './home/Footer'
import { HeroSection } from './home/HeroSection'
import { HowItWorksSection } from './home/HowItWorksSection'
import { StatsSection } from './home/StatsSection'
import { TopProjectsSection } from './home/TopProjectsSection'
import TrendingSection from './home/TrendingSection'
import blueBerry from '/public/assets/blueberry-ol.png'
function Landing() {
  const { theme } = useContext(ThemeContext)
  const colors = theme.colors

  const wrapper: CSSProperties = {
    maxWidth: LAYOUT_MAX_WIDTH_PX,
    margin: '0 auto',
  }

  return (
    <div>
      <HeroSection />

      <StatsSection />

      <TrendingSection />

      <TopProjectsSection />

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
                <BigHeading
                  text={t`Should you Juicebox?`}
                  style={{ color: lightColors.dark0 }}
                />
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
            <BigHeading text={t`FAQs`} />
            <Faq />
          </div>
        </div>
      </section>

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
