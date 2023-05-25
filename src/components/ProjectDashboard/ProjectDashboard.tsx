import { CoverPhoto } from './components/CoverPhoto'
import { CurrentCycleCard } from './components/CurrentCycleCard'
import { NftRewardsCard } from './components/NftRewardsCard'
import { PayProjectCard } from './components/PayProjectCard'
import { ProjectHeader } from './components/ProjectHeader'
import { ProjectTabs } from './components/ProjectTabs'

export const ProjectDashboard = () => {
  return (
    <div className="flex w-full flex-col items-center">
      <CoverPhoto />
      <div className="flex w-full justify-center px-6">
        <div className="flex w-full max-w-7xl flex-col">
          <ProjectHeader />
          <div className="mt-10 flex w-full gap-6">
            <PayProjectCard className="flex-1" />
            <NftRewardsCard className="flex-1" />
            <CurrentCycleCard className="flex-1" />
          </div>
          <ProjectTabs />
        </div>
      </div>
    </div>
  )
}
