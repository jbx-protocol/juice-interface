import { V2V3ContractName } from 'models/v2v3/contracts'
import {
  V2V3FundingCycle,
  V2V3FundingCycleMetadata,
} from 'models/v2v3/fundingCycle'

import useV2ContractReader from './V2ContractReader'

export default function useProjectCurrentFundingCycle({
  projectId,
  useDeprecatedContract,
}: {
  projectId?: number
  useDeprecatedContract?: boolean
}) {
  return useV2ContractReader<[V2V3FundingCycle, V2V3FundingCycleMetadata]>({
    contract: useDeprecatedContract
      ? V2V3ContractName.DeprecatedJBController
      : V2V3ContractName.JBController,
    functionName: 'currentFundingCycleOf',
    args: projectId ? [projectId] : null,
  })
}
