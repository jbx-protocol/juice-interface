import { V2ContractName } from 'models/v2/contracts'
import { V2FundingCycle, V2FundingCycleMetadata } from 'models/v2/fundingCycle'

import useV2ContractReader from './V2ContractReader'

export default function useProjectCurrentFundingCycle({
  projectId,
  useDeprecatedContract,
}: {
  projectId?: number
  useDeprecatedContract?: boolean
}) {
  return useV2ContractReader<[V2FundingCycle, V2FundingCycleMetadata]>({
    contract: useDeprecatedContract
      ? V2ContractName.DeprecatedJBController
      : V2ContractName.JBController,
    functionName: 'currentFundingCycleOf',
    args: projectId ? [projectId] : null,
  })
}
