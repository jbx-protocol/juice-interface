import { V2BallotState } from 'models/ballot'

import { V2V3ContractName } from 'models/v2v3/contracts'

import useV2ContractReader from './V2ContractReader'

export function useBallotState(projectId: number | undefined) {
  return useV2ContractReader<V2BallotState>({
    contract: V2V3ContractName.JBFundingCycleStore,
    functionName: 'currentBallotStateOf',
    args: projectId ? [projectId] : null,
  })
}
