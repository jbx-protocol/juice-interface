import { Footer } from 'components/Footer'
import { AnnouncementLauncher } from 'contexts/Announcements/AnnouncementLauncher'
import { TransactionProvider } from 'contexts/Transaction/TransactionProvider'
import { useHasNftRewards } from 'hooks/JB721Delegate/useHasNftRewards'
import { twMerge } from 'tailwind-merge'
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
  const { projectPayReceipt } = useProjectPageQueries()

  const { value: hasNftRewards } = useHasNftRewards()
  const shouldShowNftCard = hasNftRewards

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
                      <ProjectHeader className="mt-12 px-4 md:mt-4 md:px-0" />
                      <div className="mt-10 flex w-full flex-col gap-4 px-4 md:flex-row md:px-0">
                        <PayProjectCard className="flex-1" />
                        {shouldShowNftCard ? <NftRewardsCard /> : null}
                        <CurrentCycleCard
                          className={twMerge(
                            'hidden w-full md:max-w-sm',
                            shouldShowNftCard ? 'lg:block' : 'md:block',
                          )}
                        />
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
