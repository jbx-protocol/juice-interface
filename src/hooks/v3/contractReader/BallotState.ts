import { V3BallotState } from 'models/ballot'
import { V3ContractName } from 'models/v3/contracts'
import useV3ContractReader from './V3ContractReader'

export function useBallotState(projectId: number | undefined) {
  return useV3ContractReader<V3BallotState>({
    contract: V3ContractName.JBFundingCycleStore,
    functionName: 'currentBallotStateOf',
    args: projectId ? [projectId] : null,
  })
}
