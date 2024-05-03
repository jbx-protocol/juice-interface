import { Footer } from 'components/Footer/Footer'
import { TransactionProvider } from 'contexts/Transaction/TransactionProvider'
import { twMerge } from 'tailwind-merge'
import { BlockedProjectBanner } from './components/BlockedProjectBanner'
import { CoverPhoto } from './components/CoverPhoto/CoverPhoto'
import { FundingCycleCountdownProvider } from './components/FundingCycleCountdown/FundingCycleCountdownProvider'
import { PayRedeemCard } from './components/PayRedeemCard'
import { ProjectCartProvider } from './components/ProjectCartProvider/ProjectCartProvider'
import { ProjectHeader } from './components/ProjectHeader/ProjectHeader'
import { ProjectHeaderCountdown } from './components/ProjectHeaderCountdown'
import { ProjectTabs } from './components/ProjectTabs/ProjectTabs'
import { ProjectUpdatesProvider } from './components/ProjectUpdatesProvider/ProjectUpdatesProvider'
import { SuccessPayView } from './components/SuccessPayView/SuccessPayView'
import { useProjectPageQueries } from './hooks/useProjectPageQueries'

export const ProjectDashboard = () => {
  const { projectPayReceipt } = useProjectPageQueries()

  return (
    <TransactionProvider>
      <FundingCycleCountdownProvider>
        <ProjectCartProvider>
          <ProjectUpdatesProvider>
            <div className="flex w-full flex-col items-center pb-48">
              {projectPayReceipt !== undefined ? (
                <SuccessPayView />
              ) : (
                <>
                  <div className="relative w-full">
                    <CoverPhoto />
                    <ProjectHeaderCountdown />
                  </div>
                  <div className="flex w-full justify-center md:px-6">
                    <div className="flex w-full max-w-6xl flex-col">
                      <ProjectHeader className="mt-12 px-4 md:mt-4 md:px-0" />
                      <BlockedProjectBanner className="mt-10" />
                      <div
                        className={twMerge(
                          'mt-10 flex w-full flex-col gap-4 px-4 md:flex-row md:px-0',
                        )}
                      >
                        <PayRedeemCard className="flex-1" />
                      </div>
                      <ProjectTabs className="mt-8" />
                    </div>
                  </div>
                </>
              )}
            </div>
            <Footer />
          </ProjectUpdatesProvider>
        </ProjectCartProvider>
      </FundingCycleCountdownProvider>
    </TransactionProvider>
  )
}
