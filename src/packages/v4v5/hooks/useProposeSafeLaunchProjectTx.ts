import {
  JBChainId,
  jbContractAddress,
  JBCoreContracts,
  JB721HookContracts,
  jb721TiersHookProjectDeployerAbi,
  jb721TiersHookProjectDeployerV5Abi,
  jbController4_1Abi,
  jbControllerAbi,
  jbControllerV5Abi,
  jbProjectsAbi,
} from '@bananapus/nana-sdk-core'
import { readContract } from '@wagmi/core'
import { wagmiConfig } from 'contexts/Para/Providers'
import { ContractFunctionArgs, encodeFunctionData } from 'viem'
import { SafeProposeTransactionResponse, useProposeSafeTransaction } from './useProposeSafeTransaction'
import { useV4V5Version } from '../contexts/V4V5VersionProvider'

import { useCallback } from 'react'

export interface SafeLaunchProjectData {
  projectMetadataCID: string
  isNftProject: boolean
  nftData?: {
    rewardTierCids: string[]
    nftCollectionMetadataUri: string
  }
  standardProjectData?: {
    [k in JBChainId]?: ContractFunctionArgs<typeof jbControllerAbi, 'payable', 'launchProjectFor'>
  }
  nftProjectData?: {
    [k in JBChainId]?: ContractFunctionArgs<typeof jb721TiersHookProjectDeployerAbi, 'payable', 'launchProjectFor'>
  }
}

export function useProposeSafeLaunchProjectTx({ safeAddress }: { safeAddress: string }) {
  const { proposeTransaction } = useProposeSafeTransaction({ safeAddress })
  const { version } = useV4V5Version()
  const versionString = version.toString() as '4' | '5' | '6'
  const proposeLaunchProjectTx = useCallback(
    async (
      chainId: JBChainId,
      launchData: SafeLaunchProjectData,
      signerAddressOverride?: string,
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

        // The launch data carries both the v5 and v6 721 config key spellings, so it
        // encodes correctly under whichever ABI matches the version.
        data = version === 6
          ? encodeFunctionData({
              abi: jb721TiersHookProjectDeployerAbi,
              functionName: 'launchProjectFor',
              args,
            })
          : encodeFunctionData({
              abi: jb721TiersHookProjectDeployerV5Abi,
              functionName: 'launchProjectFor',
              args: args as unknown as ContractFunctionArgs<
                typeof jb721TiersHookProjectDeployerV5Abi,
                'nonpayable',
                'launchProjectFor'
              >,
            })

        to = jbContractAddress[versionString][JB721HookContracts.JB721TiersHookProjectDeployer][chainId] as `0x${string}`
      } else {
        // Standard project launch
        const args = launchData.standardProjectData?.[chainId]
        if (!args) {
          throw new Error(`No standard project data for chain ${chainId}`)
        }

        // The launch data carries both the v5 and v6 metadata key spellings, so it
        // encodes correctly under whichever ABI matches the version.
        data =
          version === 6
            ? encodeFunctionData({
                abi: jbControllerAbi,
                functionName: 'launchProjectFor',
                args,
              })
            : version === 4
            ? encodeFunctionData({
                abi: jbController4_1Abi,
                functionName: 'launchProjectFor',
                args: args as unknown as ContractFunctionArgs<
                  typeof jbController4_1Abi,
                  'nonpayable',
                  'launchProjectFor'
                >,
              })
            : encodeFunctionData({
                abi: jbControllerV5Abi,
                functionName: 'launchProjectFor',
                args: args as unknown as ContractFunctionArgs<
                  typeof jbControllerV5Abi,
                  'nonpayable',
                  'launchProjectFor'
                >,
              })

        // For standard projects, use JBController4_1 for v4, JBController for v5/v6
        to = version === 4
          ? jbContractAddress['4'][JBCoreContracts.JBController4_1][chainId] as `0x${string}`
          : jbContractAddress[versionString as '5' | '6'][JBCoreContracts.JBController][chainId] as `0x${string}`
      }

      // v6: launches are payable and revert unless msg.value == JBProjects.creationFee()
      // exactly, so the Safe tx must carry the fee.
      const value =
        version === 6
          ? (
              await readContract(wagmiConfig, {
                address: jbContractAddress['6'][JBCoreContracts.JBProjects][chainId],
                abi: jbProjectsAbi,
                functionName: 'creationFee',
                chainId,
              })
            ).toString()
          : '0'

      // Propose the transaction to the Safe
      return await proposeTransaction({
        to,
        value,
        data,
        chainId,
        signerAddressOverride,
      })
    },
    [
      proposeTransaction,
      version,
      versionString,
    ],
  )

  return { proposeLaunchProjectTx }
}
