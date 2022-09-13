import { V3ContractName } from 'models/v3/contracts'
import { V3FundingCycle, V3FundingCycleMetadata } from 'models/v3/fundingCycle'

import useV3ContractReader from './V3ContractReader'

export default function useProjectQueuedFundingCycle({
  projectId,
}: {
  projectId?: number
}) {
  return useV3ContractReader<[V3FundingCycle, V3FundingCycleMetadata]>({
    contract: V3ContractName.JBController,
    functionName: 'queuedFundingCycleOf',
    args: projectId ? [projectId] : null,
  })
}
