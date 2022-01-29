import { BigNumber, BigNumberish } from 'ethers'
import { JuiceboxV1ContractName } from 'models/v1/contracts'
import { useMemo } from 'react'

import useContractReader from './ContractReader'

/** Returns address of ERC20 token issued for project with `projectId`. */
export default function useTokenAddressOfProject(
  projectId: BigNumberish | undefined,
) {
  return useContractReader<string>({
    contract: JuiceboxV1ContractName.TicketBooth,
    functionName: 'ticketsOf',
    args: projectId ? [BigNumber.from(projectId).toHexString()] : null,
    updateOn: useMemo(
      () => [
        {
          contract: JuiceboxV1ContractName.TicketBooth,
          eventName: 'Issue',
          topics: projectId
            ? [BigNumber.from(projectId).toHexString()]
            : undefined,
        },
      ],
      [projectId],
    ),
  })
}
