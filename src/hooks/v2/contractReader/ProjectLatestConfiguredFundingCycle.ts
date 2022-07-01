import { V2ContractName } from 'models/v2/contracts'
import {
  BallotState,
  V2FundingCycle,
  V2FundingCycleMetadata,
} from 'models/v2/fundingCycle'

import useV2ContractReader from './V2ContractReader'

export function useProjectLatestConfiguredFundingCycle({
  projectId,
}: {
  projectId?: number
}) {
  return useV2ContractReader<
    [V2FundingCycle, V2FundingCycleMetadata, BallotState]
  >({
    contract: V2ContractName.JBController,
    functionName: 'latestConfiguredFundingCycleOf',
    args: projectId ? [projectId] : null,
  })
}
