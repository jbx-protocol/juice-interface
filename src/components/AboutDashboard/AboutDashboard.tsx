import { Footer } from 'components/Footer/Footer'
import { AboutTheProtocolSection } from './components/AboutTheProtocolSection'
import { BuiltByTheBestSection } from './components/BuiltByTheBestSection'
import { FindOutMoreSection } from './components/FindOutMoreSection'
import { HeroSection } from './components/HeroSection'
import { JuiceboxDaoSection } from './components/JuiceboxDaoSection'
import { OurMissionSection } from './components/OurMissionSection'
import { WhatDoWeValueSection } from './components/WhatDoWeValueSection'

export const AboutDashboard = () => {
  return (
    <>
      <div className="[&>*:nth-child(even)]:bg-smoke-50 dark:[&>*:nth-child(even)]:bg-slate-700 [&>*:nth-child(odd)]:bg-white dark:[&>*:nth-child(odd)]:bg-slate-900">
        <HeroSection />
        <OurMissionSection />
        <AboutTheProtocolSection />
        <JuiceboxDaoSection />
        <WhatDoWeValueSection />
        <BuiltByTheBestSection />
        <FindOutMoreSection />
      </div>
      <Footer />
    </>
  )
}
