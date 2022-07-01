import { NetworkContext } from 'contexts/networkContext'
import { useContext } from 'react'

import { V2ContractName } from 'models/v2/contracts'
import { V2ProjectContext } from 'contexts/v2/projectContext'

import useProjectOwner from './ProjectOwner'
import useContractReader from './V2ContractReader'

export enum V2OperatorPermission {
  'RECONFIGURE' = 1,
  'REDEEM' = 2,
  'MIGRATE_CONTROLLER' = 3,
  'MIGRATE_TERMINAL' = 4,
  'PROCESS_FEES' = 5,
  'SET_METADATA' = 6,
  'ISSUE' = 7,
  'CHANGE_TOKEN' = 8,
  'MINT' = 9,
  'BURN' = 10,
  'CLAIM' = 11,
  'TRANSFER' = 12,
  'REQUIRE_CLAIM' = 13,
  'SET_CONTROLLER' = 14,
  'SET_TERMINALS' = 15,
  'SET_PRIMARY_TERMINAL' = 16,
  'USE_ALLOWANCE' = 17,
  'SET_SPLITS' = 18,
}

export function useHasPermission(
  permission: V2OperatorPermission | V2OperatorPermission[],
) {
  const { userAddress } = useContext(NetworkContext)
  const { projectId, isPreviewMode } = useContext(V2ProjectContext)

  const { data: owner } = useProjectOwner(projectId)
  const hasOperatorPermission = useContractReader<boolean>({
    contract: V2ContractName.JBOperatorStore,
    functionName: 'hasPermissions',
    args:
      userAddress && owner && projectId && !isPreviewMode
        ? [
            userAddress,
            owner,
            projectId,
            Array.isArray(permission) ? permission : [permission],
          ]
        : null,
  })

  if (isPreviewMode) return false

  const isOwner =
    userAddress && owner && userAddress.toLowerCase() === owner.toLowerCase()

  return (
    isOwner ||
    hasOperatorPermission.data ||
    process.env.NODE_ENV === 'development'
  )
}
