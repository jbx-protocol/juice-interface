import { Trans } from '@lingui/macro'
import { ErrorBoundaryCallout } from 'components/ErrorBoundaryCallout'
import { NftRewardsSection } from 'components/NftRewards/NftRewardsSection'
import { useNftRewardsEnabledForPay } from 'hooks/JB721Delegate/NftRewardsEnabledForPay'
import ProjectActivity from './ProjectActivity'
import { ProjectPageTabs } from './ProjectPageTabs'
import { V2V3PayProjectForm } from './V2V3PayProjectForm'

export function ProjectPageMobile() {
  const nftRewardsEnabled = useNftRewardsEnabledForPay()

  return (
    <>
      <section>
        <V2V3PayProjectForm />
      </section>
      {nftRewardsEnabled ? (
        <div className="mt-5">
          <ErrorBoundaryCallout
            message={
              <div>
                <Trans>NFTs failed to load.</Trans>
              </div>
            }
          >
            <NftRewardsSection />
          </ErrorBoundaryCallout>
        </div>
      ) : null}

      <ErrorBoundaryCallout
        message={<Trans>Project details failed to load.</Trans>}
      >
        <ProjectPageTabs />
      </ErrorBoundaryCallout>

      <section className="mt-10">
        <ErrorBoundaryCallout
          message={<Trans>Project activity failed to load.</Trans>}
        >
          <ProjectActivity />
        </ErrorBoundaryCallout>
      </section>
    </>
  )
}
