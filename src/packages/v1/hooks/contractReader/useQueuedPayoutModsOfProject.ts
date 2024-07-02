import { V1ContractName } from 'packages/v1/models/contracts'
import { PayoutMod } from 'packages/v1/models/mods'
import { useMemo } from 'react'
import { BigintIsh, toHexString } from 'utils/bigNumbers'

import useContractReader from './useContractReader'

/** Returns queued payout mods for project with `projectId`. `queuedConfigured`: configured property of queued funding cycle. */
export default function useQueuedPayoutModsOfProject(
  projectId: BigintIsh | undefined,
  queuedConfigured: BigintIsh | undefined,
) {
  return useContractReader<PayoutMod[]>({
    contract: V1ContractName.ModStore,
    functionName: 'payoutModsOf',
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
                eventName: 'SetPayoutMod',
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
