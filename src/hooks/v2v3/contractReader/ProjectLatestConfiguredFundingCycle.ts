import { V2V3ProjectContractsContext } from 'contexts/v2v3/V2V3ProjectContractsContext'
import {
  BallotState,
  V2V3FundingCycle,
  V2V3FundingCycleMetadata,
} from 'models/v2v3/fundingCycle'
import { useContext } from 'react'
import useV2ContractReader from './V2ContractReader'

export function useProjectLatestConfiguredFundingCycle({
  projectId,
}: {
  projectId?: number
}) {
  const {
    contracts: { JBController },
  } = useContext(V2V3ProjectContractsContext)

  return useV2ContractReader<
    [V2V3FundingCycle, V2V3FundingCycleMetadata, BallotState]
  >({
    contract: JBController,
    functionName: 'latestConfiguredFundingCycleOf',
    args: projectId ? [projectId] : null,
  })
}
