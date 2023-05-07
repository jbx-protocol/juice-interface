import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { useWallet } from 'hooks/Wallet'
import { V1OperatorPermission } from 'models/v1/permissions'
import { useContext } from 'react'
import { isEqualAddress } from 'utils/address'
import { useProjectOwner } from './useProjectOwner'
import { useV1HasPermissions } from './useV1HasPermissions'

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

  const isOwner = isEqualAddress(userAddress, owner)

  return (
    isOwner || hasOperatorPermission || process.env.NODE_ENV === 'development'
  )
}
