/* eslint-disable @typescript-eslint/no-explicit-any */
import { getPublicClient } from '@wagmi/core'
import { CV_V3 } from 'constants/cv'
import { JUICEBOX_MONEY_PROJECT_METADATA_DOMAIN } from 'constants/metadataDomain'
import { readNetwork } from 'constants/networks'
import { PV_V1, PV_V2, PV_V4 } from 'constants/pv'
import { readProvider } from 'constants/readProvider'
import {
  readJbDirectoryControllerOf,
  getProjectMetadata as sdkGetProjectMetadata,
} from 'juice-sdk-core'
import { PV } from 'models/pv'
import { V2V3ContractName } from 'packages/v2v3/models/contracts'
import { loadV2V3Contract } from 'packages/v2v3/utils/loadV2V3Contract'
import { chainNameMap } from 'packages/v4/utils/networks'
import { wagmiConfig } from 'packages/v4/wagmiConfig'
import { PublicClient } from 'viem'
import { findProjectMetadata } from './ipfs'

export const getProjectMetadata = async (
  projectId: string | number,
  pv: PV = PV_V2,
  chain?: string | undefined,
) => {
  if (typeof projectId === 'string') {
    projectId = Number(projectId)
  }
  if (isNaN(projectId)) return undefined

  switch (pv) {
    case PV_V1:
      throw new Error('V1 projects are not supported')
    case PV_V2:
      const metadataCid = await V2V3GetMetadataCidFromContract(projectId)
      return findProjectMetadata({ metadataCid })
    case PV_V4:
      if (!chain) throw new Error('Chain is required for V4 projects')
      return await V4GetMetadataCidFromContract(projectId, chain)
  }
}

const V2V3GetMetadataCidFromContract = async (projectId: number) => {
  const JBProjects = await loadV2V3Contract(
    V2V3ContractName.JBProjects,
    readNetwork.name,
    readProvider,
    CV_V3, // Note: v2 and v3 use the same JBProjects, so the CV doesn't matter.
  )
  if (!JBProjects) {
    throw new Error(`contract not found ${V2V3ContractName.JBProjects}`)
  }
  const metadataCid = (await JBProjects.metadataContentOf(
    projectId,
    JUICEBOX_MONEY_PROJECT_METADATA_DOMAIN,
  )) as string

  return metadataCid
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
