import { t, Trans } from '@lingui/macro'
import { Col, Row } from 'antd'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { ReactElement } from 'react'
import {
  NextPageWithLayout,
  StaticAppWrapper,
} from '../components/common/CoreAppWrapper/CoreAppWrapper'
import { BigHeading } from './home/BigHeading'
import { TopProjectsSection } from './home/TopProjectsSection'
import blueBerry from '/public/assets/blueberry-ol.png'
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface NoPropsType {}

const HeroSection = dynamic<NoPropsType>(
  () => import('./home/HeroSection').then(module => module.HeroSection),
  { ssr: true },
)

const StatsSection = dynamic<NoPropsType>(
  () => import('./home/StatsSection').then(module => module.StatsSection),
  { ssr: false },
)

const TrendingSection = dynamic<NoPropsType>(
  () => import('./home/TrendingSection'),
  {
    loading: () => <div>Loading...</div>,
    ssr: false,
  },
)
const Footer = dynamic<NoPropsType>(() => import('./home/Footer'), {
  loading: () => <div>Loading...</div>,
  ssr: false,
})

const HowItWorksSection = dynamic<NoPropsType>(
  () =>
    import('./home/HowItWorksSection').then(module => module.HowItWorksSection),
  {
    loading: () => <div>Loading...</div>,
    ssr: false,
  },
)

const Faq = dynamic<NoPropsType>(() => import('./home/Faq'), {
  loading: () => <div>Loading...</div>,
  ssr: false,
})

const Landing: NextPageWithLayout = () => {
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
                alt="Sexy blueberry with bright pink lipstick spraying a can of spraypaint"
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
Landing.getLayout = function getLayout(page: ReactElement) {
  return <StaticAppWrapper>{page}</StaticAppWrapper>
}

export default Landing
