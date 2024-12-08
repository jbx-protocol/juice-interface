/* eslint-disable @typescript-eslint/no-explicit-any */
import { getPublicClient } from '@wagmi/core'
import {
  readJbDirectoryControllerOf,
  getProjectMetadata as sdkGetProjectMetadata,
} from 'juice-sdk-core'
import { chainNameMap } from 'packages/v4/utils/networks'
import { wagmiConfig } from 'packages/v4/wagmiConfig'
import { PublicClient } from 'viem'

export const getV4ProjectMetadata = async (
  projectId: string | number,
  chain?: string | undefined,
) => {
  if (typeof projectId === 'string') {
    projectId = Number(projectId)
  }
  if (isNaN(projectId)) return undefined

  if (!chain) throw new Error('Chain is required for V4 projects')
  return await V4GetMetadataCidFromContract(projectId, chain)
}

const V4GetMetadataCidFromContract = async (
  projectId: number,
  chainName: string,
) => {
  const chainId = chainNameMap[chainName]
  const jbControllerAddress = await readJbDirectoryControllerOf(wagmiConfig, {
    chainId,
    args: [BigInt(projectId)],
  })
  const client = getPublicClient(wagmiConfig, {
    chainId,
  }) as PublicClient
  const metadata = await sdkGetProjectMetadata(client, {
    jbControllerAddress,
    projectId: BigInt(projectId),
  })

  return metadata
}
