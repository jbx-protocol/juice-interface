import {
  useJBContractContext,
} from 'juice-sdk-react'
import { jbPermissionsAbi, jbContractAddress, JBCoreContracts } from 'juice-sdk-core'
import { useReadContract, useChainId } from 'wagmi'

import { useGnosisSafe } from 'hooks/safe/useGnosisSafe'
import { useWallet } from 'hooks/Wallet'
import { isEqualAddress } from 'utils/address'
import { isSafeSigner } from 'utils/safe'
import { zeroAddress } from 'viem'
import { V4V5OperatorPermission } from '../models/v4Permissions'
import useV4ProjectOwnerOf from './useV4V5ProjectOwnerOf'

export function useV4WalletHasPermission(
  permission: V4V5OperatorPermission | V4V5OperatorPermission[],
): boolean {
  const { userAddress } = useWallet()
  const chainId = useChainId()

  const { projectId } = useJBContractContext()
  const { data: projectOwnerAddress } = useV4ProjectOwnerOf()

  // If project owner is a Safe, fetch Safe details to determine signer membership
  const { data: safeData } = useGnosisSafe(projectOwnerAddress)

  const _operator = userAddress ?? zeroAddress
  const _account = projectOwnerAddress ?? zeroAddress
  const permissionsAddress = chainId ? jbContractAddress['4'][JBCoreContracts.JBPermissions][chainId as unknown as keyof typeof jbContractAddress['4'][JBCoreContracts.JBPermissions]] : undefined

  const hasOperatorPermission = useReadContract({
    abi: jbPermissionsAbi,
    address: permissionsAddress,
    functionName: 'hasPermissions',
    args: [
      _operator,
      _account,
      projectId,
      [BigInt(permission.toString())],
      true,
      true,
    ],
    chainId,
  })

  // Treat a Safe signer the same as the project owner if the project owner is a Safe
  const isSafeOwnerSigner =
    !!safeData && isSafeSigner({ address: userAddress, safe: safeData })
  const isOwner =
    isEqualAddress(userAddress, projectOwnerAddress) || isSafeOwnerSigner

  // Allow access if:
  // - wallet is direct owner
  // - wallet has explicit operator permission
  // - wallet is a signer on the Safe that owns the project (covers multisig ownership case)
  // - in development environment
  return (
    isOwner ||
    hasOperatorPermission.data ||
    process.env.NODE_ENV === 'development'
  )
}
