import { V2ContractName } from 'models/v2/contracts'
import { V2FundingCycle, V2FundingCycleMetadata } from 'models/v2/fundingCycle'

import useV2ContractReader from './V2ContractReader'

export default function useDeprecatedProjectCurrentFundingCycle({
  projectId,
}: {
  projectId?: number
}) {
  return useV2ContractReader<[V2FundingCycle, V2FundingCycleMetadata]>({
    contract: V2ContractName.DeprecatedJBController,
    functionName: 'currentFundingCycleOf',
    args: projectId ? [projectId] : null,
  })
}
