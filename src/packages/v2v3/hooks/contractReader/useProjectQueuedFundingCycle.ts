import { V2V3ProjectContractsContext } from 'packages/v2v3/contexts/ProjectContracts/V2V3ProjectContractsContext'
import {
  V2V3FundingCycle,
  V2V3FundingCycleMetadata,
} from 'packages/v2v3/models/fundingCycle'
import { useContext } from 'react'
import useV2ContractReader from './useV2ContractReader'

type V2V3QueuedFundingCycleOfResult = {
  fundingCycle: V2V3FundingCycle
  metadata: V2V3FundingCycleMetadata
}

export default function useProjectQueuedFundingCycle({
  projectId,
}: {
  projectId?: number
}) {
  const { contracts } = useContext(V2V3ProjectContractsContext)

  const { data, loading } = useV2ContractReader<V2V3QueuedFundingCycleOfResult>(
    {
      contract: contracts.JBController,
      functionName: 'queuedFundingCycleOf',
      args: projectId ? [projectId] : null,
    },
  )

  if (data && data.fundingCycle.start === BigInt(0)) {
    return { data: undefined, loading: false }
  }
  return {
    data,
    loading,
  }
}
