import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { useWallet } from 'hooks/Wallet'
import { V2OperatorPermission } from 'models/v2v3/permissions'
import { useContext } from 'react'
import { useV2HasPermissions } from './V2HasPermissions'

export function useV2ConnectedWalletHasPermission(
  permission: V2OperatorPermission | V2OperatorPermission[],
) {
  const { userAddress } = useWallet()
  const { isPreviewMode, projectOwnerAddress } = useContext(V2V3ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)

  const hasOperatorPermission = useV2HasPermissions({
    operator: userAddress,
    account: projectOwnerAddress,
    domain: projectId,
    permissions: Array.isArray(permission) ? permission : [permission],
  })

  if (isPreviewMode) return false

  const isOwner =
    userAddress &&
    projectOwnerAddress &&
    userAddress.toLowerCase() === projectOwnerAddress.toLowerCase()

  return (
    isOwner ||
    hasOperatorPermission.data ||
    process.env.NODE_ENV === 'development'
  )
}
