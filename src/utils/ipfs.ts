import { BigNumber } from '@ethersproject/bignumber'
import pinataClient, { PinataMetadata, PinataPinOptions } from '@pinata/sdk'
import { ProjectMetadataV3 } from 'models/project-metadata'
import { TrendingProject } from 'models/subgraph-entities/project'

import { IPFS_GATEWAY_HOSTNAME } from 'constants/ipfs'

const pinata_api_key = process.env.REACT_APP_PINATA_PINNER_KEY
const pinata_secret_api_key = process.env.REACT_APP_PINATA_PINNER_SECRET

if (!pinata_api_key || !pinata_secret_api_key) {
  throw 'Missing .env vars REACT_APP_PINATA_PINNER_KEY or REACT_APP_PINATA_PINNER_SECRET'
}

const pinata = pinataClient(pinata_api_key, pinata_secret_api_key)

export const IPFS_TAGS = {
  TRENDING_CACHE:
    process.env.NODE_ENV === 'production'
      ? 'trending_projects'
      : 'DEV_trending_projects',
  METADATA:
    process.env.NODE_ENV === 'production'
      ? 'juicebox_project_metadata'
      : 'DEV_juicebox_project_metadata',
  LOGO:
    process.env.NODE_ENV === 'production'
      ? 'juicebox_project_logo'
      : 'DEV_juicebox_project_logo',
}

export const getTrendingProjectsCache = () =>
  pinata.pinList({
    pageLimit: 1000,
    status: 'pinned',
    metadata: {
      keyvalues: {
        tag: {
          value: IPFS_TAGS.TRENDING_CACHE,
          op: 'eq',
        },
      },
    },
  })

// keyvalues will be upserted to existing metadata. A null value will remove an existing keyvalue
export const editMetadataForCid = (
  cid: string | undefined,
  options?: PinataMetadata,
) => (cid ? pinata.hashMetadata(cid, { ...options }) : undefined)

export const logoNameForHandle = (handle: string) => `juicebox-@${handle}-logo`

export const metadataNameForHandle = (handle: string) =>
  `juicebox-@${handle}-metadata`

export const ipfsCidUrl = (hash: string) =>
  `https://${IPFS_GATEWAY_HOSTNAME}/ipfs/${hash}`

export const cidFromUrl = (url: string | undefined) => url?.split('/').pop()

export const pinFileToIpfs = (
  file: File | Blob | string,
  options: PinataPinOptions,
) => pinata.pinFileToIPFS(file, options)

export const unpinIpfsFileByCid = (cid: string | undefined) =>
  cid
    ? pinata
        .unpin(cid)
        .then(() => true)
        .catch(err => {
          console.error('Failed to unpin file ', cid, err)
          return false
        })
    : Promise.resolve(false)

export const uploadProjectMetadata = (
  metadata: Omit<ProjectMetadataV3, 'version'>,
) =>
  pinata.pinJSONToIPFS(
    {
      ...metadata,
      version: 3,
    },
    {
      pinataMetadata: {
        keyvalues: {
          tag: IPFS_TAGS.METADATA,
        } as any,
        name: 'juicebox-project-metadata.json',
      },
    },
  )

const serializeTrendingProject = (project: TrendingProject) =>
  Object.entries(project).reduce(
    (acc, [key, val]) => ({
      ...acc,
      [key]: BigNumber.isBigNumber(val) ? val.toString() : val,
    }),
    {},
  )

export const uploadTrendingProjectsCache = (projects: TrendingProject[]) =>
  pinata.pinJSONToIPFS(
    { projects: projects.map(p => serializeTrendingProject(p)) },
    {
      pinataMetadata: {
        keyvalues: {
          tag: IPFS_TAGS.TRENDING_CACHE,
        } as any,
        name: 'juicebox-trending-projects.json',
      },
    },
  )
