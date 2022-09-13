import { V2ProjectContext } from 'contexts/v2/projectContext'
import { useWallet } from 'hooks/Wallet'
import { V2OperatorPermission } from 'models/v2/permissions'
import { useContext } from 'react'

import useProjectOwner from './ProjectOwner'
import { useV2HasPermissions } from './V2HasPermissions'

export function useV2ConnectedWalletHasPermission(
  permission: V2OperatorPermission | V2OperatorPermission[],
) {
  const { userAddress } = useWallet()
  const { projectId, isPreviewMode } = useContext(V2ProjectContext)

  const { data: owner } = useProjectOwner(projectId)

  const hasOperatorPermission = useV2HasPermissions({
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
