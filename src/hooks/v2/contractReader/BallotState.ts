import { BigNumber } from '@ethersproject/bignumber'
import { BallotState } from 'models/ballot'

import { V2ContractName } from 'models/v2/contracts'

import useV2ContractReader from './V2ContractReader'

export function useBallotState(projectId: BigNumber | undefined) {
  return useV2ContractReader<BallotState>({
    contract: V2ContractName.JBFundingCycleStore,
    functionName: 'currentBallotStateOf',
    args: projectId ? [projectId.toHexString()] : null,
  })
}
