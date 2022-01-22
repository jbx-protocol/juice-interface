import { NetworkContext } from 'contexts/networkContext'
import { ProjectContextV1 } from 'contexts/v1/projectContextV1'
import { JuiceboxV1ContractName } from 'models/contracts/juiceboxV1'
import { useContext } from 'react'

import useContractReaderV1 from './ContractReaderV1'

export enum OperatorPermission {
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
  permission: OperatorPermission | OperatorPermission[],
) {
  const { userAddress } = useContext(NetworkContext)
  const { projectId, owner } = useContext(ProjectContextV1)

  const hasOperatorPermission = useContractReaderV1<boolean>({
    contract: JuiceboxV1ContractName.OperatorStore,
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
