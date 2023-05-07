import { BigNumber, BigNumberish } from 'ethers'
import { V1ContractName } from 'models/v1/contracts'
import { TicketMod } from 'models/v1/mods'
import { useMemo } from 'react'

import useContractReader from './useContractReader'

/** Returns queued ticket mods for project with `projectId`. `queuedConfigured`: configured property of queued funding cycle. */
export default function useQueuedTicketModsOfProject(
  projectId: BigNumberish | undefined,
  queuedConfigured: BigNumberish | undefined,
) {
  return useContractReader<TicketMod[]>({
    contract: V1ContractName.ModStore,
    functionName: 'ticketModsOf',
    args:
      projectId && queuedConfigured
        ? [
            BigNumber.from(projectId).toHexString(),
            BigNumber.from(queuedConfigured).toHexString(),
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
                  BigNumber.from(projectId).toHexString(),
                  BigNumber.from(queuedConfigured).toHexString(),
                ],
              },
            ]
          : [],
      [projectId, queuedConfigured],
    ),
  })
}
