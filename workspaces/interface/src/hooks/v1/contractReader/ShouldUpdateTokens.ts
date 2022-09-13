import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { V1ContractName } from 'models/v1/contracts'
import { V1TerminalName } from 'models/v1/terminals'
import { useMemo } from 'react'

export default function useShouldUpdateTokens(
  projectId: BigNumberish | undefined,
  terminalName: V1TerminalName | undefined,
  userAddress: string | undefined,
) {
  const _projectId = projectId
    ? BigNumber.from(projectId).toHexString()
    : undefined

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
