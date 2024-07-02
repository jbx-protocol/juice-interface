import { V1ContractName } from 'models/v1/contracts'
import { TicketMod } from 'models/v1/mods'
import { useMemo } from 'react'
import { BigintIsh, toHexString } from 'utils/bigNumbers'

import useContractReader from './useContractReader'

/** Returns queued ticket mods for project with `projectId`. `queuedConfigured`: configured property of queued funding cycle. */
export default function useQueuedTicketModsOfProject(
  projectId: BigintIsh | undefined,
  queuedConfigured: BigintIsh | undefined,
) {
  return useContractReader<TicketMod[]>({
    contract: V1ContractName.ModStore,
    functionName: 'ticketModsOf',
    args:
      projectId && queuedConfigured
        ? [
            toHexString(BigInt(projectId)),
            toHexString(BigInt(queuedConfigured)),
          ]
        : null,
    updateOn: useMemo(
      () =>
        projectId && queuedConfigured
          ? [
              {
                contract: V1ContractName.ModStore,
                eventName: 'SetTicketMod',
                topics: [
                  toHexString(BigInt(projectId)),
                  toHexString(BigInt(queuedConfigured)),
                ],
              },
            ]
          : [],
      [projectId, queuedConfigured],
    ),
  })
}
