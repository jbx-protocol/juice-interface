import { Col } from 'antd'
import { NftRewardsSection } from 'components/NftRewards/NftRewardsSection'
import { PayProjectForm } from 'components/Project/PayProjectForm'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useValidatePrimaryEthTerminal } from 'hooks/v2v3/ValidatePrimaryEthTerminal'
import { useContext } from 'react'
import ProjectActivity from './ProjectActivity'
import { COL_SIZE_MD } from './V2V3Project'

export function ProjectPageRightCol({
  hasNftRewards,
}: {
  hasNftRewards: boolean
}) {
  // TODO: should have hook for this (repeated in ProjectPageMobile)
  const { fundingCycle } = useContext(V2V3ProjectContext)
  const hasCurrentFundingCycle = fundingCycle?.number.gt(0)
  const isPrimaryETHTerminalValid = useValidatePrimaryEthTerminal()

  const payFormDisabled = !hasCurrentFundingCycle || !isPrimaryETHTerminalValid

  return (
    <Col md={COL_SIZE_MD} xs={24}>
      <section className="mt-12 mb-6">
        <PayProjectForm disabled={payFormDisabled} />
      </section>

      <div className="flex flex-col">
        {hasNftRewards ? (
          <div className="mt-6">
            <NftRewardsSection />
          </div>
        ) : null}
        <section className="mt-6">
          <ProjectActivity />
        </section>
      </div>
    </Col>
  )
}
