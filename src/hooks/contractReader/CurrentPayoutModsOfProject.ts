import { BigNumber, BigNumberish } from 'ethers'
import { ContractName } from 'models/contract-name'
import { PayoutMod } from 'models/mods'
import { useMemo } from 'react'

import useContractReader from './ContractReader'

/** Returns current payout mods for project with `projectId`. `currentConfigured`: configured property of current funding cycle. */
export default function useCurrentPayoutModsOfProject(
  projectId: BigNumberish | undefined,
  currentConfigured: BigNumberish | undefined,
) {
  return useContractReader<PayoutMod[]>({
    contract: ContractName.ModStore,
    functionName: 'payoutModsOf',
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
                eventName: 'SetPayoutMod',
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
