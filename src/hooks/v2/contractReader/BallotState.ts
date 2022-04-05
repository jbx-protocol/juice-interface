import { V2UserContext } from 'contexts/v2/userContext'
import { BigNumber } from '@ethersproject/bignumber'
import { BallotState } from 'models/ballot-state'
import { useContext } from 'react'

import useV2ContractReader from './V2ContractReader'

export function useBallotState(projectId: BigNumber | undefined) {
  const { contracts } = useContext(V2UserContext)

  return useV2ContractReader<BallotState>({
    contract: contracts?.JBFundingCycleStore,
    functionName: 'currentBallotStateOf',
    args: projectId ? [projectId.toHexString()] : null,
  })
}
