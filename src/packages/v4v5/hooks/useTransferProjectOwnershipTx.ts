import { useJBContractContext, useJBProjectMetadataContext, JBChainId } from 'juice-sdk-react'
import { jbProjectsAbi, jbContractAddress, JBCoreContracts } from 'juice-sdk-core'
import { useWriteContract, useChainId } from 'wagmi'
import { useCallback, useContext } from 'react'

import { waitForTransactionReceipt } from '@wagmi/core'
import { ProjectMetadataContext } from 'contexts/ProjectMetadataContext'
import { TxHistoryContext } from 'contexts/Transaction/TxHistoryContext'
import { Address } from 'viem'
import { wagmiConfig } from '../wagmiConfig'
import useV4V5ProjectOwnerOf from './useV4V5ProjectOwnerOf'
import { useV4V5Version } from '../contexts/V4V5VersionProvider'

export function useTransferProjectOwnershipTx() {
  const { addTransaction } = useContext(TxHistoryContext)
  const { projectId } = useJBContractContext()
  const { data: projectOwnerAddress } = useV4V5ProjectOwnerOf()
  const { version } = useV4V5Version()
  const versionString = version.toString() as '4' | '5'
  
  // Get project title inline
  const { projectMetadata } = useContext(ProjectMetadataContext)
  const { metadata } = useJBProjectMetadataContext()
  const projectTitle = metadata?.data?.name ?? projectMetadata?.name ?? 'project'

  const { writeContractAsync: safeTransferFromTx } = useWriteContract()
  const chainId = useChainId()

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
          address: jbContractAddress[versionString][JBCoreContracts.JBProjects][chainId as JBChainId] as Address,
          abi: jbProjectsAbi,
          functionName: 'safeTransferFrom',
          args,
          chainId,
        })

        onTransactionPending?.(hash)
        addTransaction?.(`Transfer ownership of ${projectTitle}`, { hash, chainId: chainId as JBChainId })
        await waitForTransactionReceipt(wagmiConfig, {
          hash,
          chainId: chainId as JBChainId,
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
      chainId,
      versionString,
    ]
  )
}
