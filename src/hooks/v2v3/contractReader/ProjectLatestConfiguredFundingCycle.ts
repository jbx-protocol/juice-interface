import { V2V3ContractName } from 'models/v2v3/contracts'
import {
  BallotState,
  V2V3FundingCycle,
  V2V3FundingCycleMetadata,
} from 'models/v2v3/fundingCycle'
import useV2ContractReader from './V2ContractReader'

export function useProjectLatestConfiguredFundingCycle({
  projectId,
}: {
  projectId?: number
}) {
  return useV2ContractReader<
    [V2V3FundingCycle, V2V3FundingCycleMetadata, BallotState]
  >({
    contract: V2V3ContractName.JBController,
    functionName: 'latestConfiguredFundingCycleOf',
    args: projectId ? [projectId] : null,
  })
}
