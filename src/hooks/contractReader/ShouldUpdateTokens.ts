import { BigNumber, BigNumberish } from 'ethers'
import { ContractName } from 'models/contract-name'
import { TerminalName } from 'models/terminal-name'
import { useMemo } from 'react'

export default function useShouldUpdateTokens(
  projectId: BigNumberish | undefined,
  terminalName: TerminalName | undefined,
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
              contract: ContractName.TicketBooth,
              eventName: 'Redeem',
              topics: _projectId ? [_projectId] : undefined,
            },
            {
              contract: ContractName.TicketBooth,
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
