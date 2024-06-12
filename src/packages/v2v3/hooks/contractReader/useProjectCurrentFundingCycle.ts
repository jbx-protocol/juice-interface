import { V2V3ProjectContractsContext } from 'packages/v2v3/contexts/ProjectContracts/V2V3ProjectContractsContext'
import {
  V2V3FundingCycle,
  V2V3FundingCycleMetadata,
} from 'packages/v2v3/models/fundingCycle'
import { useContext } from 'react'

import useV2ContractReader from './useV2ContractReader'

export default function useProjectCurrentFundingCycle({
  projectId,
}: {
  projectId?: number
}) {
  const { contracts } = useContext(V2V3ProjectContractsContext)

  return useV2ContractReader<[V2V3FundingCycle, V2V3FundingCycleMetadata]>({
    contract: contracts?.JBController,
    functionName: 'currentFundingCycleOf',
    args: projectId ? [projectId] : null,
  })
}
