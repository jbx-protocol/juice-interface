import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { V1ContractName } from 'packages/v1/models/contracts'
import { TicketMod } from 'packages/v1/models/mods'
import { useMemo } from 'react'

import useContractReader from './useContractReader'

/** Returns current ticket mods for project with `projectId`. `currentConfigured`: configured property of current funding cycle. */
export default function useCurrentTicketModsOfProject(
  projectId: BigNumberish | undefined,
  currentConfigured: BigNumberish | undefined,
) {
  return useContractReader<TicketMod[]>({
    contract: V1ContractName.ModStore,
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
                contract: V1ContractName.ModStore,
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
