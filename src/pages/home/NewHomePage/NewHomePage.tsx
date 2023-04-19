import { Footer } from 'components/Footer/Footer'
import { StatsSection } from '../StatsSection'
import { BuiltForSection } from './BuiltForSection/BuiltForSection'
import { ConclusionSection } from './ConclusionSection/ConclusionSection'
import { FaqSection } from './FaqSection'
import { HowJuiceboxWorksSection } from './HowJuiceboxWorksSection/HowJuiceboxWorksSection'
import { JuicyPicksSection } from './JuicyPicksSection/JuicyPicksSection'
import { SuccessStoriesSection } from './SuccessStoriesSection/SuccessStoriesSection'
import { TopSection } from './TopSection/TopSection'
import { WhyJuiceboxSection } from './WhyJuiceboxSection'

export const DEFAULT_HOMEPAGE_GUTTER: [number, number] = [32, 32]

export function NewHomePage() {
  return (
    <>
      <div className="[&>*:nth-child(even)]:bg-smoke-50 dark:[&>*:nth-child(even)]:bg-slate-700">
        <TopSection />

        <StatsSection />

        <BuiltForSection />

        <SuccessStoriesSection />

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
