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
          <NftRewardsSection />
        </div>
      ) : null}
      <ProjectPageTabs />
      <section className="mt-10">
        <ProjectActivity />
      </section>
    </>
  )
}
