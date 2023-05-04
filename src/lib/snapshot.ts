import axios from 'axios'
import { juiceboxEmojiImageUri } from 'constants/images'
import { readNetwork } from 'constants/networks'
import { WAD_DECIMALS } from 'constants/numbers'
import { BigNumber } from 'ethers'
import {
  AnyProjectMetadata,
  consolidateMetadata,
  ProjectMetadata,
} from 'models/projectMetadata'
import { pinJson } from './api/ipfs'

/**
 * JB Docs:
 * https://docs.juicebox.money/user/governance/snapshot
 *
 * Snapshot docs:
 * https://docs.snapshot.org/spaces/create/alternative-way-to-create-a-space
 */
const generateSnapshotSpaceSettings = ({
  handle,
  tokenSymbol,
  projectId,
  projectMetadata,
  projectOwnerAddress,
  JBTokenStoreAddress,
}: {
  handle: string
  tokenSymbol: string
  projectId: number
  projectMetadata: ProjectMetadata
  projectOwnerAddress: string
  JBTokenStoreAddress: string
}) => {
  const strategies = [
    {
      name: 'contract-call',
      params: {
        args: ['%{address}', BigNumber.from(projectId).toHexString()],
        symbol: tokenSymbol,
        address: JBTokenStoreAddress,
        decimals: WAD_DECIMALS,
        methodABI: {
          name: 'balanceOf',
          type: 'function',
          inputs: [
            {
              name: '',
              type: 'address',
              internalType: 'address',
            },
            {
              name: '',
              type: 'uint256',
              internalType: 'uint256',
            },
          ],
          outputs: [
            {
              name: '',
              type: 'uint256',
              internalType: 'uint256',
            },
          ],
          stateMutability: 'view',
        },
      },
    },
  ]

  const avatar = projectMetadata?.logoUri?.length
    ? projectMetadata.logoUri
    : juiceboxEmojiImageUri

  const settings = {
    strategies,
    categories: [],
    treasuries: [],
    admins: [projectOwnerAddress],
    members: [],
    plugins: {},
    filters: { minScore: 0, onlyMembers: false },
    voting: { delay: 0, hideAbstain: false, period: 0, quorum: 0, type: '' },
    validation: {
      name: 'basic',
      params: {},
    },
    network: `${readNetwork.chainId}`,
    children: [],
    private: false,
    name: projectMetadata.name,
    about: '',
    website: `https://juicebox.money/@${handle}`,
    twitter: projectMetadata.twitter,
    symbol: tokenSymbol,
    avatar,
  }

  return settings
}

// Uploads snapshot settings to IPFS
// returns CID which point to the settings on IPFS
export async function uploadSnapshotSettingsToIPFS({
  handle,
  tokenSymbol,
  projectId,
  projectMetadata,
  projectOwnerAddress,
  JBTokenStoreAddress,
}: {
  handle: string
  tokenSymbol: string
  projectId: number
  projectMetadata: AnyProjectMetadata
  projectOwnerAddress: string
  JBTokenStoreAddress: string
}): Promise<string> {
  const snapshotSettings = generateSnapshotSpaceSettings({
    handle,
    tokenSymbol,
    projectId,
    projectMetadata: consolidateMetadata(projectMetadata),
    projectOwnerAddress,
    JBTokenStoreAddress,
  })

  const res = await pinJson(snapshotSettings)
  console.info('Uploaded snapshot settings to IPFS: ', res.Hash)

  return res.Hash as string
}

export const pokeSnapshot = async (projectHandle: string) => {
  return await axios.get(
    `https://hub.snapshot.org/api/spaces/${projectHandle}.eth/poke`,
  )
}
