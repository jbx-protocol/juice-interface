import { NftRewardsSection } from 'components/NftRewards/NftRewardsSection'
import { PayProjectForm } from 'components/Project/PayProjectForm'
import ProjectActivity from './ProjectActivity'
import { ProjectPageTabs } from './ProjectPageTabs/ProjectPageTabs'

export function ProjectPageMobile({
  hasNftRewards,
}: {
  hasNftRewards: boolean
}) {
  return (
    <>
      <section>
        <PayProjectForm />
      </section>
      {hasNftRewards ? (
        <div className="mt-5">
          <NftRewardsSection />
        </div>
      ) : null}
      <ProjectPageTabs hasNftRewards={hasNftRewards} />
      <section className="mt-10">
        <ProjectActivity />
      </section>
    </>
  )
}
