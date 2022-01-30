import { BigNumber, BigNumberish } from 'ethers'
import { JuiceboxV1ContractName } from 'models/v1/contracts'
import { TicketMod } from 'models/mods'
import { useMemo } from 'react'

import useContractReader from './ContractReader'

/** Returns current ticket mods for project with `projectId`. `currentConfigured`: configured property of current funding cycle. */
export default function useCurrentTicketModsOfProject(
  projectId: BigNumberish | undefined,
  currentConfigured: BigNumberish | undefined,
) {
  return useContractReader<TicketMod[]>({
    contract: JuiceboxV1ContractName.ModStore,
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
                contract: JuiceboxV1ContractName.ModStore,
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
