import { Trans } from '@lingui/macro'
import { Space } from 'antd'
import Loading from 'components/Loading'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { V2V3ContractsContext } from 'contexts/v2v3/V2V3ContractsContext'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import {
  V2FundingCycleMetadata,
  V2V3FundingCycle,
} from 'models/v2/fundingCycle'
import { useContext, useEffect, useState } from 'react'
import { PastFundingCycle } from './PastFundingCycle'
import { fetchPastFundingCycles } from './utils'

export default function FundingCycleHistory() {
  const { fundingCycle: currentFundingCycle } = useContext(V2V3ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)
  const { contracts } = useContext(V2V3ContractsContext)

  const [pastFundingCycles, setPastFundingCycles] = useState<
    [V2V3FundingCycle, V2FundingCycleMetadata][]
  >([])

  useEffect(() => {
    async function loadPastFundingCycles() {
      if (!projectId || !currentFundingCycle || !contracts) return

      const pastFundingCycles = await fetchPastFundingCycles({
        projectId,
        currentFundingCycle,
        contracts,
      })

      setPastFundingCycles(pastFundingCycles)
    }

    loadPastFundingCycles()
  }, [contracts, projectId, currentFundingCycle])

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
