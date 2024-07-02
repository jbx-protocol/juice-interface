import { V1ContractName } from 'models/v1/contracts'
import { PayoutMod } from 'models/v1/mods'
import { useMemo } from 'react'
import { BigintIsh, toHexString } from 'utils/bigNumbers'

import useContractReader from './useContractReader'

/** Returns current payout mods for project with `projectId`. `currentConfigured`: configured property of current funding cycle. */
export default function useCurrentPayoutModsOfProject(
  projectId: BigintIsh | undefined,
  currentConfigured: BigintIsh | undefined,
) {
  return useContractReader<PayoutMod[]>({
    contract: V1ContractName.ModStore,
    functionName: 'payoutModsOf',
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
                eventName: 'SetPayoutMod',
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
