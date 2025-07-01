import {
  useSuckers,
  useWriteJbProjectsSafeTransferFrom
} from 'juice-sdk-react'

import { waitForTransactionReceipt } from '@wagmi/core'
import { JBChainId } from 'juice-sdk-core'
import { useCallback } from 'react'
import { Address } from 'viem'
import { wagmiConfig } from '../wagmiConfig'

export function useTransferOwnershipOnChain() {
  const { data: suckers } = useSuckers()
  const { writeContractAsync: safeTransferFromTx } = useWriteJbProjectsSafeTransferFrom()

  const transferOwnershipOnChain = useCallback(
    async (
      chainId: JBChainId,
      fromAddress: Address,
      toAddress: Address,
    ): Promise<string> => {
      // Find the project ID for this specific chain
      const sucker = suckers?.find(s => s.peerChainId === chainId)
      if (!sucker) {
        throw new Error(`No project found for chain ${chainId}`)
      }

      const chainProjectId = BigInt(sucker.projectId)

      // Execute the transfer ownership transaction
      const args = [fromAddress, toAddress, chainProjectId] as const
      
      const hash = await safeTransferFromTx({
        args,
      })

      // Wait for transaction to be confirmed
      await waitForTransactionReceipt(wagmiConfig, {
        hash,
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
