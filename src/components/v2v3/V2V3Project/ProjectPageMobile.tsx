import { NftRewardsSection } from 'components/NftRewards/NftRewardsSection'
import { useHasNftRewards } from 'hooks/JB721Delegate/HasNftRewards'

import ProjectActivity from './ProjectActivity'
import { ProjectPageTabs } from './ProjectPageTabs'
import { V2V3PayProjectForm } from './V2V3PayProjectForm'

export function ProjectPageMobile() {
  const { value: hasNftRewards } = useHasNftRewards()
  return (
    <>
      <section>
        <V2V3PayProjectForm />
      </section>
      {hasNftRewards ? (
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
