import {
  useJBContractContext,
  useReadJbPermissionsHasPermissions,
} from 'juice-sdk-react'

import { useWallet } from 'hooks/Wallet'
import { isEqualAddress } from 'utils/address'
import { zeroAddress } from 'viem'
import { V4OperatorPermission } from '../models/v4Permissions'
import useV4ProjectOwnerOf from './useV4ProjectOwnerOf'

export function useV4WalletHasPermission(
  permission: V4OperatorPermission | V4OperatorPermission[],
): boolean {
  const { userAddress } = useWallet()

  const { projectId } = useJBContractContext()
  const { data: projectOwnerAddress } = useV4ProjectOwnerOf()

  const _operator = userAddress ?? zeroAddress
  const _account = projectOwnerAddress ?? zeroAddress
  const hasOperatorPermission = useReadJbPermissionsHasPermissions({
    args: [
      _operator,
      _account,
      projectId,
      [BigInt(permission.toString())],
      true,
      true,
    ],
  })

  const isOwner = isEqualAddress(userAddress, projectOwnerAddress)

  return (
    isOwner ||
    hasOperatorPermission.data ||
    process.env.NODE_ENV === 'development'
  )
}
