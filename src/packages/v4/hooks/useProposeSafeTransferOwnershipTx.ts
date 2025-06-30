import { JBChainId, jbProjectsAddress } from 'juice-sdk-core'
import {
  jbProjectsAbi,
  useSuckers
} from 'juice-sdk-react'
import { Address, encodeFunctionData } from 'viem'
import { SafeProposeTransactionResponse, useProposeSafeTransaction } from './useProposeSafeTransaction'

import { useCallback } from 'react'

export function useProposeSafeTransferOwnershipTx({ safeAddress }: { safeAddress: string }) {
  const { proposeTransaction } = useProposeSafeTransaction({ safeAddress })
  const { data: suckers } = useSuckers()

  const proposeTransferOwnershipTx = useCallback(
    async (
      chainId: JBChainId,
      fromAddress: Address,
      toAddress: Address,
    ): Promise<SafeProposeTransactionResponse> => {

      // Find the project ID for this specific chain
      const sucker = suckers?.find(s => s.peerChainId === chainId)
      if (!sucker) {
        throw new Error(`No project found for chain ${chainId}`)
      }

      const chainProjectId = BigInt(sucker.projectId)

      // Encode the safeTransferFrom function call
      const data = encodeFunctionData({
        abi: jbProjectsAbi,
        functionName: 'safeTransferFrom',
        args: [fromAddress, toAddress, chainProjectId],
      })

      // Propose the transaction to the Safe
      return await proposeTransaction({
        to: jbProjectsAddress[1] as Address,
        value: '0',
        data,
        chainId,
      })
    },
    [
      proposeTransaction,
      suckers,
    ],
  )

  return { proposeTransferOwnershipTx }
}
