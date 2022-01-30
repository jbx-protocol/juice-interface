import { BigNumber, BigNumberish } from 'ethers'
import { JuiceboxV1ContractName } from 'models/v1/contracts'
import { PayoutMod } from 'models/mods'
import { useMemo } from 'react'

import useContractReader from './ContractReader'

/** Returns queued payout mods for project with `projectId`. `queuedConfigured`: configured property of queued funding cycle. */
export default function useQueuedPayoutModsOfProject(
  projectId: BigNumberish | undefined,
  queuedConfigured: BigNumberish | undefined,
) {
  return useContractReader<PayoutMod[]>({
    contract: JuiceboxV1ContractName.ModStore,
    functionName: 'payoutModsOf',
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
                contract: JuiceboxV1ContractName.ModStore,
                eventName: 'SetPayoutMod',
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
