import { V2BallotState } from 'models/ballot'

import { V2V3ContractName } from 'packages/v2v3/models/contracts'

import useV2ContractReader from './useV2ContractReader'

export function useBallotState(projectId: number | undefined) {
  return useV2ContractReader<V2BallotState>({
    contract: V2V3ContractName.JBFundingCycleStore,
    functionName: 'currentBallotStateOf',
    args: projectId ? [projectId] : null,
  })
}
