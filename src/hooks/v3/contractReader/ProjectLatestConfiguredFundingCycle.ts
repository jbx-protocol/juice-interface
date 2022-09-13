import { V3ContractName } from 'models/v3/contracts'
import {
  BallotState,
  V3FundingCycle,
  V3FundingCycleMetadata,
} from 'models/v3/fundingCycle'

import useV3ContractReader from './V3ContractReader'

export function useProjectLatestConfiguredFundingCycle({
  projectId,
}: {
  projectId?: number
}) {
  return useV3ContractReader<
    [V3FundingCycle, V3FundingCycleMetadata, BallotState]
  >({
    contract: V3ContractName.JBController,
    functionName: 'latestConfiguredFundingCycleOf',
    args: projectId ? [projectId] : null,
  })
}
