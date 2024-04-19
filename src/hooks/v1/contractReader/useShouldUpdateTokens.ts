import { V1ContractName } from 'models/v1/contracts'
import { V1TerminalName } from 'models/v1/terminals'
import { useMemo } from 'react'
import { BigintIsh, toHexString } from 'utils/bigNumbers'

export default function useShouldUpdateTokens(
  projectId: BigintIsh | undefined,
  terminalName: V1TerminalName | undefined,
  userAddress: string | undefined,
) {
  const _projectId = projectId ? toHexString(BigInt(projectId)) : undefined

  return useMemo(
    () =>
      userAddress && _projectId && terminalName
        ? [
            {
              contract: terminalName,
              eventName: 'Pay',
              topics: _projectId ? [[], _projectId] : undefined,
            },
            {
              contract: terminalName,
              eventName: 'PrintTickets',
              topics: _projectId ? [_projectId] : undefined,
            },
            {
              contract: V1ContractName.TicketBooth,
              eventName: 'Redeem',
              topics: _projectId ? [_projectId] : undefined,
            },
            {
              contract: V1ContractName.TicketBooth,
              eventName: 'Convert',
              topics:
                userAddress && _projectId
                  ? [userAddress, _projectId]
                  : undefined,
            },
          ]
        : [],
    [_projectId, userAddress, terminalName],
  )
}
