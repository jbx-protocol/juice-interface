import { NftRewardsSection } from 'components/NftRewards/NftRewardsSection'
import { PayProjectForm } from 'components/Project/PayProjectForm'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useValidatePrimaryEthTerminal } from 'hooks/v2v3/ValidatePrimaryEthTerminal'
import { useContext } from 'react'
import ProjectActivity from './ProjectActivity'
import { ProjectPageTabs } from './ProjectPageTabs'

export function ProjectPageMobile({
  hasNftRewards,
}: {
  hasNftRewards: boolean
}) {
  const { fundingCycle } = useContext(V2V3ProjectContext)
  const hasCurrentFundingCycle = fundingCycle?.number.gt(0)
  const isPrimaryETHTerminalValid = useValidatePrimaryEthTerminal()

  const payFormDisabled = !hasCurrentFundingCycle || !isPrimaryETHTerminalValid

  return (
    <>
      <section>
        <PayProjectForm disabled={payFormDisabled} />
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
