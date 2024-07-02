import { V1ContractName } from 'packages/v1/models/contracts'
import { TicketMod } from 'packages/v1/models/mods'
import { useMemo } from 'react'
import { BigintIsh, toHexString } from 'utils/bigNumbers'

import useContractReader from './useContractReader'

/** Returns current ticket mods for project with `projectId`. `currentConfigured`: configured property of current funding cycle. */
export default function useCurrentTicketModsOfProject(
  projectId: BigintIsh | undefined,
  currentConfigured: BigintIsh | undefined,
) {
  return useContractReader<TicketMod[]>({
    contract: V1ContractName.ModStore,
    functionName: 'ticketModsOf',
    args:
      projectId && currentConfigured
        ? [
            toHexString(BigInt(projectId)),
            toHexString(BigInt(currentConfigured)),
          ]
        : null,
    updateOn: useMemo(
      () =>
        projectId && currentConfigured
          ? [
              {
                contract: V1ContractName.ModStore,
                eventName: 'SetTicketMod',
                topics: [
                  toHexString(BigInt(projectId)),
                  toHexString(BigInt(currentConfigured)),
                ],
              },
            ]
          : [],
      [projectId, currentConfigured],
    ),
  })
}
