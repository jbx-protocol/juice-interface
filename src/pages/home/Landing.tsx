import { Footer } from 'components/Footer/Footer'
import { BuiltForSection } from './BuiltForSection/BuiltForSection'
import { ConclusionSection } from './ConclusionSection/ConclusionSection'
import { HowJuiceboxWorksSection } from './HowJuiceboxWorksSection/HowJuiceboxWorksSection'
import { JuicyPicksSection } from './JuicyPicksSection/JuicyPicksSection'
import { StatsSection } from './StatsSection'
import { SuccessStoriesSection } from './SuccessStoriesSection/SuccessStoriesSection'
import { TopSection } from './TopSection/TopSection'
import { WhyJuiceboxSection } from './WhyJuiceboxSection/WhyJuiceboxSection'

export const DEFAULT_HOMEPAGE_GUTTER: [number, number] = [32, 32]

export function Landing() {
  return (
    <div className="[&>*:nth-child(even)]:bg-smoke-50 dark:[&>*:nth-child(even)]:bg-slate-700">
      <TopSection />

      <StatsSection />

      <BuiltForSection />

      <SuccessStoriesSection />

      <HowJuiceboxWorksSection />

      <WhyJuiceboxSection />

      <JuicyPicksSection />

      <ConclusionSection />

      <Footer />
    </div>
  )
}
