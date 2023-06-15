import { AnnouncementLauncher } from 'contexts/Announcements/AnnouncementLauncher'
import { NftRewardsContext } from 'contexts/NftRewards/NftRewardsContext'
import { TransactionProvider } from 'contexts/Transaction/TransactionProvider'
import { useContext } from 'react'
import { Cart } from './components/Cart'
import { CoverPhoto } from './components/CoverPhoto'
import { CurrentCycleCard } from './components/CurrentCycleCard'
import { FundingCycleCountdownProvider } from './components/FundingCycleCountdown/FundingCycleCountdownProvider'
import { NftRewardsCard } from './components/NftRewardsCard'
import { PayProjectCard } from './components/PayProjectCard'
import { ProjectCartProvider } from './components/ProjectCartProvider'
import { ProjectHeader } from './components/ProjectHeader'
import { ProjectTabs } from './components/ProjectTabs'
import { SuccessPayView } from './components/SuccessPayView'
import { useProjectPageQueries } from './hooks/useProjectPageQueries'

export const ProjectDashboard = () => {
  const {
    nftRewards: { CIDs },
  } = useContext(NftRewardsContext)
  const { projectPayReceipt } = useProjectPageQueries()
  return (
    <TransactionProvider>
      <AnnouncementLauncher>
        <FundingCycleCountdownProvider>
          <ProjectCartProvider>
            {/* // TODO: Remove pb-48, just there for testing */}
            <div className="flex w-full flex-col items-center pb-48">
              {projectPayReceipt !== undefined ? (
                <SuccessPayView />
              ) : (
                <>
                  <CoverPhoto />
                  <div className="flex w-full justify-center px-6">
                    <div className="flex w-full max-w-6xl flex-col">
                      <ProjectHeader />
                      <div className="mt-10 flex w-full gap-6">
                        <PayProjectCard className="flex-1" />
                        {CIDs?.length ? <NftRewardsCard /> : null}
                        <CurrentCycleCard />
                      </div>
                      <ProjectTabs className="mt-16" />
                    </div>
                  </div>
                </>
              )}
            </div>
            <Cart />
          </ProjectCartProvider>
        </FundingCycleCountdownProvider>
      </AnnouncementLauncher>
    </TransactionProvider>
  )
}
