import { t, Trans } from '@lingui/macro'
import { Col, Row } from 'antd'
import { AppWrapper } from 'components/common'
import Image from 'next/image'
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
  return (
    <div>
      <HeroSection />

      <StatsSection />

      <TrendingSection />

      <TopProjectsSection />

      <HowItWorksSection />

      <section className="bg-juice-100 py-20 px-7 text-black dark:bg-juice-100 dark:text-black">
        <div className="my-0 mx-auto max-w-[1080px]">
          <Row align="middle" gutter={40}>
            <Col xs={24} md={14}>
              <div className="grid gap-y-5">
                <BigHeading
                  className="text-black"
                  text={t`Should you Juicebox?`}
                />
                <div className="text-black dark:text-black">
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
                alt="Sexy Juicebox blueberry with bright pink lipstick spraying a can of spraypaint"
                loading="lazy"
              />
            </Col>
          </Row>
        </div>
      </section>

      <section>
        <div id="faq" className="my-0 mx-auto max-w-[800px] py-20 ">
          <div className="grid gap-y-14 px-6">
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
