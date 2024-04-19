import { V1TerminalName } from 'models/v1/terminals'
import { useMemo } from 'react'
import { BigintIsh, bigintsDiff, toHexString } from 'utils/bigNumbers'

import useContractReader from './useContractReader'

/** Returns overflow in ETH of project with `projectId`. */
export default function useOverflowOfProject(
  projectId: BigintIsh | undefined,
  terminalName: V1TerminalName | undefined,
) {
  return useContractReader<bigint>({
    contract: terminalName,
    functionName: 'currentOverflowOf',
    args: projectId ? [toHexString(BigInt(projectId))] : null,
    valueDidChange: bigintsDiff,
    updateOn: useMemo(
      () =>
        projectId
          ? [
              {
                contract: terminalName,
                eventName: 'Pay',
                topics: [[], toHexString(BigInt(projectId))],
              },
              {
                contract: terminalName,
                eventName: 'Tap',
                topics: [[], toHexString(BigInt(projectId))],
              },
            ]
          : undefined,
      [projectId, terminalName],
    ),
  })
}
