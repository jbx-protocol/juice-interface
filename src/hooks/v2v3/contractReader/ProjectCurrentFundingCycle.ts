import { V2V3ProjectContractsContext } from 'contexts/v2v3/V2V3ProjectContractsContext'
import {
  V2V3FundingCycle,
  V2V3FundingCycleMetadata,
} from 'models/v2v3/fundingCycle'
import { useContext } from 'react'

import useV2ContractReader from './V2ContractReader'

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
