import { Footer } from 'components/Footer/Footer'
import { readNetwork } from 'constants/networks'
import { NetworkName } from 'models/networkName'
import { BuiltForSection } from './BuiltForSection/BuiltForSection'
import { ConclusionSection } from './ConclusionSection/ConclusionSection'
import { FaqSection } from './FaqSection'
import { HowJuiceboxWorksSection } from './HowJuiceboxWorksSection/HowJuiceboxWorksSection'
import { JuicyPicksSection } from './JuicyPicksSection/JuicyPicksSection'
import { StatsSection } from './StatsSection'
import { SuccessStoriesSection } from './SuccessStoriesSection/SuccessStoriesSection'
import { TopSection } from './TopSection/TopSection'
import { WhyJuiceboxSection } from './WhyJuiceboxSection'

export function HomePage() {
  return (
    <>
      <div className="[&>*:nth-child(even)]:bg-smoke-50 dark:[&>*:nth-child(even)]:bg-slate-700">
        <TopSection />

        <StatsSection />

        <BuiltForSection />

        {readNetwork.name === NetworkName.mainnet && <SuccessStoriesSection />}

        <HowJuiceboxWorksSection />

        <WhyJuiceboxSection />

        <JuicyPicksSection />

        <FaqSection />

        <ConclusionSection />
      </div>
      <Footer />
    </>
  )
}
