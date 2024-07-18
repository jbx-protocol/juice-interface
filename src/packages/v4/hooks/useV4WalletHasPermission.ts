import * as constants from '@ethersproject/constants'
import { useWallet } from 'hooks/Wallet'
import { useJBContractContext, useReadJbPermissionsHasPermissions } from 'juice-sdk-react'
import { isEqualAddress } from 'utils/address'
import { V4OperatorPermission } from '../models/v4Permissions'
import useProjectOwnerOf from './useV4ProjectOwnerOf'

export function useV4WalletHasPermission(
  permission: V4OperatorPermission | V4OperatorPermission[],
): boolean {
  const { userAddress } = useWallet()

  const { projectId } = useJBContractContext()
  const { data: projectOwnerAddress } = useProjectOwnerOf()

  const _operator = userAddress ?? constants.AddressZero
  const _account = projectOwnerAddress ?? constants.AddressZero
  const hasOperatorPermission = useReadJbPermissionsHasPermissions({
    args: [
      _operator, 
      _account, 
      projectId, 
      [BigInt(permission.toString())], 
      true, 
      true
    ],
  })

  const isOwner = isEqualAddress(userAddress, projectOwnerAddress)

  return (
    isOwner ||
    hasOperatorPermission.data ||
    process.env.NODE_ENV === 'development'
  )
}
