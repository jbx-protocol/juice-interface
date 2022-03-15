import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { V1TerminalName } from 'models/v1/terminals'
import { useMemo } from 'react'
import { bigNumbersDiff } from 'utils/bigNumbers'

import useContractReader from './ContractReader'

/** Returns overflow in ETH of project with `projectId`. */
export default function useOverflowOfProject(
  projectId: BigNumberish | undefined,
  terminalName: V1TerminalName | undefined,
) {
  return useContractReader<BigNumber>({
    contract: terminalName,
    functionName: 'currentOverflowOf',
    args: projectId ? [BigNumber.from(projectId).toHexString()] : null,
    valueDidChange: bigNumbersDiff,
    updateOn: useMemo(
      () =>
        projectId
          ? [
              {
                contract: terminalName,
                eventName: 'Pay',
                topics: [[], BigNumber.from(projectId).toHexString()],
              },
              {
                contract: terminalName,
                eventName: 'Tap',
                topics: [[], BigNumber.from(projectId).toHexString()],
              },
            ]
          : undefined,
      [projectId, terminalName],
    ),
  })
}
