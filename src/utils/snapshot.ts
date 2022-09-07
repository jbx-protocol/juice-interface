import { BigNumber } from '@ethersproject/bignumber'
import axios from 'axios'
import { ProjectMetadataV4 } from 'models/project-metadata'

export const generateSnapshotSettings = ({
  handle,
  tokenSymbol,
  projectId,
  projectMetadata,
  projectOwnerAddress,
}: {
  handle: string
  tokenSymbol: string
  projectId: number
  projectMetadata: ProjectMetadataV4
  projectOwnerAddress: string
}) => {
  return {
    strategies: [
      {
        args: ['%{address}', BigNumber.from(projectId).toHexString()],
        symbol: tokenSymbol,
        address: '0xCBB8e16d998161AdB20465830107ca298995f371',
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
    ],
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
    network: '1',
    children: [],
    private: false,
    name: projectMetadata?.name,
    about: projectMetadata?.description,
    website: `https://juicebox.money/@${handle}`,
    twitter: projectMetadata?.twitter,
    symbol: tokenSymbol,
    avatar: projectMetadata.logoUri,
  }
}

export const pokeSnapshot = async (projectHandle: string) => {
  return await axios.get(
    `https://hub.snapshot.org/api/spaces/${projectHandle}.eth/poke`,
  )
}
