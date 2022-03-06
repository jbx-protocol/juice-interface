import { NetworkContext } from 'contexts/networkContext'
import { useContext } from 'react'

import { V2ContractName } from 'models/v2/contracts'
import { V2ProjectContext } from 'contexts/v2/projectContext'

import useOwnerOfProject from './OwnerOfProject'
import useContractReader from './V2ContractReader'

export enum V2OperatorPermission {
  'Configure' = 1,
  'PrintPreminedTickets' = 2,
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
  'PrintTickets' = 17,
}

export function useHasPermission(
  permission: V2OperatorPermission | V2OperatorPermission[],
) {
  const { userAddress } = useContext(NetworkContext)
  const { projectId } = useContext(V2ProjectContext)

  const owner = useOwnerOfProject(projectId).data

  const hasOperatorPermission = useContractReader<boolean>({
    contract: V2ContractName.JBOperatorStore,
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
