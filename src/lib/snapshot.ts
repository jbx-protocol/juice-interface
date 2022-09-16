import { BigNumber } from '@ethersproject/bignumber'
import axios from 'axios'
import { juiceboxEmojiImageUri } from 'constants/images'
import { readNetwork } from 'constants/networks'
import { ProjectMetadataV4 } from 'models/project-metadata'
import { IPFS_TAGS } from 'utils/ipfs'

/**
 * JB Docs:
 * https://info.juicebox.money/user/governance/snapshot
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
  projectMetadata: ProjectMetadataV4
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
        decimals: 18,
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
    name: projectMetadata?.name,
    about: '',
    website: `https://juicebox.money/@${handle}`,
    twitter: projectMetadata?.twitter,
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
  projectMetadata: ProjectMetadataV4
  projectOwnerAddress: string
  JBTokenStoreAddress: string
}): Promise<string | undefined> {
  const snapshotSettings = generateSnapshotSpaceSettings({
    handle,
    tokenSymbol,
    projectId,
    projectMetadata,
    projectOwnerAddress,
    JBTokenStoreAddress,
  })

  const res = await axios.post('/api/ipfs/pin', {
    data: snapshotSettings,
    options: {
      pinataMetadata: {
        keyvalues: {
          tag: IPFS_TAGS.SNAPSHOT_SETTINGS,
        } as any, // eslint-disable-line @typescript-eslint/no-explicit-any
        name: projectMetadata?.name,
      },
    },
  })
  console.info('Uploaded snapshot settings to IPFS: ', res.data.IpfsHash)
  return res.data.IpfsHash as string
}

export const pokeSnapshot = async (projectHandle: string) => {
  return await axios.get(
    `https://hub.snapshot.org/api/spaces/${projectHandle}.eth/poke`,
  )
}
