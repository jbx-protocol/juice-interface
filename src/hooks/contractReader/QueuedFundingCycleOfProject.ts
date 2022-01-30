import { BigNumber, BigNumberish } from 'ethers'
import { ContractName } from 'models/contract-name'
import { FundingCycle } from 'models/funding-cycle'

import useContractReader from './ContractReader'

/** Returns queued funding cycle for project. */
export default function useQueuedFundingCycleOfProject(
  projectId: BigNumberish | undefined,
) {
  return useContractReader<FundingCycle>({
    contract: ContractName.FundingCycles,
    functionName: 'queuedOf',
    args: projectId ? [BigNumber.from(projectId).toHexString()] : null,
    updateOn: projectId
      ? [
          {
            contract: ContractName.FundingCycles,
            eventName: 'Configure',
            topics: [[], BigNumber.from(projectId).toHexString()],
          },
        ]
      : undefined,
  })
}
