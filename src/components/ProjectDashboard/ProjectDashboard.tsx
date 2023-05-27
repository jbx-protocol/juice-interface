import { Cart } from './components/Cart'
import { CoverPhoto } from './components/CoverPhoto'
import { CurrentCycleCard } from './components/CurrentCycleCard'
import { NftRewardsCard } from './components/NftRewardsCard'
import { PayProjectCard } from './components/PayProjectCard'
import { ProjectHeader } from './components/ProjectHeader'
import { ProjectTabs } from './components/ProjectTabs'

export const ProjectDashboard = () => {
  return (
    <>
      {/* // TODO: Remove pb-24, just there for testing */}
      <div className="flex w-full flex-col items-center pb-24">
        <CoverPhoto />
        <div className="flex w-full justify-center px-6">
          <div className="flex w-full max-w-7xl flex-col">
            <ProjectHeader />
            <div className="mt-10 flex w-full gap-6">
              <PayProjectCard className="flex-1" />
              <NftRewardsCard />
              <CurrentCycleCard />
            </div>
            <ProjectTabs className="mt-16" />
          </div>
        </div>
      </div>
      <Cart />
    </>
  )
}
