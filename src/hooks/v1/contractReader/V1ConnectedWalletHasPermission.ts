import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { useWallet } from 'hooks/Wallet'
import { V1OperatorPermission } from 'models/v1/permissions'
import { useContext } from 'react'
import { useProjectOwner } from './ProjectOwner'
import { useV1HasPermissions } from './V1HasPermissions'

export function useV1ConnectedWalletHasPermission(
  permission: V1OperatorPermission | V1OperatorPermission[],
) {
  const { userAddress } = useWallet()
  const { projectId } = useContext(ProjectMetadataContext)

  const { owner } = useProjectOwner()

  const hasOperatorPermission = useV1HasPermissions({
    operator: userAddress,
    account: owner,
    domain: projectId,
    permissionIndexes: Array.isArray(permission) ? permission : [permission],
  })

  const isOwner =
    userAddress && owner && userAddress.toLowerCase() === owner.toLowerCase()

  return (
    isOwner || hasOperatorPermission || process.env.NODE_ENV === 'development'
  )
}
