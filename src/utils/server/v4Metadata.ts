/* eslint-disable @typescript-eslint/no-explicit-any */
import { getWagmiConfig } from '@getpara/evm-wallet-connectors'
import { getPublicClient } from '@wagmi/core'
import { OPEN_IPFS_GATEWAY_HOSTNAME } from 'constants/ipfs'
import {
  readJbDirectoryControllerOf,
  getProjectMetadata as sdkGetProjectMetadata,
} from 'juice-sdk-core'
import { JBChainId } from 'juice-sdk-react'
import { PublicClient } from 'viem'

export const getV4ProjectMetadata = async (
  projectId: string | number,
  chainId?: JBChainId | undefined,
) => {
  if (typeof projectId === 'string') {
    projectId = Number(projectId)
  }

  if (isNaN(projectId)) return undefined
  if (!chainId) throw new Error('Chain ID is required for V4 projects')

  return await V4GetMetadataCidFromContract(projectId, chainId)
}

const V4GetMetadataCidFromContract = async (
  projectId: number,
  chainId: JBChainId,
) => {
  if (!chainId) throw new Error('Chain id not found for chain')
  const wagmiConfig = getWagmiConfig()
  const jbControllerAddress = await readJbDirectoryControllerOf(wagmiConfig, {
    chainId,
    args: [BigInt(projectId)],
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
