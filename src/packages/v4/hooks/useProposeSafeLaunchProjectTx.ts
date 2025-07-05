import { JBChainId, jb721TiersHookProjectDeployerAddress, jbProjectDeploymentAddresses } from 'juice-sdk-core'
import {
  jb721TiersHookProjectDeployerAbi,
  jbController4_1Abi
} from 'juice-sdk-react'
import { ContractFunctionArgs, encodeFunctionData } from 'viem'
import { SafeProposeTransactionResponse, useProposeSafeTransaction } from './useProposeSafeTransaction'

import { useCallback } from 'react'

export interface SafeLaunchProjectData {
  projectMetadataCID: string
  isNftProject: boolean
  nftData?: {
    rewardTierCids: string[]
    nftCollectionMetadataUri: string
  }
  standardProjectData?: {
    [k in JBChainId]?: ContractFunctionArgs<typeof jbController4_1Abi, 'nonpayable', 'launchProjectFor'>
  }
  nftProjectData?: {
    [k in JBChainId]?: ContractFunctionArgs<typeof jb721TiersHookProjectDeployerAbi, 'nonpayable', 'launchProjectFor'>
  }
}

export function useProposeSafeLaunchProjectTx({ safeAddress }: { safeAddress: string }) {
  const { proposeTransaction } = useProposeSafeTransaction({ safeAddress })
  const proposeLaunchProjectTx = useCallback(
    async (
      chainId: JBChainId,
      launchData: SafeLaunchProjectData,
    ): Promise<SafeProposeTransactionResponse> => {
      // Find the project deployment will happen on this chain

      let data: `0x${string}`
      let to: `0x${string}`

      if (launchData.isNftProject) {
        // NFT project launch
        const args = launchData.nftProjectData?.[chainId]
        if (!args) {
          throw new Error(`No NFT project data for chain ${chainId}`)
        }

        data = encodeFunctionData({
          abi: jb721TiersHookProjectDeployerAbi,
          functionName: 'launchProjectFor',
          args,
        })
        
        to = jb721TiersHookProjectDeployerAddress[chainId] as `0x${string}`
      } else {
        // Standard project launch
        const args = launchData.standardProjectData?.[chainId]
        if (!args) {
          throw new Error(`No standard project data for chain ${chainId}`)
        }

        data = encodeFunctionData({
          abi: jbController4_1Abi,
          functionName: 'launchProjectFor',
          args,
        })
        
        to = jbProjectDeploymentAddresses.JBController4_1[chainId] as `0x${string}`
      }

      // Propose the transaction to the Safe
      return await proposeTransaction({
        to,
        value: '0',
        data,
        chainId,
      })
    },
    [
      proposeTransaction,
    ],
  )

  return { proposeLaunchProjectTx }
}
