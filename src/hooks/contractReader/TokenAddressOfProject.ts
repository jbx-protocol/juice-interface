import { BigNumber, BigNumberish } from 'ethers'
import { ContractName } from 'models/contract-name'
import { useMemo } from 'react'

import useContractReader from './ContractReader'

/** Returns address of ERC20 token issued for project with `projectId`. */
export default function useTokenAddressOfProject(
  projectId: BigNumberish | undefined,
) {
  return useContractReader<string>({
    contract: ContractName.TicketBooth,
    functionName: 'ticketsOf',
    args: projectId ? [BigNumber.from(projectId).toHexString()] : null,
    updateOn: useMemo(
      () => [
        {
          contract: ContractName.TicketBooth,
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
