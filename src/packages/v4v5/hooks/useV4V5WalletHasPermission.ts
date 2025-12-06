import {
  useJBChainId,
  useJBContractContext,
} from 'juice-sdk-react'
import { jbPermissionsAbi, jbContractAddress, JBCoreContracts } from 'juice-sdk-core'
import { useReadContract } from 'wagmi'

import { useGnosisSafe } from 'hooks/safe/useGnosisSafe'
import { useWallet } from 'hooks/Wallet'
import { isEqualAddress } from 'utils/address'
import { isSafeSigner } from 'utils/safe'
import { zeroAddress } from 'viem'
import { V4V5OperatorPermission } from '../models/v4Permissions'
import useV4V5ProjectOwnerOf from './useV4V5ProjectOwnerOf'
import { useV4V5Version } from '../contexts/V4V5VersionProvider'

export function useV4V5WalletHasPermission(
  permission: V4V5OperatorPermission | V4V5OperatorPermission[],
): boolean {
  const { userAddress } = useWallet()
  const chainId = useJBChainId()

  const { projectId } = useJBContractContext()
  const { data: projectOwnerAddress } = useV4V5ProjectOwnerOf()
  const { version } = useV4V5Version()

  // If project owner is a Safe, fetch Safe details to determine signer membership
  const { data: safeData } = useGnosisSafe(projectOwnerAddress, chainId)

  const _operator = userAddress ?? zeroAddress
  const _account = projectOwnerAddress ?? zeroAddress
  const versionString = version.toString() as '4' | '5'
  const permissionsAddress = chainId ? jbContractAddress[versionString][JBCoreContracts.JBPermissions][chainId as unknown as keyof typeof jbContractAddress[typeof versionString][JBCoreContracts.JBPermissions]] : undefined

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
  return isOwner || !!hasOperatorPermission.data
}
