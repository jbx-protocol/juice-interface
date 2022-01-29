import { BigNumber, BigNumberish } from 'ethers'
import { JuiceboxV1ContractName } from 'models/v1/contracts'
import { FundingCycle } from 'models/funding-cycle'

import useContractReader from './ContractReader'

/** Returns queued funding cycle for project. */
export default function useQueuedFundingCycleOfProject(
  projectId: BigNumberish | undefined,
) {
  return useContractReader<FundingCycle>({
    contract: JuiceboxV1ContractName.FundingCycles,
    functionName: 'queuedOf',
    args: projectId ? [BigNumber.from(projectId).toHexString()] : null,
    updateOn: projectId
      ? [
          {
            contract: JuiceboxV1ContractName.FundingCycles,
            eventName: 'Configure',
            topics: [[], BigNumber.from(projectId).toHexString()],
          },
        ]
      : undefined,
  })
}
