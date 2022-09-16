import {
  BallotState,
  V2FundingCycleMetadata,
  V2V3FundingCycle,
} from 'models/v2/fundingCycle'
import { V2V3ContractName } from 'models/v2v3/contracts'

import useV2ContractReader from './V2ContractReader'

export function useProjectLatestConfiguredFundingCycle({
  projectId,
}: {
  projectId?: number
}) {
  return useV2ContractReader<
    [V2V3FundingCycle, V2FundingCycleMetadata, BallotState]
  >({
    contract: V2V3ContractName.JBController,
    functionName: 'latestConfiguredFundingCycleOf',
    args: projectId ? [projectId] : null,
  })
}
