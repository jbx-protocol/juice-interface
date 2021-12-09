import { NetworkContext } from 'contexts/networkContext'
import { ProjectContext } from 'contexts/projectContext'
import { ContractName } from 'models/contract-name'
import { useContext } from 'react'

import useContractReader from './ContractReader'

export enum OperatorPermission {
  'Configure' = 1,
  'PrintTickets' = 2,
  'Redeem' = 3,
  'Migrate' = 4,
  'SetHandle' = 5,
  'SetUri' = 6,
  'ClaimHandle' = 7,
  'RenewHandle' = 8,
  'Issue' = 9,
  'Stake' = 10,
  'Unstake' = 11,
  'Transfer' = 12,
  'Lock' = 13,
  'SetPayoutMods' = 14,
  'SetTicketMods' = 15,
  'SetTerminal' = 16,
}

export function useHasPermission(
  permission: OperatorPermission | OperatorPermission[],
) {
  const { userAddress } = useContext(NetworkContext)
  const { projectId, owner } = useContext(ProjectContext)

  const hasOperatorPermission = useContractReader<boolean>({
    contract: ContractName.OperatorStore,
    functionName: 'hasPermissions',
    args:
      userAddress && owner && projectId
        ? [
            userAddress,
            owner,
            projectId.toHexString(),
            Array.isArray(permission) ? permission : [permission],
          ]
        : null,
  })

  const isOwner =
    userAddress && owner && userAddress.toLowerCase() === owner.toLowerCase()

  return (
    isOwner || hasOperatorPermission || process.env.NODE_ENV === 'development'
  )
}
