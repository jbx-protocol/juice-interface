import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useWallet } from 'hooks/Wallet'
import { V2V3OperatorPermission } from 'models/v2v3/permissions'
import { useContext } from 'react'
import { isEqualAddress } from 'utils/address'
import { useV2V3HasPermissions } from './useV2V3HasPermissions'

export function useV2V3WalletHasPermission(
  permission: V2V3OperatorPermission | V2V3OperatorPermission[],
): boolean {
  const { userAddress } = useWallet()
  const { projectOwnerAddress } = useContext(V2V3ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)

  const hasOperatorPermission = useV2V3HasPermissions({
    operator: userAddress,
    account: projectOwnerAddress,
    domain: projectId,
    permissions: Array.isArray(permission) ? permission : [permission],
  })

  const isOwner = isEqualAddress(userAddress, projectOwnerAddress)

  return (
    isOwner ||
    hasOperatorPermission.data ||
    process.env.NODE_ENV === 'development'
  )
}
