import {
  V2FundingCycleMetadata,
  V2V3FundingCycle,
} from 'models/v2/fundingCycle'
import { V2V3ContractName } from 'models/v2v3/contracts'

import useV2ContractReader from './V2ContractReader'

export default function useProjectQueuedFundingCycle({
  projectId,
}: {
  projectId?: number
}) {
  return useV2ContractReader<[V2V3FundingCycle, V2FundingCycleMetadata]>({
    contract: V2V3ContractName.JBController,
    functionName: 'queuedFundingCycleOf',
    args: projectId ? [projectId] : null,
  })
}
