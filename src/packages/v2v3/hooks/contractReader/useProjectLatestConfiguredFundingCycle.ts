import { V2V3ProjectContractsContext } from 'packages/v2v3/contexts/ProjectContracts/V2V3ProjectContractsContext'
import {
  BallotState,
  V2V3FundingCycle,
  V2V3FundingCycleMetadata,
} from 'packages/v2v3/models/fundingCycle'
import { useContext } from 'react'
import useV2ContractReader from './useV2ContractReader'

type LatestConfiguredFundingCycleOfResult = {
  fundingCycle: V2V3FundingCycle
  metadata: V2V3FundingCycleMetadata
  ballotState: BallotState
}

export function useProjectLatestConfiguredFundingCycle({
  projectId,
}: {
  projectId?: number
}) {
  const {
    contracts: { JBController },
  } = useContext(V2V3ProjectContractsContext)

  return useV2ContractReader<LatestConfiguredFundingCycleOfResult>({
    contract: JBController,
    functionName: 'latestConfiguredFundingCycleOf',
    args: projectId ? [projectId] : null,
  })
}
