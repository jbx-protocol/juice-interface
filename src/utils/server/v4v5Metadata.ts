/* eslint-disable @typescript-eslint/no-explicit-any */
import { getPublicClient } from '@wagmi/core'
import { OPEN_IPFS_GATEWAY_HOSTNAME } from 'constants/ipfs'
import {
  getProjectMetadata as sdkGetProjectMetadata,
  jbDirectoryAbi,
  jbContractAddress,
  JBCoreContracts,
} from 'juice-sdk-core'
import { readContract } from 'wagmi/actions'
import { JBChainId } from 'juice-sdk-react'
import { wagmiConfig } from 'contexts/Para/Providers'
import { PublicClient } from 'viem'

export const getV4V5ProjectMetadata = async (
  projectId: string | number,
  chainId?: JBChainId | undefined,
  version: '4' | '5' = '4',
) => {
  if (typeof projectId === 'string') {
    projectId = Number(projectId)
  }

  if (isNaN(projectId)) return undefined
  if (!chainId) throw new Error('Chain ID is required for V4/V5 projects')

  return await V4V5GetMetadataCidFromContract(projectId, chainId, version)
}

const V4V5GetMetadataCidFromContract = async (
  projectId: number,
  chainId: JBChainId,
  version: '4' | '5' = '4',
) => {
  if (!chainId) throw new Error('Chain id not found for chain')
  const directoryAddress = jbContractAddress[version][JBCoreContracts.JBDirectory][chainId]
  const jbControllerAddress = await readContract(wagmiConfig, {
    abi: jbDirectoryAbi,
    address: directoryAddress,
    functionName: 'controllerOf',
    args: [BigInt(projectId)],
    chainId,
  })
  const client = getPublicClient(wagmiConfig, {
    chainId,
  }) as PublicClient
  const metadata = await sdkGetProjectMetadata(
    client,
    {
      jbControllerAddress,
      projectId: BigInt(projectId),
    },
    {
      ipfsGatewayHostname: OPEN_IPFS_GATEWAY_HOSTNAME,
    },
  )

  return metadata
}
