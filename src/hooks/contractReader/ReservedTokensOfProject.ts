import { BigNumber, BigNumberish } from 'ethers'
import { ContractName } from 'models/contract-name'
import { TerminalName } from 'models/terminal-name'
import { useMemo } from 'react'
import { bigNumbersDiff } from 'utils/bigNumbersDiff'

import useContractReader from './ContractReader'

/** Returns balance of reserved tokens for project with `projectId`. */
export default function useReservedTokensOfProject(
  projectId: BigNumberish | undefined,
  terminalName: TerminalName | undefined,
  reservedRate: BigNumberish | undefined,
) {
  const _projectId = BigNumber.from(projectId).toHexString()

  return useContractReader<BigNumber>({
    contract: terminalName,
    functionName: 'reservedTicketBalanceOf',
    args:
      projectId && reservedRate
        ? [_projectId, BigNumber.from(reservedRate).toHexString()]
        : null,
    valueDidChange: bigNumbersDiff,
    updateOn: useMemo(
      () => [
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
          contract: terminalName,
          eventName: 'PrintReserveTickets',
          topics: _projectId ? [[], _projectId] : undefined,
        },
      ],
      [_projectId, terminalName],
    ),
  })
}
