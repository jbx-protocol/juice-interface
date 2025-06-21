import { useJBContractContext, useJBProjectMetadataContext, useWriteJbProjectsSafeTransferFrom } from 'juice-sdk-react'
import { useCallback, useContext } from 'react'

import { waitForTransactionReceipt } from '@wagmi/core'
import { ProjectMetadataContext } from 'contexts/ProjectMetadataContext'
import { TxHistoryContext } from 'contexts/Transaction/TxHistoryContext'
import { Address } from 'viem'
import { wagmiConfig } from '../wagmiConfig'
import useV4ProjectOwnerOf from './useV4ProjectOwnerOf'

export function useTransferProjectOwnershipTx() {
  const { addTransaction } = useContext(TxHistoryContext)
  const { projectId } = useJBContractContext()
  const { data: projectOwnerAddress } = useV4ProjectOwnerOf()
  
  // Get project title inline
  const { projectMetadata } = useContext(ProjectMetadataContext)
  const { metadata } = useJBProjectMetadataContext()
  const projectTitle = metadata?.data?.name ?? projectMetadata?.name ?? 'project'

  const { writeContractAsync: safeTransferFromTx } = useWriteJbProjectsSafeTransferFrom()

  return useCallback(
    async (
      { newOwnerAddress }: { newOwnerAddress: string },
      {
        onTransactionPending,
        onTransactionConfirmed,
        onTransactionError,
        onConfirmed,
        onError,
        onDone,
      }: {
        onTransactionPending?: (hash: string) => void
        onTransactionConfirmed?: () => void
        onTransactionError?: (error: Error) => void
        onConfirmed?: () => void
        onError?: (error: Error) => void
        onDone?: () => void
      }
    ) => {
      if (!projectId || !newOwnerAddress || !projectOwnerAddress) {
        onError?.(new Error('Missing required parameters'))
        onDone?.()
        return
      }

      const args = [projectOwnerAddress as Address, newOwnerAddress as Address, projectId] as const

      try {
        const hash = await safeTransferFromTx({
          args,
        })

        onTransactionPending?.(hash)
        addTransaction?.(`Transfer ownership of ${projectTitle}`, { hash })
        await waitForTransactionReceipt(wagmiConfig, {
          hash,
        })

        onTransactionConfirmed?.()
        onConfirmed?.()
      } catch (e) {
        const error = (e as Error) ?? new Error('Transaction failed')
        onTransactionError?.(error)
        onError?.(error)
      } finally {
        onDone?.()
      }
    },
    [
      safeTransferFromTx,
      projectId,
      projectOwnerAddress,
      projectTitle,
      addTransaction,
    ]
  )
}
