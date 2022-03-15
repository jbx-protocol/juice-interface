import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { V1ContractName } from 'models/v1/contracts'
import { V1FundingCycle } from 'models/v1/fundingCycle'

import useContractReader from './ContractReader'

/** Returns queued funding cycle for project. */
export default function useQueuedFundingCycleOfProject(
  projectId: BigNumberish | undefined,
) {
  return useContractReader<V1FundingCycle>({
    contract: V1ContractName.FundingCycles,
    functionName: 'queuedOf',
    args: projectId ? [BigNumber.from(projectId).toHexString()] : null,
    updateOn: projectId
      ? [
          {
            contract: V1ContractName.FundingCycles,
            eventName: 'Configure',
            topics: [[], BigNumber.from(projectId).toHexString()],
          },
        ]
      : undefined,
  })
}
