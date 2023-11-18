import { Footer } from 'components/Footer/Footer'
import { BuiltForSection } from 'components/Home/BuiltForSection/BuiltForSection'
import { ConclusionSection } from 'components/Home/ConclusionSection/ConclusionSection'
import { FaqSection } from 'components/Home/FaqSection'
import { HowJuiceboxWorksSection } from 'components/Home/HowJuiceboxWorksSection/HowJuiceboxWorksSection'
import { JuicyPicksSection } from 'components/Home/JuicyPicksSection/JuicyPicksSection'
import { StatsSection } from 'components/Home/StatsSection'
import { SuccessStoriesSection } from 'components/Home/SuccessStoriesSection/SuccessStoriesSection'
import { TopSection } from 'components/Home/TopSection/TopSection'
import { WhyJuiceboxSection } from 'components/Home/WhyJuiceboxSection/WhyJuiceboxSection'
import { readNetwork } from 'constants/networks'
import { NetworkName } from 'models/networkName'

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
