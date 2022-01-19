import { BigNumber, BigNumberish } from 'ethers'
import { TerminalName } from 'models/terminal-name'
import { useMemo } from 'react'
import { bigNumbersDiff } from 'utils/bigNumbersDiff'

import useContractReader from './ContractReader'

/** Returns claimable amount of project tokens for user with address `userAddress` and balance `totalBalance`. */
export default function useClaimableOverflowOf(
  userAddress: string | undefined,
  totalBalance: BigNumber | undefined,
  projectId: BigNumberish | undefined,
  terminalName: TerminalName | undefined,
) {
  const _projectId = projectId
    ? BigNumber.from(projectId).toHexString()
    : undefined

  return useContractReader<BigNumber>({
    contract: terminalName,
    functionName: 'claimableOverflowOf',
    args:
      userAddress && _projectId
        ? [userAddress, _projectId, totalBalance?.toHexString()]
        : null,
    valueDidChange: bigNumbersDiff,
    updateOn: useMemo(
      () =>
        _projectId && userAddress
          ? [
              {
                contract: terminalName,
                eventName: 'Pay',
                topics: [[], _projectId, userAddress],
              },
              {
                contract: terminalName,
                eventName: 'Redeem',
                topics: [_projectId, userAddress],
              },
            ]
          : undefined,
      [_projectId, userAddress, terminalName],
    ),
  })
}
