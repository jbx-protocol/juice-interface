import { V1TerminalName } from 'packages/v1/models/terminals'
import { useMemo } from 'react'
import { bigintsDiff, toHexString } from 'utils/bigNumbers'

import useContractReader from './useContractReader'

/** Returns balance in ETH of project with `projectId`. */
export default function useBalanceOfProject(
  projectId: number | undefined,
  terminalName: V1TerminalName | undefined,
) {
  return useContractReader<bigint>({
    contract: terminalName,
    functionName: 'balanceOf',
    args: projectId ? [projectId] : null,
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
