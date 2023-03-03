import { Trans } from '@lingui/macro'
import { AppWrapper } from 'components/common'
import Faq from './home/Faq'
import { Footer } from './home/Footer'
import { HeroSection } from './home/HeroSection'
import { HowItWorksSection } from './home/HowItWorksSection'
import { NewsletterSection } from './home/NewsletterSection'
import { SectionHeading } from './home/SectionHeading'
import { StatsSection } from './home/StatsSection'
import TagsSpotlightSection from './home/TagsSpotlightSection'
import { TopProjectsSection } from './home/TopProjectsSection'
import TrendingSection from './home/TrendingSection'

function Landing() {
  return (
    <div>
      <HeroSection />

      <StatsSection />

      <TrendingSection />

      <TagsSpotlightSection />

      <TopProjectsSection />

      <HowItWorksSection />

      <NewsletterSection />

      <section>
        <div id="faq" className="my-0 mx-auto max-w-5xl py-20  px-7">
          <SectionHeading className="mb-10 text-left">
            <Trans>FAQ</Trans>
          </SectionHeading>
          <Faq />
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
