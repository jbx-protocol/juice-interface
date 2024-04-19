import { V1ContractName } from 'models/v1/contracts'
import { V1FundingCycle } from 'models/v1/fundingCycle'

import { BigintIsh, toHexString } from 'utils/bigNumbers'
import useContractReader from './useContractReader'

/** Returns queued funding cycle for project. */
export default function useQueuedFundingCycleOfProject(
  projectId: BigintIsh | undefined,
) {
  return useContractReader<V1FundingCycle>({
    contract: V1ContractName.FundingCycles,
    functionName: 'queuedOf',
    args: projectId ? [toHexString(BigInt(projectId))] : null,
    updateOn: projectId
      ? [
          {
            contract: V1ContractName.FundingCycles,
            eventName: 'Configure',
            topics: [[], toHexString(BigInt(projectId))],
          },
        ]
      : undefined,
  })
}
