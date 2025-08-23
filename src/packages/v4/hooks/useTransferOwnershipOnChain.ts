import { readContract, waitForTransactionReceipt } from '@wagmi/core'
import { JBChainId, jbProjectsAddress } from 'juice-sdk-core'
import {
  useSuckers,
  useWriteJbProjectsSafeTransferFrom
} from 'juice-sdk-react'

import { jbProjectsAbi } from 'juice-sdk-react'
import { useCallback } from 'react'
import { Address } from 'viem'
import { wagmiConfig } from '../wagmiConfig'

export function useTransferOwnershipOnChain() {
  const { data: suckers } = useSuckers()
  const { writeContractAsync: safeTransferFromTx } = useWriteJbProjectsSafeTransferFrom()

  const transferOwnershipOnChain = useCallback(
    async (
      chainId: JBChainId,
      _fromAddress: Address, // Keep parameter for backward compatibility but don't use it
      toAddress: Address,
    ): Promise<string> => {
      // Find the project ID for this specific chain
      const sucker = suckers?.find(s => s.peerChainId === chainId)
      if (!sucker) {
        throw new Error(`No project found for chain ${chainId}`)
      }

      const chainProjectId = BigInt(sucker.projectId)

      // Dynamically fetch the current owner on this specific chain
      // This ensures we always use the correct owner, even if ownership
      // has been transferred on previous chains
      const ownerAddressOfThisChain = await readContract(wagmiConfig, {
        address: jbProjectsAddress[chainId] as Address,
        abi: jbProjectsAbi,
        functionName: 'ownerOf',
        args: [chainProjectId],
        chainId,
      }) as Address

      if (!ownerAddressOfThisChain) {
        throw new Error(`Could not determine current owner for project ${chainProjectId} on chain ${chainId}`)
      }

      // Execute the transfer ownership transaction using the current owner
      const args = [ownerAddressOfThisChain, toAddress, chainProjectId] as const
      
      const hash = await safeTransferFromTx({
        args,
        chainId,
      })

      // Wait for transaction to be confirmed
      await waitForTransactionReceipt(wagmiConfig, {
        hash,
        chainId,
      })

      // Transaction is now confirmed, return the hash
      return hash
    },
    [
      safeTransferFromTx,
      suckers,
    ],
  )

  return { transferOwnershipOnChain }
}
