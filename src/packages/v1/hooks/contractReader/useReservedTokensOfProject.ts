import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { ProjectMetadataContext } from 'contexts/ProjectMetadataContext'
import { V1ProjectContext } from 'packages/v1/contexts/Project/V1ProjectContext'
import { V1ContractName } from 'packages/v1/models/contracts'
import { useContext, useMemo } from 'react'
import { bigNumbersDiff } from 'utils/bigNumbers'

import useContractReader from './useContractReader'

/** Returns supply of reserved tokens for project in current context, using provided `reservedRate` argument. */
export default function useReservedTokensOfProject(
  reservedRate: BigNumberish | undefined,
) {
  const { terminal } = useContext(V1ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)

  const _projectId = BigNumber.from(projectId).toHexString()

  return useContractReader<BigNumber>({
    contract: terminal?.name,
    functionName: 'reservedTicketBalanceOf',
    args:
      projectId && reservedRate
        ? [_projectId, BigNumber.from(reservedRate).toHexString()]
        : null,
    valueDidChange: bigNumbersDiff,
    updateOn: useMemo(
      () => [
        {
          contract: terminal?.name,
          eventName: 'Pay',
          topics: _projectId ? [[], _projectId] : undefined,
        },
        {
          contract: terminal?.name,
          eventName: 'PrintTickets',
          topics: _projectId ? [_projectId] : undefined,
        },
        {
          contract: V1ContractName.TicketBooth,
          eventName: 'Redeem',
          topics: _projectId ? [_projectId] : undefined,
        },
        {
          contract: terminal?.name,
          eventName: 'PrintReserveTickets',
          topics: _projectId ? [[], _projectId] : undefined,
        },
      ],
      [_projectId, terminal?.name],
    ),
  })
}
