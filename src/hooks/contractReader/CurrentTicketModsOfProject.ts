import { BigNumber, BigNumberish } from 'ethers'
import { ContractName } from 'models/contract-name'
import { TicketMod } from 'models/mods'
import { useMemo } from 'react'

import useContractReader from './ContractReader'

/** Returns current ticket mods for project with `projectId`. `currentConfigured`: configured property of current funding cycle. */
export default function useCurrentTicketModsOfProject(
  projectId: BigNumberish | undefined,
  currentConfigured: BigNumberish | undefined,
) {
  return useContractReader<TicketMod[]>({
    contract: ContractName.ModStore,
    functionName: 'ticketModsOf',
    args:
      projectId && currentConfigured
        ? [
            BigNumber.from(projectId).toHexString(),
            BigNumber.from(currentConfigured).toHexString(),
          ]
        : null,
    updateOn: useMemo(
      () =>
        projectId && currentConfigured
          ? [
              {
                contract: ContractName.ModStore,
                eventName: 'SetTicketMod',
                topics: [
                  BigNumber.from(projectId).toHexString(),
                  BigNumber.from(currentConfigured).toHexString(),
                ],
              },
            ]
          : [],
      [projectId, currentConfigured],
    ),
  })
}
