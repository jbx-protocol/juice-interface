import { V1ContractName } from 'models/v1/contracts'
import { useMemo } from 'react'
import { BigintIsh, toHexString } from 'utils/bigNumbers'
import useContractReader from './useContractReader'

/** Returns address of ERC20 token issued for project with `projectId`. */
export default function useTokenAddressOfProject(
  projectId: BigintIsh | undefined,
) {
  return useContractReader<string>({
    contract: V1ContractName.TicketBooth,
    functionName: 'ticketsOf',
    args: projectId ? [toHexString(BigInt(projectId))] : null,
    updateOn: useMemo(
      () => [
        {
          contract: V1ContractName.TicketBooth,
          eventName: 'Issue',
          topics: projectId ? [toHexString(BigInt(projectId))] : undefined,
        },
      ],
      [projectId],
    ),
  })
}
