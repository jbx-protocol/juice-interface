import { V2BallotState } from 'models/ballot'

import { V2ContractName } from 'models/v2/contracts'

import useV2ContractReader from './V2ContractReader'

export function useBallotState(projectId: number | undefined) {
  return useV2ContractReader<V2BallotState>({
    contract: V2ContractName.JBFundingCycleStore,
    functionName: 'currentBallotStateOf',
    args: projectId ? [projectId] : null,
  })
}
