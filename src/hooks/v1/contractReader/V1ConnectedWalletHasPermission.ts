import { useAccount } from 'wagmi'
import { useContext } from 'react'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { V1OperatorPermission } from 'models/v1/permissions'

import { useProjectOwner } from './ProjectOwner'
import { useV1HasPermissions } from './V1HasPermissions'

export function useV1ConnectedWalletHasPermission(
  permission: V1OperatorPermission | V1OperatorPermission[],
) {
  const { address: userAddress } = useAccount()
  const { projectId, isPreviewMode } = useContext(V1ProjectContext)

  const { owner } = useProjectOwner()

  const hasOperatorPermission = useV1HasPermissions({
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
