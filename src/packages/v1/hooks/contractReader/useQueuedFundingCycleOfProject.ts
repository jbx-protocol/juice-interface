import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { V1ContractName } from 'packages/v1/models/contracts'
import { V1FundingCycle } from 'packages/v1/models/fundingCycle'
import useContractReader from './useContractReader'

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
