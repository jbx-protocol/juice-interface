import { NetworkContext } from 'contexts/networkContext'
import { useContext } from 'react'
import { V1ProjectContext } from 'contexts/v1/projectContext'

import { useProjectOwner } from './ProjectOwner'
import { OperatorPermission, useHasPermissions } from './HasPermission'

export function useUserHasPermission(
  permission: OperatorPermission | OperatorPermission[],
) {
  const { userAddress } = useContext(NetworkContext)
  const { projectId, isPreviewMode } = useContext(V1ProjectContext)

  const { owner } = useProjectOwner()

  const hasOperatorPermission = useHasPermissions({
    operator: userAddress,
    account: owner,
    domain: projectId,
    permissionIndexes: Array.isArray(permission) ? permission : [permission],
  })

  if (isPreviewMode) return false

  const isOwner =
    userAddress && owner && userAddress.toLowerCase() === owner.toLowerCase()

  return (
    isOwner || hasOperatorPermission || process.env.NODE_ENV === 'development'
  )
}
