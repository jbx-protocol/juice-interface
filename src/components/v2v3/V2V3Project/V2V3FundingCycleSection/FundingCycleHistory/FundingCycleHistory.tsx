import { Trans } from '@lingui/macro'
import { Space } from 'antd'
import Loading from 'components/Loading'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { V2V3ProjectContractsContext } from 'contexts/v2v3/V2V3ProjectContractsContext'
import {
  V2V3FundingCycle,
  V2V3FundingCycleMetadata,
} from 'models/v2v3/fundingCycle'
import { useContext, useEffect, useState } from 'react'
import { PastFundingCycle } from './PastFundingCycle'
import { fetchPastFundingCycles } from './utils'

export function FundingCycleHistory() {
  const { projectId } = useContext(ProjectMetadataContext)
  const {
    contracts: { JBController },
  } = useContext(V2V3ProjectContractsContext)
  const { fundingCycle: currentFundingCycle } = useContext(V2V3ProjectContext)

  const [pastFundingCycles, setPastFundingCycles] = useState<
    [V2V3FundingCycle, V2V3FundingCycleMetadata][]
  >([])

  useEffect(() => {
    async function loadPastFundingCycles() {
      if (!projectId || !currentFundingCycle || !JBController) return

      const pastFundingCycles = await fetchPastFundingCycles({
        projectId,
        currentFundingCycle,
        JBController,
      })

      setPastFundingCycles(pastFundingCycles)
    }

    loadPastFundingCycles()
  }, [JBController, projectId, currentFundingCycle])

  if (!projectId || !currentFundingCycle || !currentFundingCycle?.number)
    return null

  const allCyclesLoaded =
    pastFundingCycles.length >= currentFundingCycle.number.toNumber() - 1

  if (!allCyclesLoaded) return <Loading />
  if (!pastFundingCycles.length)
    return (
      <div>
        <Trans>No past funding cycles</Trans>
      </div>
    )

  return (
    <Space
      direction="vertical"
      size="large"
      style={{ width: '100%', maxHeight: '80vh', overflow: 'auto' }}
    >
      {pastFundingCycles.map(([fundingCycle, fundingCycleMetadata]) => (
        <PastFundingCycle
          key={fundingCycle.configuration.toString()}
          fundingCycle={fundingCycle}
          fundingCycleMetadata={fundingCycleMetadata}
        />
      ))}
    </Space>
  )
}
