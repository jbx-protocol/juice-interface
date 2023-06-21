import { Footer } from 'components/Footer'
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
            <div className="flex w-full flex-col items-center pb-48">
              {projectPayReceipt !== undefined ? (
                <SuccessPayView />
              ) : (
                <>
                  <CoverPhoto />
                  <div className="flex w-full justify-center md:px-6">
                    <div className="flex w-full max-w-6xl flex-col">
                      <ProjectHeader className="mt-4 px-4 md:px-0" />
                      <div className="mt-10 flex w-full flex-col gap-6 px-4 md:flex-row md:px-0">
                        <PayProjectCard className="flex-1" />
                        {CIDs?.length ? <NftRewardsCard /> : null}
                        <CurrentCycleCard />
                      </div>
                      <ProjectTabs className="mt-8" />
                    </div>
                  </div>
                </>
              )}
            </div>
            <Footer />
            <Cart />
          </ProjectCartProvider>
        </FundingCycleCountdownProvider>
      </AnnouncementLauncher>
    </TransactionProvider>
  )
}
