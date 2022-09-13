import { V3ProjectContext } from 'contexts/v3/projectContext'
import { useWallet } from 'hooks/Wallet'
import { V3OperatorPermission } from 'models/v3/permissions'
import { useContext } from 'react'

import useProjectOwner from './ProjectOwner'
import { useV3HasPermissions } from './V3HasPermissions'

export function useV3ConnectedWalletHasPermission(
  permission: V3OperatorPermission | V3OperatorPermission[],
) {
  const { userAddress } = useWallet()
  const { projectId, isPreviewMode } = useContext(V3ProjectContext)

  const { data: owner } = useProjectOwner(projectId)

  const hasOperatorPermission = useV3HasPermissions({
    operator: userAddress,
    account: owner,
    domain: projectId,
    permissions: Array.isArray(permission) ? permission : [permission],
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
