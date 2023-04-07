import { Trans } from '@lingui/macro'
import { AppWrapper } from 'components/common'
import { FEATURE_FLAGS } from 'constants/featureFlags'
import { featureFlagEnabled } from 'utils/featureFlags'
import Faq from './home/Faq'
import { Footer } from './home/Footer'
import { HeroSection } from './home/HeroSection'
import { HowItWorksSection } from './home/HowItWorksSection'
import { Landing } from './home/Landing'
import { NewsletterSection } from './home/NewsletterSection'
import { OldSectionHeading } from './home/OldSectionHeading'
import { StatsSection } from './home/StatsSection'
import { TopProjectsSection } from './home/TopProjectsSection'
import TrendingSection from './home/TrendingSection'

function OldLanding() {
  return (
    <div>
      <HeroSection />

      <StatsSection />

      <TrendingSection />

      <TopProjectsSection />

      <HowItWorksSection />

      <NewsletterSection />

      <section>
        <div id="faq" className="my-0 mx-auto max-w-5xl py-20 px-7">
          <OldSectionHeading className="mb-10 text-left">
            <Trans>FAQ</Trans>
          </OldSectionHeading>
          <Faq />
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default function LandingPage() {
  const newLandingEnabled = featureFlagEnabled(FEATURE_FLAGS.NEW_LANDING_PAGE)
  return (
    <AppWrapper>{newLandingEnabled ? <Landing /> : <OldLanding />}</AppWrapper>
  )
}
